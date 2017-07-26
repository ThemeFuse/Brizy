<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

define( 'BRIZY_SHORTCODES_PREFIX', 'brizy_' );

function _action_brizy_register_shortcodes() {
	include_once 'sidebar/shortcode.php';
}

add_action( 'init', '_action_brizy_register_shortcodes' );