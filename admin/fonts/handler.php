<?php


class Brizy_Admin_Fonts_Handler extends Brizy_Public_AbstractProxy {
	const ENDPOINT = '-font';

	/**
	 * @return array
	 */
	protected function get_endpoint_keys() {
		return array( Brizy_Editor::prefix( self::ENDPOINT ) );
	}

	/**
	 * @return void
	 */
	public function process_query() {
		global $wp_query;
		$vars = $wp_query->query_vars;


		// Check if user is not querying API
		$ENDPOINT = Brizy_Editor::prefix( self::ENDPOINT );
		if ( ! isset( $vars[ $ENDPOINT ] ) || ! is_string( $vars[ $ENDPOINT ] ) ) {
			return;
		}

		session_write_close();

		$fontQueries = $this->explodeFont( $vars[ $ENDPOINT ] );

		if ( count( $fontQueries ) == 0 ) {
			return;
		}

		$contexts = array();

		foreach ( $fontQueries as $fontUid => $weights ) {
			$contexts[ $fontUid ] = array();
			$fontPost             = $this->getFont( $fontUid );

			if ( ! $fontPost ) {
				continue;
			}

			foreach ( $weights as $weight ) {
				$contexts[ $fontUid ][ $weight ] = $this->getFontWeightFileUrls( $fontPost->ID, $weight );
			}
		}

		header( 'Content-Type: text/css' );

		$css = '';

		foreach ( $contexts as $family => $fonts ) {

			if ( empty( $fonts ) || ! is_array( $fonts ) ) {
				continue;
			}

			$css .= "/* $family */";

			foreach ( $fonts as $weight => $types ) {

				if ( empty( $types ) || ! is_array( $types ) ) {
					continue;
				}

				foreach ( $types as $type => $url ) {

					$css .= "
						@font-face {
				            font-family: '$family';
				            font-style: " . ( ( $style = trim( preg_replace( "/\d+/", "", $weight ) ) ) ? $style : 'normal' ) . ";
				            font-weight: " . trim( preg_replace( "/[^\d]+/", "", $weight ) ) . ";
				            src: local('$family'), url($url) format('" . ( $type == 'ttf' ? 'truetype' : $type ) . "');
				        }
					";
				}
			}
		}

		echo $css;
		exit;
	}

	/**
	 * @param $request
	 *
	 * @return array
	 */
	private function explodeFont( $request ) {
		$fonts = explode( "|", $request );

		$fontsParsed = array();

		foreach ( $fonts as $fontRequest ) {
			$font                    = explode( ':', $fontRequest );
			$fontsParsed[ $font[0] ] = explode( ',', $font['1'] );
		}

		return $fontsParsed;
	}

	/**
	 * @param $uid
	 *
	 * @return mixed|null
	 */
	private function getFont( $uid ) {
		$fonts = get_posts( [
			'post_type'   => Brizy_Admin_Fonts_Main::CP_FONT,
			'post_status' => 'publish',
			'meta_query'  => array(
				array(
					'key'   => 'brizy_post_uid',
					'value' => $uid
				)
			),
		] );

		if ( is_array( $fonts ) && isset( $fonts[0] ) ) {
			return $fonts[0];
		}

		return null;
	}

	/**
	 * @param $fontId
	 * @param $weight
	 *
	 * @return array|bool
	 */
	function getFontWeightFileUrls( $fontId, $weight ) {

		$args = array(
			'meta_query'  => array(
				array(
					'key'   => 'brizy-font-weight',
					'value' => $weight
				)
			),
			'post_type'   => 'attachment',
			'post_parent' => $fontId
		);

		$posts = get_posts( $args );


		if ( ! $posts || is_wp_error( $posts ) ) {
			return false;
		}

		$result = array();

		foreach ( $posts as $post ) {
			$type            = get_post_meta( $post->ID, 'brizy-font-file-type', true );
			$result[ $type ] = wp_get_attachment_url( $post->ID );
		}

		return $result;
	}
}