<?php

trait Brizy_Editor_Trait_Sanitize {

	public function sanitizeUid($uid) {
		// eliminate anything that is not a letter, digit, “_”, “-”, “.” —or any run of two-or-more dots
		$auid =  preg_replace("/(?:[^\w.\-]|\.{2,})+/u", "", $uid);

		return $auid;
	}

	public function sanitizeHtml( $html, $capabilityIgnore=false ) {
		if ( current_user_can( 'unfiltered_html' ) || $capabilityIgnore == true ) {
			return $html;
		}
		add_filter( 'safe_style_css', function ( $styles ) {
			$styles[] = 'rgba';
			$styles[] = 'rgb';
			$styles[] = 'var';
			$styles[] = 'color';
			$styles[] = 'linear-gradient';
			$styles[] = 'display';

			return $styles;
		} );
		add_filter( 'safecss_filter_attr_allow_css', function ( $css, $value ) {
			// we may need to add more methods here
			$preg_match = preg_match( '/(rgba?|hsla?|calc|opacity|blur)\(.*?\)/i', $value );

			return $preg_match;
		}, 10, 2 );

		$allowed_tags = wp_kses_allowed_html();
		$html = wp_kses( $html, $allowed_tags );
		return $html;
	}

	public function sanitizeJson( $data ) {
		if ( current_user_can( 'unfiltered_html' ) ) {
			return $data;
		}

		if ( ! $dataDecoded = json_decode( $data, true ) ) {
			return $data;
		}
		add_filter( 'safe_style_css', function ( $styles ) {
			$styles[] = 'rgba';
			$styles[] = 'rgb';
			$styles[] = 'var';
			$styles[] = 'color';
			$styles[] = 'linear-gradient';
			$styles[] = 'display';

			return $styles;
		} );
		add_filter( 'safecss_filter_attr_allow_css', function ( $css, $value ) {
			// we may need to add more methods here
			$preg_match = preg_match( '/(rgba?|hsla?|calc|opacity|blur)\(.*?\)/i', $value );

			return $preg_match;
		}, 10, 2 );
		$dataDecoded = wp_kses_post_deep( $dataDecoded );

		//$dataDecoded = $this->escapeJsonValues( $dataDecoded );
		$data = json_encode( $dataDecoded );
		$data = preg_replace( '/javascript:.*?"/', '"', $data );
		$data = preg_replace( '/javascript%3A.*?%22/', '%22', $data );
		$data = preg_replace( '/(on(click|mouseover|keydown|keyup|change|submit|load|error|focus|blur|select|dblclick))\s*[:=]\s*(\\\"|\\\')(.*?)(\3)/i', '', $data );

		//remove_filter( 'safecss_filter_attr_allow_css', '__return_true' );
		return $data;
	}

}