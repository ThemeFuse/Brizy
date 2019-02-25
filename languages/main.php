<?php

if ( ! function_exists( '__b' ) ) {
	function __b( $key, $default, $textDomain = 'brizy' ) {

		$text = apply_filters( 'brizy_wl_value', array( 'key' => $key, 'default' => $default ) );

		if ( is_string( $text ) ) {
			return $text;
		}

		return __( $default, $textDomain );
	}
}