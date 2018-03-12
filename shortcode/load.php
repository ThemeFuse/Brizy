<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

function brizy_action_register_shortcodes() {
	$a = new Brizy_Shortcode_Sidebar();
	$b = new Brizy_Shortcode_Posts();
	$c = new Brizy_Shortcode_Navigation();
}

add_action( 'init', 'brizy_action_register_shortcodes' );