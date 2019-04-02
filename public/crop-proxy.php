<?php

class Brizy_Public_CropProxy extends Brizy_Public_AbstractProxy {

	const ENDPOINT = 'brizy_media';
	const ENDPOINT_FILTER = 'brizy_crop';
	const ENDPOINT_OPTIMIZE = 'brizy_optimize';
	const ENDPOINT_POST = 'brizy_post';

	/**
	 * @return string
	 */
	protected function get_endpoint_keys() {
		return array( self::ENDPOINT, self::ENDPOINT_FILTER, self::ENDPOINT_POST, self::ENDPOINT_OPTIMIZE );
	}

	/**
	 * @return mixed|void
	 * @throws Exception
	 */
	public function process_query() {
		global $wp_query;

		$vars = $wp_query->query_vars;

		if ( ! isset( $vars[ self::ENDPOINT_FILTER ] ) || ! is_string( $vars[ self::ENDPOINT_FILTER ] ) || empty( $vars[ self::ENDPOINT_FILTER ] ) ) {
			return;
		}

		if ( ! isset( $vars[ self::ENDPOINT_POST ] ) || ! is_numeric( $vars[ self::ENDPOINT_POST ] ) ) {
			return;
		}

		if ( isset( $vars[ self::ENDPOINT ] ) && is_string( $vars[ self::ENDPOINT ] ) && ! empty( $vars[ self::ENDPOINT ] ) ) {

			session_write_close();

			try {
				// Set artificially high because GD uses uncompressed images in memory.
				wp_raise_memory_limit( 'image' );

				$optimize              = (int) ( isset( $vars[ self::ENDPOINT_OPTIMIZE ] ) ? $vars[ self::ENDPOINT_OPTIMIZE ] : false );
				$wp_get_post_parent_id = wp_is_post_revision( $vars[ self::ENDPOINT_POST ] ) ? wp_get_post_parent_id( $vars[ self::ENDPOINT_POST ] ) : $vars[ self::ENDPOINT_POST ];
				$this->crop_local_asset( $vars[ self::ENDPOINT ], html_entity_decode( $vars[ self::ENDPOINT_FILTER ] ), (int) $wp_get_post_parent_id, $optimize );

			} catch ( Exception $e ) {
				Brizy_Logger::instance()->exception( $e );
				status_header( 404 );
				global $wp_query;
				$wp_query->set_404();

				return;
			}
		}
	}


	/**
	 * @param $attachment_hash
	 * @param $filter
	 * @param $post_id
	 * @param bool $optimize
	 *
	 * @throws Exception
	 */
	private function crop_local_asset( $attachment_hash, $filter, $post_id, $optimize = false ) {
		try {

			$attachment = $this->getAttachment( $attachment_hash );

			if ( ! $attachment ) {
				throw new Exception( 'Media not found' );
			}

			$media_url = get_attached_file( $attachment->ID );

			$project = Brizy_Editor_Project::get();
			//$brizy_post = Brizy_Editor_Post::get( $post_id );

			$media_cache     = new Brizy_Editor_CropCacheMedia( $project, $post_id );
			$crop_media_path = $media_cache->crop_media( $media_url, $filter, true, $optimize );
			$this->send_file( $crop_media_path );

		} catch ( Exception $e ) {
			Brizy_Logger::instance()->exception( $e );
			throw new Exception( 'Unable to crop media' );
		}
	}

	private function getAttachment( $hash ) {
		$attachment = null;
		if ( is_numeric( $hash ) ) {
			$attachment = get_post( (int) $hash );
		} else {
			$attachments = get_posts( array(
				'meta_key'   => 'brizy_attachment_uid',
				'meta_value' => $hash,
				'post_type'  => 'attachment',
			) );

			if ( isset( $attachments[0] ) ) {
				$attachment = $attachments[0];
			}
		}

		return $attachment;
	}
}