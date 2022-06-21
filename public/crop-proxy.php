<?php

class Brizy_Public_CropProxy extends Brizy_Public_AbstractProxy {

	const ENDPOINT        = '_media';
	const ENDPOINT_FILTER = '_crop';

	/**
	 * @return array
	 */
	protected function get_endpoint_keys() {
		return [
			Brizy_Editor::prefix( self::ENDPOINT ),
			Brizy_Editor::prefix( self::ENDPOINT_FILTER )
		];
	}

	/**
	 * @return void
	 * @throws Exception
	 */
	public function process_query() {
		global $wp_query;

		$vars    = $wp_query->query_vars;
		$uidKey  = Brizy_Editor::prefix( self::ENDPOINT );
		$sizeKey = Brizy_Editor::prefix( self::ENDPOINT_FILTER );

		if ( empty( $vars[ $uidKey ] ) || empty( $vars[ $sizeKey ] ) ) {
			return;
		}

		session_write_close();

		try {

			$uid        = $vars[ $uidKey ];
			$mediaCache = new Brizy_Editor_CropCacheMedia( Brizy_Editor_Project::get() );

			try {
				if ( substr( $uid, 0, 3 ) !== 'wp-' ) {
					$mediaCache->getAttachmentId( $uid );
				}
			} catch ( Exception $e ) {
				$mediaCache->download_original_image( $uid );
			}

			$croppedPath = $mediaCache->crop_media( $uid, html_entity_decode( $vars[ $sizeKey ] ) );

			do_action( 'brizy_before_send_asset' );

			$this->send_file( $croppedPath );

		} catch ( Exception $e ) {
			status_header( 404, $e->getMessage() );
			global $wp_query;
			$wp_query->set_404();

			return;
		}
	}
}