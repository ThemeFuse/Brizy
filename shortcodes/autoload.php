<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

define( 'BITBLOX_WP_SHORTCODES_PREFIX', 'bitblox_wp_' );

function _action_bitblox_wp_register_shortcodes() {
	include_once 'sidebar/shortcode.php';
}

add_action( 'init', '_action_bitblox_wp_register_shortcodes' );