<?php

trait Brizy_Editor_Trait_Sanitize {

	public function sanitizeJson($data) {
		if ( current_user_can( 'unfiltered_html' ) ) {
			return $data;
		}

		if ( ! $dataDecoded = json_decode( $data, true ) ) {
			return $data;
		}

		$dataDecoded = wp_kses_post_deep( $dataDecoded );
		$data        = json_encode( $dataDecoded );
		$data        = preg_replace( '/javascript:[^"]*"/', '"', $data );
		$data        = preg_replace( '/(on(click|mouseover|keydown|keyup|change|submit|load|error|focus|blur|select|dblclick))\s*[:=]\s*(\\\"|\\\')(.*?)(\3)/i', '', $data );

		return $data;
	}
}