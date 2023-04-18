<?php

/**
 * Class Brizy_Getting_Started
 */

class Brizy_Admin_GettingStarted {

	public $isWhiteLabel;
	public $brizyBrandedOrIsWhiteLabelImgUrl = BRIZY_PLUGIN_URL . '/admin/static/img/getting-started/brizy-branded/';
	const SLUG = 'getting-started';
	const STARTER_TEMPLATES_URL = 'admin.php?page=starter-templates';
	const POST_TYPE_PAGE_URL = '/wp-admin/edit.php?post_type=page';
	const BRIZY_BRANDED_VIDEO_URL = '';
	const BRIZY_ACADEMY_URL = '';

	/**
	 * Brizy_Admin_Getting_Started constructor.
	 */
	public function __construct() {
		add_action( 'admin_menu', [ $this, 'addSubmenuPageGettingStarted' ], 20 );

		if ( class_exists( 'BrizyPro_Admin_WhiteLabel' ) && BrizyPro_Admin_WhiteLabel::_init()->getEnabled() ) {
			$this->isWhiteLabel                     = true;
			$this->brizyBrandedOrIsWhiteLabelImgUrl = BRIZY_PLUGIN_URL . '/admin/static/img/getting-started/white-label/';
		}
	}

	public function addSubmenuPageGettingStarted() {

		if ( is_network_admin() ) {
			return;
		}

		add_submenu_page(
			Brizy_Admin_Settings::menu_slug(),
			__( 'Getting Started', 'brizy' ),
			__( 'Getting Started', 'breezy' ),
			'manage_options',
			self::SLUG,
			[ $this, 'renderTemplatesPage' ],
			8
		);
	}

	public function renderTemplatesPage() {

		$args = [
			'brizyBrandedOrIsWhiteLabel'       => $this->isWhiteLabel,
			'brizyBrandedOrIsWhiteLabelImgUrl' => $this->brizyBrandedOrIsWhiteLabelImgUrl,
			'starterTemplatesUrl'              => self::STARTER_TEMPLATES_URL,
			'postTypePageUrl'                  => self::POST_TYPE_PAGE_URL,
			'brizyBrandedVideoUrl'             => self::BRIZY_BRANDED_VIDEO_URL,
			'brizyAcademyUrl'                  => self::BRIZY_ACADEMY_URL,
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
		exit( wp_redirect( admin_url( 'admin.php?page=getting-started' ) ) );
	}
}