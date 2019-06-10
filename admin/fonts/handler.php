<?php


class Brizy_Admin_Fonts_Handler extends Brizy_Public_AbstractProxy {
	const ENDPOINT = 'brizy-font';

	/**
	 * @return array
	 */
	protected function get_endpoint_keys() {
		return array( self::ENDPOINT );
	}

	/**
	 * @return mixed|void
	 */
	public function process_query() {
		global $wp_query;
		$vars = $wp_query->query_vars;


		// Check if user is not querying API
		if ( ! isset( $vars[ self::ENDPOINT ] ) || ! is_string( $vars[ self::ENDPOINT ] ) ) {
			return;
		}

		session_write_close();

		$fontFamilies = $this->explodeFont( $vars[ self::ENDPOINT ] );

		if ( count( $fontFamilies ) == 0 ) {
			return;
		}

		$contexts = array();

		foreach ( $fontFamilies as $family => $weights ) {
			$contexts[ $family ] = array();
			$fontPost            = $this->getFont( $family );

			foreach ( $weights as $weight ) {
				$contexts[ $family ][ $weight ] = $this->getFontWeightFileUrls( $fontPost->ID, $weight );
			}
		}

		header( 'Content-Type: text/css' );

		$twigEngine = Brizy_TwigEngine::instance( path_join( BRIZY_PLUGIN_PATH, "admin/fonts/views" ) );
		$twigEngine->getEnvironment()
		           ->addFilter( new Twig_SimpleFilter( 'fontStyle', function ( $weight ) {
			           $weight = preg_replace( "/\d+/", "", $weight );

			           if ( trim( $weight ) == "" ) {
				           return 'normal';
			           }

			           return $weight;
		           } ) );
		$twigEngine->getEnvironment()->addFilter( new Twig_SimpleFilter( 'fontWeight', function ( $weight ) {
			return trim( preg_replace( "/[^\d]+/", "", $weight ) );
		} ) );

		echo $twigEngine->render( 'fonts.css.twig', array(
			'fonts' => $contexts
		) );

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
	 * @param $family
	 *
	 * @return mixed|null
	 */
	private function getFont( $family ) {
		$fonts = get_posts( [
			'post_type'   => Brizy_Admin_Fonts_Main::CP_FONT,
			'post_title'  => $family,
			'post_name'   => $family,
			'post_status' => 'publish',
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