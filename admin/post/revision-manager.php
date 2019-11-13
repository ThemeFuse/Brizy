<?php


/**
 * Class Brizy_Admin_Post_RevisionManager
 */
class Brizy_Admin_Post_RevisionManager {

	/**
	 * @var Brizy_Admin_Post_AbstractMonitor[]
	 */
	protected $monitors = array();


	/**
	 * Brizy_Admin_Post_RevisionManager constructor.
	 */
	public function __construct() {
		add_action( 'save_post', array( $this, 'savePost' ), 11, 2 );
		add_action( 'wp_restore_post_revision', array( $this, 'restorePostRevisionMeta' ), 11, 2 );
	}

	/**
	 * @return Brizy_Admin_Post_AbstractMonitor[]
	 */
	public function getMonitors() {
		return $this->monitors;
	}

	/**
	 * @param Brizy_Admin_Post_AbstractMonitor[] $monitors
	 *
	 * @return Brizy_Admin_Post_RevisionManager
	 */
	public function setMonitors( $monitors ) {
		$this->monitors = $monitors;

		return $this;
	}

	/**
	 * @param Brizy_Admin_Post_AbstractMonitor $monitor
	 *
	 * @return Brizy_Admin_Post_RevisionManager
	 */
	public function addMonitor( $monitor ) {
		$this->monitors[] = $monitor;

		return $this;
	}

	/**
	 * @param $postId
	 * @param $type
	 *
	 * @return bool
	 */
	public function getMatchingMonitor( $postId, $type ) {
		foreach ( $this->monitors as $monitor ) {
			if ( $monitor->shouldStoreMetaRevision( $postId, $type ) ) {
				return $monitor;
			}
		}

		return false;
	}

	/**
	 * @param $postId
	 * @param $post
	 */
	public function savePost( $postId, $post ) {
		$postParentId = wp_is_post_revision( $postId );
		$postType     = get_post_type( $post->post_parent );

		// ignore all posts that are not watched
		if ( $postParentId && $monitor = $this->getMatchingMonitor( $postParentId, $postType ) ) {
			// copy meta data only for existing posts
			$this->copyMetaDataToRevision( $postParentId, $postId, $monitor );
		}
	}

	/**
	 * @param int $postId
	 * @param int $revisionId
	 */
	public function restorePostRevisionMeta( $postId, $revisionId ) {
		$postType = get_post_type( $postId );

		// ignore all posts that are not watched
		if ( $monitor = $this->getMatchingMonitor( $postId, $postType ) ) {
			// copy meta data only for existing posts
			$this->restoreRevisionMetaDataToPost( $postId, $revisionId, $monitor );
		}

	}

	/**
	 * This method will add all meta data entries from $post to $revision post
	 *
	 * @param int $post
	 * @param int $revision
	 * @param Brizy_Admin_Post_AbstractMonitor $monitor
	 */
	private function copyMetaDataToRevision( $post, $revision, $monitor ) {

		global $wpdb;
		$tablePostMeta    = $wpdb->postmeta;
		$meta_key_count   = count( $monitor->getPostMetaKeys() );
		$meta_keys_params = rtrim( str_repeat( '%s,', $meta_key_count ), ',' );
		$params           = array( (int) $revision, (int) $post );

		$this->cleanMetaData($post,$revision,$monitor);

		$query = "INSERT INTO {$tablePostMeta} (post_Id, meta_key, meta_value) 
									SELECT %d, meta_key, meta_value 
									FROM {$tablePostMeta} 
									WHERE post_id=%d";

		if ( $meta_key_count > 0 ) {
			$query  .= " and meta_key IN ({$meta_keys_params})";
			$params = array_merge( $params, $monitor->getPostMetaKeys() );
		} else {
			$query .= " and meta_key NOT IN ('_edit_last','_edit_lock','_thumbnail_id','_wp_attached_file','_wp_attachment_metadata')";
		}

		$wpdb->query( $wpdb->prepare( $query, $params ) );
	}

