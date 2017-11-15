<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

add_action( 'plugins_loaded', 'brizy_load_admin' );

function brizy_load_admin() {
	if ( is_admin() ) {
		Brizy_Admin_Main::_init();
		Brizy_Admin_Settings::_init();
		Brizy_Admin_Flash::instance()->initialize(); // initialize flash
	}
}