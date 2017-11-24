<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

function brizy_shortcode_sidebar( $atts ) {
	$id = isset( $atts['id'] ) ? $atts['id'] : null;

	if ( $id ) {
		ob_start();
			dynamic_sidebar( $id );
		return ob_get_clean();
	}

	return '';
}

add_shortcode( BRIZY_SHORTCODES_PREFIX . 'sidebar', 'brizy_shortcode_sidebar' );