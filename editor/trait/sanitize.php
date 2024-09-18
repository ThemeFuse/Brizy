<?php

trait Brizy_Editor_Trait_Sanitize {

	public function sanitizeJson( $data ) {
		if ( current_user_can( 'unfiltered_html' ) ) {
			return $data;
		}
		if ( ! $dataDecoded = json_decode( $data, true ) ) {
			return $data;
		}
		$dataDecoded = wp_kses_post_deep( $dataDecoded );
		//$dataDecoded = $this->escapeJsonValues( $dataDecoded );
		$data = json_encode( $dataDecoded );
		$data = preg_replace( '/javascript:[^"]*"/', '"', $data );
		$data = preg_replace( '/(on(click|mouseover|keydown|keyup|change|submit|load|error|focus|blur|select|dblclick))\s*[:=]\s*(\\\"|\\\')(.*?)(\3)/i', '', $data );

		return $data;
	}

	function escapeJsonValues( $value, $key = null ) {
		if ( is_array( $value ) ) {
			foreach ( $value as $key => $val ) {
				$value[ $key ] = $this->escapeJsonValues( $val, $key );
			}
		} elseif ( is_object( $value ) ) {
			foreach ( $value as $key => $val ) {
				$value->$key = $this->escapeJsonValues( $val, $key );
			}
		} elseif ( is_string( $value ) ) {
			$value = $this->sanitizeValueByKey( $value, $key );
		}

		return $value;
	}

	function sanitizeValueByKey( $value, $key = null ) {
		switch ( $key ) {
			case 'messageError':
			case 'messageSuccess':
			case 'customAttributes':
				$t = htmlentities( $value, null, 'UTF-8' );

				return $t;
		}

		return $value;
	}

}