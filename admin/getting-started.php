<?php

/**
 * Class Brizy_Getting_Started
 */

class Brizy_Admin_GettingStarted {

	/**
	 * Brizy_Admin_Getting_Started constructor.
	 */
	public function __construct() {
		add_action( 'admin_menu', [ $this, 'addSubmenuPageGettingStarted' ], 20 );
	}

	public function addSubmenuPageGettingStarted() {

		if ( is_network_admin() ) {
			return;
		}

		add_filter( 'screen_options_show_screen', function ( $display ) {
			return isset( $_GET['page'] ) && $_GET['page'] == 'starter-templates' ? false : $display;
		} );

		add_submenu_page(
			Brizy_Admin_Settings::menu_slug(),
			__( 'Getting Started', 'brizy' ),
			__( 'Getting Started', 'brizy' ),
			'manage_options',
			'getting-started',
			[ $this, 'renderTemplatesPage' ],
			8
		);
	}

	public function renderTemplatesPage() {

		$args = [
			'isWhiteLabel' => class_exists( 'BrizyPro_Admin_WhiteLabel' ) && BrizyPro_Admin_WhiteLabel::_init()->getEnabled(),
		];

		try {
			Brizy_Editor_View::render( BRIZY_PLUGIN_PATH . '/admin/views/getting-started', $args );
		} catch ( Exception $e ) {
			echo $e->getMessage();
		}

		function change_footer_admin() {
			return ' ';
		}

		add_filter( 'admin_footer_text', 'change_footer_admin', 99 );
		function change_footer_version() {
			return ' ';
		}

		add_filter( 'update_footer', 'change_footer_version', 99 );
	}

	public static function redirectAfterActivation( $plugin ) {
		if ( $plugin != BRIZY_PLUGIN_BASE && ( ! defined( 'BRIZY_PRO_PLUGIN_BASE' ) || $plugin != BRIZY_PRO_PLUGIN_BASE ) || ( ! empty( $_POST['checked'] ) && count( $_POST['checked'] ) > 1 ) ) {
			return;
		}
		exit( wp_redirect( admin_url( 'admin.php?page=getting-started' ) ) );
	}
}


