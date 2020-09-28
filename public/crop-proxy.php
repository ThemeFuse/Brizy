<?php

class Brizy_Public_CropProxy extends Brizy_Public_AbstractProxy {

	const ENDPOINT = '_media';
	const ENDPOINT_FILTER = '_crop';
	const ENDPOINT_POST = '_post';
	const ENDPOINT_OPTIMIZE = '_optimize';

	/**
	 * @return string
	 */
	protected function get_endpoint_keys() {
		return array(
			Brizy_Editor::prefix( self::ENDPOINT ),
			Brizy_Editor::prefix( self::ENDPOINT_FILTER ),
			Brizy_Editor::prefix( self::ENDPOINT_POST ),
			Brizy_Editor::prefix( self::ENDPOINT_OPTIMIZE )
		);
	}

	/**
	 * @return mixed|void
	 * @throws Exception
	 */
	public function process_query() {
		global $wp_query;

		$vars = $wp_query->query_vars;

		$endpointKey         =  Brizy_Editor::prefix( self::ENDPOINT );
		$endpointFilterKey   =  Brizy_Editor::prefix( self::ENDPOINT_FILTER );
		$endpointPostKey     =  Brizy_Editor::prefix( self::ENDPOINT_POST );
		$endpointOptimizeKey =  Brizy_Editor::prefix( self::ENDPOINT_OPTIMIZE );

		if ( ! isset( $vars[ $endpointFilterKey ] ) || ! is_string( $vars[ $endpointFilterKey ] ) || empty( $vars[ $endpointFilterKey ] ) ) {
			return;
		}

		if ( ! isset( $vars[ $endpointPostKey ] ) || ! is_numeric( $vars[ $endpointPostKey ] ) ) {
			return;
		}

		if ( isset( $vars[ $endpointKey ] ) && is_string( $vars[ $endpointKey ] ) && ! empty( $vars[ $endpointKey ] ) ) {

			session_write_close();

			try {
				// Set artificially high because GD uses uncompressed images in memory.
				wp_raise_memory_limit( 'image' );

				$optimize              = (int) ( isset( $vars[ $endpointOptimizeKey ] ) ? $vars[ $endpointOptimizeKey ] : false );
				$wp_get_post_parent_id = wp_is_post_revision( $vars[ $endpointPostKey ] ) ? wp_get_post_parent_id( $vars[ $endpointPostKey ] ) : $vars[ $endpointPostKey ];
				$this->crop_local_asset( $vars[ $endpointKey ], html_entity_decode( $vars[ $endpointFilterKey ] ), (int) $wp_get_post_parent_id, $optimize );

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
	 * @param $optimize
	 *
	 * @throws Exception
	 */
	private function crop_local_asset( $attachment_hash, $filter, $post_id, $optimize ) {
		try {

			$attachment = $this->getAttachment( $attachment_hash );

			if ( ! $attachment ) {
				throw new Exception( 'Media not found' );
			}

			$media_path = get_attached_file( $attachment->ID );

			if ( ! file_exists( $media_path ) ) {
				throw new Exception( "Image {$media_path} doesn't exists" );
			}

			$media_cache  = new Brizy_Editor_CropCacheMedia( Brizy_Editor_Project::get(), $post_id, $media_path, $filter );

			if ( $media_cache->have_optimizer() ) {
				try {
					try {
						$crop_media_path = $media_cache->optimize( $optimize );
					} catch (\Exception $e) {
						$crop_media_path = $media_cache->crop_local();
					}
				} catch (\Exception $e) {
					$crop_media_path = $media_path;
				}
			} else {

				try {
					$crop_media_path = $media_cache->crop_local();
				} catch (\Exception $e) {
					$crop_media_path = $media_path;
				}
			}

			if ( ! file_exists( $crop_media_path ) ) {
				$crop_media_path = $media_path;
			}

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