	private function cleanMetaData( $post, $revision, $monitor ) {
		global $wpdb;
		$params        = array( (int) $revision );
		$meta_key_count   = count( $monitor->getPostMetaKeys() );
		$meta_keys_params = rtrim( str_repeat( '%s,', $meta_key_count ), ',' );
		$tablePostMeta = "{$wpdb->prefix}postmeta";
		$query         = "DELETE FROM {$tablePostMeta} WHERE post_id=%d and meta_key IN ({$meta_keys_params})";
		$params = array_merge( $params, $monitor->getPostMetaKeys() );
		$wpdb->query( $wpdb->prepare( $query, $params ) );
	}

	/**
	 * This method will add all meta data entries from $revision to $post
	 *
	 * @param int $post
	 * @param int $revision
	 * @param Brizy_Admin_Post_AbstractMonitor $monitor
	 */
	private function restoreRevisionMetaDataToPost( $post, $revision, $monitor ) {
		global $wpdb;
		try {

			$tablePostMeta = "{$wpdb->prefix}postmeta";

			$wpdb->query( "START TRANSACTION" );

			$this->cleanMetakeys( $post, $monitor );

			$revisionMetaValues = $this->getRevisionMetaValues( $revision, $monitor );

			if ( $revisionMetaValues === false ) {
				throw new Exception();
			}

			foreach ( $revisionMetaValues as $meta ) {

				$existingMeta   = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$tablePostMeta}  WHERE meta_key = %s AND post_id = %d", $meta->meta_key, $post ) );
				$existingMetaId = isset( $existingMeta->meta_id ) ? $existingMeta->meta_id : 0;
				$res            = $wpdb->query( $wpdb->prepare( "REPLACE INTO {$tablePostMeta} VALUES (%d,%d,%s,%s)", $existingMetaId, $post, $meta->meta_key, $meta->meta_value ) );

				if ( $res === false ) {
					throw new Exception();
				}
			}
			$wpdb->query( 'COMMIT' );
		} catch ( Exception $e ) {
			$wpdb->query( 'ROLLBACK' );
		}

	}

	/**
	 * @param int $post
	 * @param Brizy_Admin_Post_AbstractMonitor $monitor
	 */
	private function cleanMetakeys( $post, $monitor ) {
		global $wpdb;

		$meta_key_count   = count( $monitor->getPostMetaKeys() );
		$params           = array( (int) $post );
		$meta_keys_params = rtrim( str_repeat( '%s,', $meta_key_count ), ',' );

		$query = "DELETE FROM {$wpdb->prefix}postmeta WHERE post_id=%d";

		if ( $meta_key_count > 0 ) {
			$query  .= " and meta_key IN ({$meta_keys_params})";
			$params = array_merge( $params, $monitor->getPostMetaKeys() );
		} else {
			$query .= " and meta_key NOT IN ('_edit_last','_edit_lock','_thumbnail_id','_wp_attached_file','_wp_attachment_metadata')";
		}

		$wpdb->query( $wpdb->prepare( $query, $params ) );
	}

	/**
	 * @param $revision
	 * @param $monitor
	 *
	 * @return array|null|object
	 */
	private function getRevisionMetaValues( $revision, $monitor ) {
		global $wpdb;

		$meta_key_count   = count( $monitor->getPostMetaKeys() );
		$params           = array( (int) $revision );
		$meta_keys_params = rtrim( str_repeat( '%s,', $meta_key_count ), ',' );

		$query = "SELECT * FROM {$wpdb->prefix}postmeta WHERE post_id=%d";

		if ( $meta_key_count > 0 ) {
			$query  .= " and meta_key IN ({$meta_keys_params})";
			$params = array_merge( $params, $monitor->getPostMetaKeys() );
		} else {
			$query .= " and meta_key NOT IN ('_edit_last','_edit_lock','_thumbnail_id','_wp_attached_file','_wp_attachment_metadata')";
		}

		$query = $wpdb->prepare( $query, $params );

		return $wpdb->get_results( $query );
	}


}