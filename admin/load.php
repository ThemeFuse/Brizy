<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

add_action( 'init', 'brizy_init_templates' );
add_action( 'wp_loaded', 'brizy_load_admin' );
add_action( 'upgrader_process_complete', 'wp_upe_upgrade_completed', 10, 2 );
register_activation_hook( __FILE__, 'brizy_install' );
register_deactivation_hook( __FILE__, 'brizy_clean' );

function brizy_init_templates() {
	try {

		if ( current_user_can( Brizy_Admin_Capabilities::CAP_EDIT_WHOLE_PAGE ) ) {
			Brizy_Admin_Rules_Api::_init();
		}

		Brizy_Admin_Templates::_init();
	} catch ( Exception $e ) {
		// ignore this exceptions for now.
	}
}

function brizy_add_dashboard_widgets() {
	try {
		Brizy_Admin_DashboardWidget::_init();
	} catch ( Exception $e ) {
		// ignore this exceptions for now.
	}
}

function brizy_load_admin() {

	try {
		new Brizy_Admin_Capabilities( Brizy_Editor_Storage_Common::instance() );

		if ( is_admin() ) {
			Brizy_Admin_Main::instance();
			Brizy_Admin_Settings::_init();
			Brizy_Admin_Flash::instance()->initialize(); // initialize flash
		}
	} catch ( Exception $exception ) {
		Brizy_Admin_Flash::instance()->add_error( 'Unable to empty the trash. Please try again later.' );
		wp_redirect( $_SERVER['HTTP_REFERER'] );
		exit;
	}

	add_action( 'wp_dashboard_setup', 'brizy_add_dashboard_widgets' );
}


function wp_upe_upgrade_completed( $upgrader_object, $options ) {
	$our_plugin = plugin_basename( __FILE__ );
	if ( $options['action'] == 'update' && $options['type'] == 'plugin' && isset( $options['plugins'] ) ) {
		foreach ( $options['plugins'] as $plugin ) {
			if ( $plugin == $our_plugin ) {
				Brizy_Admin_Templates::registerCustomPostTemplate();
				flush_rewrite_rules();
			}
		}
	}
}

function brizy_install() {
	Brizy_Logger::install();
	Brizy_Admin_Templates::registerCustomPostTemplate();
	flush_rewrite_rules();
}

function brizy_clean() {
	Brizy_Logger::clean();
}




