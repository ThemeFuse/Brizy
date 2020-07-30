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
	 * @return mixed|void
	 * @throws Twig_Error_Loader
	 * @throws Twig_Error_Runtime
	 * @throws Twig_Error_Syntax
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

		$twigEngine = Brizy_TwigEngine::instance( path_join( BRIZY_PLUGIN_PATH, "admin/fonts/views" ) );
		$twigEngine->getEnvironment()
		           ->addFilter( new Twig_SimpleFilter( 'fontStyle', function ( $weight ) {
			           $weight = preg_replace( "/\d+/", "", $weight );

			           if ( trim( $weight ) == "" ) {
				           return 'normal';
			           }

			           return $weight;
		           } ) );
		$twigEngine->getEnvironment()
		           ->addFilter( new Twig_SimpleFilter( 'fontType', function ( $type ) {

			           if ( $type == 'ttf' ) {
				           return 'truetype';
			           } else {
				           return $type;
			           }

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