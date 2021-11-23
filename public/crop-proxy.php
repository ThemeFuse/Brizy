<?php

class Brizy_Public_CropProxy extends Brizy_Public_AbstractProxy {

	const ENDPOINT        = '_media';
	const ENDPOINT_FILTER = '_crop';
	const ENDPOINT_POST   = '_post';

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

		$vars           = $wp_query->query_vars;
		$endpointKey    = Brizy_Editor::prefix( self::ENDPOINT );
		$endpointFilter = Brizy_Editor::prefix( self::ENDPOINT_FILTER );

		if ( empty( $vars[ $endpointKey ] ) || empty( $vars[ $endpointFilter ] ) ) {
			return;
		}

		session_write_close();

		try {

			$size        = html_entity_decode( $vars[ $endpointFilter ] );
			$mediaCache  = new Brizy_Editor_CropCacheMedia( Brizy_Editor_Project::get() );
			$croppedPath = $mediaCache->crop_media( $vars[ $endpointKey ], $size );

			do_action( 'brizy_before_send_asset' );

			$this->send_file( $croppedPath );

		} catch ( Exception $e ) {
			Brizy_Logger::instance()->exception( $e );
			status_header( 404 );
			global $wp_query;
			$wp_query->set_404();

			return;
		}
	}
}