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

		return json_encode( $dataDecoded );
	}
}