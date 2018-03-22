<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

add_action( 'plugins_loaded', 'brizy_load_admin' );

function brizy_load_admin() {

	try {
		if ( is_admin() ) {
			Brizy_Admin_Main::_init();

			Brizy_Admin_Settings::_init();
			Brizy_Admin_Flash::instance()->initialize(); // initialize flash
		}
	} catch ( Exception $exception ) {
		Brizy_Admin_Flash::instance()->add_error( 'Unable to empty the trash. Please try again later.' );
		wp_redirect( $_SERVER['HTTP_REFERER'] );
		exit;
	}
}

add_action( 'wp_dashboard_setup', 'example_add_dashboard_widgets' );
function example_add_dashboard_widgets() {
	try {
		Brizy_Admin_Widget::_init();
	} catch ( Exception $e ) {
		// ignore this exceptions for now.
	}
}


add_action( 'wp_logout', 'brizy_session_end' );
add_action( 'wp_login', 'brizy_session_end' );
add_action( 'init', 'brizy_session_start', 1 );

function brizy_session_start() {
	if ( ! session_id() ) {
		session_start();
	}
}

function brizy_session_end() {
	session_destroy();
}