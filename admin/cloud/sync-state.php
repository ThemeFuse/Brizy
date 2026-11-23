<?php

/**
 * Remembers the failed cloud uploads of a block or layout, so the sync does not repeat an
 * upload that cannot succeed.
 *
 * The state is kept per cloud account and is tied to the data version of the entity and to the
 * plugin version: once the entity is saved again or the plugin is updated the old failure no
 * longer applies and the upload is retried.
 */
class Brizy_Admin_Cloud_SyncState {

	const META_KEY = 'brizy-cloud-sync-failure';

	/**
	 * First retry after 10 minutes, then the delay doubles up to one day.
	 */
	const RETRY_BASE_DELAY = 300;
	const RETRY_MAX_DELAY = 86400;

	/**
	 * @param int $postId
	 * @param string|int $cloudAccountId
	 *
	 * @return bool True when the upload must not be attempted now.
	 */
	public static function isBlocked( $postId, $cloudAccountId ) {
		return self::isStateBlocked( self::getAll( $postId ), $cloudAccountId, self::getDataVersion( $postId ) );
	}

	/**
	 * Same as isBlocked() for values that are already loaded, so a list of posts can be checked
	 * without reading the meta of each one.
	 *
	 * @param mixed $all The value of the META_KEY post meta.
	 * @param string|int $cloudAccountId
	 * @param int $dataVersion The current data version of the entity.
	 *
	 * @return bool
	 */
	public static function isStateBlocked( $all, $cloudAccountId, $dataVersion ) {
		$state = self::current( $all, $cloudAccountId, $dataVersion );

		if ( ! $state || empty( $state['attempts'] ) ) {
			return false;
		}

		return ! empty( $state['final'] ) || $state['retryAfter'] > time();
	}

	/**
	 * @param mixed $all The value of the META_KEY post meta.
	 * @param string|int $cloudAccountId
	 * @param int $dataVersion The current data version of the entity.
	 *
	 * @return bool True when the cloud rejected the entity, so a retry cannot succeed.
	 */
	public static function isStateFinal( $all, $cloudAccountId, $dataVersion ) {
		$state = self::current( $all, $cloudAccountId, $dataVersion );

		return $state && ! empty( $state['attempts'] ) && ! empty( $state['final'] );
	}

	/**
	 * Records that an upload is about to start. If the request dies before the outcome is known
	 * the attempt counts as a failed one; otherwise recordFailure() or clear() replaces it.
	 *
	 * @param int $postId
	 * @param string|int $cloudAccountId
	 */
	public static function recordAttempt( $postId, $cloudAccountId ) {
		$state    = self::get( $postId, $cloudAccountId );
		$attempts = ( $state ? (int) $state['attempts'] : 0 ) + 1;

		self::set( $postId, $cloudAccountId, array(
			'attempts'   => $attempts,
			'pending'    => true,
			'final'      => false,
			'retryAfter' => self::retryAfter( $attempts ),
			'status'     => 0,
			'message'    => 'The sync did not finish',
		) + ( $state ? $state : array() ) );
	}

	/**
	 * @param int $postId
	 * @param string|int $cloudAccountId
	 * @param \Throwable $exception
	 */
	public static function recordFailure( $postId, $cloudAccountId, $exception ) {
		$state = self::get( $postId, $cloudAccountId );
		// the attempt was already counted by recordAttempt()
		$attempts = ( $state ? (int) $state['attempts'] : 0 ) + ( $state && ! empty( $state['pending'] ) ? 0 : 1 );
		$isUpload = $exception instanceof Brizy_Admin_Cloud_UploadException;

		self::set( $postId, $cloudAccountId, array(
			'attempts'   => $attempts,
			'pending'    => false,
			'final'      => $isUpload && $exception->isFinal(),
			'retryAfter' => self::retryAfter( $attempts ),
			'status'     => $isUpload ? $exception->getCode() : 0,
			'message'    => $exception->getMessage(),
		) + ( $state ? $state : array() ) );
	}

	private static function retryAfter( $attempts ) {
		return time() + (int) min( self::RETRY_BASE_DELAY * pow( 2, min( $attempts, 20 ) ), self::RETRY_MAX_DELAY );
	}

	/**
	 * A screenshot rejected by the cloud is not uploaded again, but it does not stop the upload
	 * of the entity itself.
	 *
	 * @param int $postId
	 * @param string|int $cloudAccountId
	 */
	public static function recordScreenshotRejected( $postId, $cloudAccountId ) {
		$state = self::get( $postId, $cloudAccountId );

		self::set( $postId, $cloudAccountId, array( 'screenshotRejected' => true ) + ( $state ? $state : array( 'attempts' => 0 ) ) );
	}

	/**
	 * @param int $postId
	 * @param string|int $cloudAccountId
	 *
	 * @return bool
	 */
	public static function isScreenshotRejected( $postId, $cloudAccountId ) {
		$state = self::get( $postId, $cloudAccountId );

		return $state && ! empty( $state['screenshotRejected'] );
	}

	/**
	 * @param int $postId
	 * @param string|int $cloudAccountId
	 */
	public static function clear( $postId, $cloudAccountId ) {
		$all = self::getAll( $postId );

		if ( ! isset( $all[ $cloudAccountId ] ) ) {
			return;
		}

		unset( $all[ $cloudAccountId ] );

		if ( $all ) {
			update_post_meta( $postId, self::META_KEY, $all );
		} else {
			delete_post_meta( $postId, self::META_KEY );
		}
	}

	/**
	 * @return array|null The state recorded for the current data version of the entity.
	 */
	private static function get( $postId, $cloudAccountId ) {
		return self::current( self::getAll( $postId ), $cloudAccountId, self::getDataVersion( $postId ) );
	}

	private static function current( $all, $cloudAccountId, $dataVersion ) {
		if ( ! is_array( $all ) || ! isset( $all[ $cloudAccountId ] ) || ! is_array( $all[ $cloudAccountId ] ) ) {
			return null;
		}

		$state = $all[ $cloudAccountId ];

		if ( ! isset( $state['dataVersion'], $state['pluginVersion'] ) ||
		     $state['dataVersion'] !== (int) $dataVersion ||
		     $state['pluginVersion'] !== BRIZY_VERSION ) {
			return null;
		}

		return $state;
	}

	private static function set( $postId, $cloudAccountId, $state ) {
		$all                    = self::getAll( $postId );
		$state['dataVersion']   = self::getDataVersion( $postId );
		$state['pluginVersion'] = BRIZY_VERSION;
		$all[ $cloudAccountId ] = $state;

		update_post_meta( $postId, self::META_KEY, $all );
	}

	private static function getAll( $postId ) {
		$all = get_post_meta( $postId, self::META_KEY, true );

		return is_array( $all ) ? $all : array();
	}

	private static function getDataVersion( $postId ) {
		return (int) get_post_meta( $postId, Brizy_Editor_Entity::BRIZY_DATA_VERSION_KEY, true );
	}
}
