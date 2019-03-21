<?php


class Brizy_Public_AssetProxy extends Brizy_Public_AbstractProxy {

	const ENDPOINT = 'brizy';
	const ENDPOINT_POST = 'brizy_post';

	/**
	 * @return string
	 */
	protected function get_endpoint_keys() {
		return array( self::ENDPOINT, self::ENDPOINT_POST );
	}

	public function process_query() {
		global $wp_query;
		$vars = $wp_query->query_vars;

		// Check if user is not querying API
		if ( ! isset( $wp_query->query_vars[ self::ENDPOINT ] ) || ! is_string( $wp_query->query_vars[ self::ENDPOINT ] ) ) {
			return;
		}

		if ( ! isset( $vars[ self::ENDPOINT_POST ] ) || ! is_numeric( $vars[ self::ENDPOINT_POST ] ) ) {
			return;
		}

		session_write_close();

		$brizyPost = Brizy_Editor_Post::get( (int) $vars[ self::ENDPOINT_POST ] );

		if ( $brizyPost->uses_editor() ) {
			$this->urlBuilder->set_post_id( $brizyPost->get_parent_id() );
		}

		$endpoint_value = $wp_query->query_vars[ self::ENDPOINT ];

		// clean endpoint value
		$asset_path = "/" . ltrim( $endpoint_value, "/" );
		$asset_url  = $this->urlBuilder->external_asset_url( $asset_path );

		$new_path = $this->urlBuilder->page_upload_path( "assets/icons/" . basename( $asset_path ) );

		if ( ! file_exists( $new_path ) ) {
			$store_result = $this->store_file( $asset_url, $new_path );

			if ( ! $store_result ) {
				global $wp_query;
				$wp_query->set_404();

				return;
			}
		}

		if ( file_exists( $new_path ) ) {

			$content = file_get_contents( $new_path );

			// send headers
			$headers                   = array();
			$headers['Content-Type']   = $this->get_mime( $new_path, 1 );
			$headers['Cache-Control']  = 'max-age=600';

			foreach ( $headers as $key => $val ) {
				if ( is_array( $val ) ) {
					$val = implode( ', ', $val );
				}

				header( "{$key}: {$val}" );
			}

			// send file content
			echo $content;
			exit;
		}

		global $wp_query;
		$wp_query->set_404();

		return;
	}
}