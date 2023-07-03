<?php

/**
 * Class Brizy_Getting_Started
 */
class Brizy_Admin_GettingStarted {

	const SLUG = 'getting-started';

	/**
	 * Brizy_Admin_Getting_Started constructor.
	 */
	public function __construct() {
		add_action( 'admin_menu', [ $this, 'addSubmenuPageGettingStarted' ], 20 );
		add_action( 'network_admin_menu', [ $this, 'addSubmenuPageGettingStarted' ], 20 );
	}

	public function addSubmenuPageGettingStarted() {

		add_submenu_page(
			current_action() == 'network_admin_menu' ? Brizy_Admin_NetworkSettings::menu_slug() : Brizy_Admin_Settings::menu_slug(),
			__( 'Getting Started', 'brizy' ),
			__( 'Getting Started', 'brizy' ),
			current_action() == 'network_admin_menu' ? 'manage_network' : 'manage_options',
			self::SLUG,
			[$this, 'renderTemplatesPage'],
			8
		);
	}
	public function renderTemplatesPage() {

		if ( class_exists( 'BrizyPro_Admin_WhiteLabel' ) && BrizyPro_Admin_WhiteLabel::_init()->getEnabled() ) {
			$isWhiteLabel         = true;
			$brandedOrLabelImgUrl = BRIZY_PLUGIN_URL . '/admin/static/img/getting-started/white-label/';
		} else {
			$isWhiteLabel         = false;
			$brandedOrLabelImgUrl = BRIZY_PLUGIN_URL . '/admin/static/img/getting-started/brizy-branded/';
		}

		$args = [
			'isWhiteLabel' => $isWhiteLabel,
			'imgPath'      => $brandedOrLabelImgUrl,
		];

		try {
			Brizy_Editor_View::render( BRIZY_PLUGIN_PATH . '/admin/views/getting-started', $args );
		} catch ( Exception $e ) {
			echo $e->getMessage();
		}

		add_filter( 'admin_footer_text', function () {
			return '';
		} );

		add_filter( 'update_footer', function () {
			return '';
		} );
	}

	public static function redirectAfterActivation( $plugin ) {

		if ( ! is_admin() && ! is_network_admin() ) {
			return;
		}

		if ( defined( 'WP_CLI' ) && WP_CLI ) {
			return;
		}

		if ( $plugin != BRIZY_PLUGIN_BASE && ( ! defined( 'BRIZY_PRO_PLUGIN_BASE' ) || $plugin != BRIZY_PRO_PLUGIN_BASE ) || ( ! empty( $_POST['checked'] ) && count( $_POST['checked'] ) > 1 ) ) {
			return;
		}

		if ( is_network_admin() ) {
			exit( wp_redirect( network_admin_url( 'admin.php?page=' . self::SLUG ) ) );
		}

		exit( wp_redirect( admin_url( 'admin.php?page=' . self::SLUG ) ) );
	}
}