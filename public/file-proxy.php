<?php


class Brizy_Public_FileProxy extends Brizy_Public_AbstractProxy {

	const ENDPOINT = 'brizy_file';

	/**
	 * @return string
	 */
	protected function get_endpoint_keys() {
		return array( self::ENDPOINT );
	}

	/**
	 * @return mixed|void
	 * @throws Exception
	 */
	public function process_query() {
		global $wp_query;

		$vars = $wp_query->query_vars;

		if ( isset( $vars[ self::ENDPOINT ] ) && is_string( $vars[ self::ENDPOINT ] ) && ! empty( $vars[ self::ENDPOINT ] ) ) {
			session_write_close();

			try {
				// Set artificially high because GD uses uncompressed images in memory.
				session_write_close();
				wp_raise_memory_limit( 'image' );

				$content = self::get_asset_content( $vars[ self::ENDPOINT ] );

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