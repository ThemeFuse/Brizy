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
	}

	public function addSubmenuPageGettingStarted() {

		if ( is_network_admin() ) {
			return;
		}

		add_submenu_page(
			Brizy_Admin_Settings::menu_slug(),
			__( 'Getting Started', 'brizy' ),
			__( 'Getting Started', 'brizy' ),
			'manage_options',
			self::SLUG,
			[ $this, 'renderTemplatesPage' ],
			8
		);
	}

	public function renderTemplatesPage() {

		if ( class_exists( 'BrizyPro_Admin_WhiteLabel' ) && BrizyPro_Admin_WhiteLabel::_init()->getEnabled() ) {
			$isWhiteLabel         = true;
			$brandedOrLabelImgUrl = plugin_dir_url( __FILE__ ) . 'static/img/getting-started/white-label/';
		} else {
			$isWhiteLabel         = false;
			$brandedOrLabelImgUrl = plugin_dir_url( __FILE__ ) . 'static/img/getting-started/brizy-branded/';
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
		if ( $plugin != BRIZY_PLUGIN_BASE && ( ! defined( 'BRIZY_PRO_PLUGIN_BASE' ) || $plugin != BRIZY_PRO_PLUGIN_BASE ) || ( ! empty( $_POST['checked'] ) && count( $_POST['checked'] ) > 1 ) ) {
			return;
		}
		exit( wp_redirect( admin_url( 'admin.php?page=' . self::SLUG ) ) );
	}
}