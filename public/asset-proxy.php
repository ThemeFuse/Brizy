<?php


class Brizy_Public_AssetProxy extends Brizy_Public_AbstractProxy {

	const ENDPOINT_POST = '_post';

	/**
	 * @return string
	 */
	protected function get_endpoint_keys() {
		return array( Brizy_Editor::prefix(), Brizy_Editor::prefix( self::ENDPOINT_POST ) );
	}

	public function process_query() {
		global $wp_query;
		$vars = $wp_query->query_vars;

		// Check if user is not querying API
		$endpoint = Brizy_Editor::prefix();
		if ( ! isset( $wp_query->query_vars[ $endpoint ] ) || ! is_string( $wp_query->query_vars[ $endpoint ] ) ) {
			return;
		}

		if ( ! isset( $vars[ Brizy_Editor::prefix( self::ENDPOINT_POST ) ] ) || ! is_numeric( $vars[ Brizy_Editor::prefix( self::ENDPOINT_POST ) ] ) ) {
			return;
		}

		session_write_close();

		$postId = (int) $vars[ Brizy_Editor::prefix( self::ENDPOINT_POST ) ];

		if ( Brizy_Editor_Entity::isBrizyEnabled($postId) ) {
			$this->urlBuilder->set_post_id( $postId );
		}

		$endpoint_value = $wp_query->query_vars[ $endpoint ];

		// clean endpoint value
		$asset_path = "/" . ltrim( $endpoint_value, "/" );
		$asset_url  = $this->urlBuilder->external_asset_url( $asset_path );

		$new_path = $this->urlBuilder->page_upload_path( "/assets".str_replace( '/editor', '', $asset_path ) );

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
			$headers                  = array();
			$headers['Content-Type']  = self::get_mime( $new_path, 1 );
			$headers['Cache-Control'] = 'max-age=600';

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
