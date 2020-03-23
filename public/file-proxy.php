<?php


class Brizy_Public_FileProxy extends Brizy_Public_AbstractProxy {

	const ENDPOINT = '_file';

	/**
	 * @return []]
	 */
	protected function get_endpoint_keys() {
		return array( Brizy_Editor::prefix( self::ENDPOINT ) );
	}

	/**
	 * @return mixed|void
	 * @throws Exception
	 */
	public function process_query() {
		global $wp_query;
		$vars = $wp_query->query_vars;

		$endpointKey = Brizy_Editor::prefix( self::ENDPOINT );

		if ( isset( $vars[ $endpointKey ] ) && is_string( $vars[ $endpointKey ] ) && ! empty( $vars[ $endpointKey ] ) ) {
			session_write_close();

			try {
				// Set artificially high because GD uses uncompressed images in memory.
				session_write_close();
				wp_raise_memory_limit( 'image' );

				$content = self::get_asset_content( $vars[ $endpointKey ] );

				if ( $content !== false ) {
					echo $content;
				}
			} catch ( Exception $e ) {
				Brizy_Logger::instance()->exception( $e );
				status_header( 404 );
				global $wp_query;
				$wp_query->set_404();

				return;
			}

			exit;
		}
	}
}