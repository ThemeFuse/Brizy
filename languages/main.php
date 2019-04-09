<?php

if ( ! function_exists( '__bt' ) ) {
	function __bt( $key, $default, $textDomain = 'brizy' ) {

		$text = apply_filters( 'brizy_wl_value', array( 'key' => $key, 'default' => $default ) );

		if ( is_string( $text ) && ! empty( $text ) ) {
			return trim($text);
		}

		return __( $default, $textDomain );
	}
};