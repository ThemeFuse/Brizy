<?php

class Brizy_Public_CropProxy extends Brizy_Public_AbstractProxy {

	const ENDPOINT = 'brizy_media';
	const ENDPOINT_FILTER = 'brizy_crop';
	const ENDPOINT_POST = 'brizy_post';

	/**
	 * @return string
	 */
	protected function get_endpoint_keys() {
		return array( self::ENDPOINT, self::ENDPOINT_FILTER, self::ENDPOINT_POST );
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

				$this->crop_local_asset( $vars[ self::ENDPOINT ], html_entity_decode( $vars[ self::ENDPOINT_FILTER ] ), (int) $vars[ self::ENDPOINT_POST ] );
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
	 *
	 * @throws Exception
	 */
	private function crop_local_asset( $attachment_hash, $filter, $post_id ) {
		try {

			$attachment = $this->getAttachment( $attachment_hash );

			if ( ! $attachment ) {
				throw new Exception( 'Media not found' );
			}

			$media_url = get_attached_file( $attachment->ID );

			$project    = Brizy_Editor_Project::get();
			//$brizy_post = Brizy_Editor_Post::get( $post_id );

			$media_cache     = new Brizy_Editor_CropCacheMedia( $project, $post_id );
			$crop_media_path = $media_cache->crop_media( $media_url, $filter );
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