<?php

use Gaufrette\Filesystem;
use Gaufrette\Adapter\Local as LocalAdapter;

class Brizy_Admin_Cloud2222 {

	const PAGE_KEY = 'brizy-cloud';

	/**
	 * @var Brizy_TwigEngine
	 */
	private $twig;

	/**
	 * @return Brizy_Admin_Cloud
	 * @throws Exception
	 */
	public static function _init() {
		static $instance;

		if ( ! $instance ) {
			$instance = new self();
		}

		return $instance;
	}

	/**
	 * @return string
	 */
	public static function menu_slug() {
		return self::PAGE_KEY;
	}

	/**
	 * Brizy_Admin_OptimizeImages constructor.
	 */
	public function __construct() {
		add_action( 'admin_menu', array( $this, 'addSubmenuPage' ), 11 );
		add_action( 'current_screen', array( $this, 'action_validate_form_submit' ) );
		add_action( 'brizy_cloud_login_submit', array( $this, 'login_submit' ) );
		$this->twig = Brizy_TwigEngine::instance( BRIZY_PLUGIN_PATH . "/admin/views/cloud/" );
	}

	public function addSubmenuPage() {
		add_submenu_page( Brizy_Admin_Settings::menu_slug(),
			__( 'Cloud' ),
			__( 'Cloud' ),
			'manage_options',
			self::menu_slug(),
			array( $this, 'render' )
		);
	}

	public function render() {
		$context = array();

		echo $this->twig->render( 'cloud.html.twig', $context );
	}

	/**
	 * @internal
	 **/
	public function action_validate_form_submit() {

		if ( count( $_POST ) == 0 ) {
			return;
		}

		if ( ! isset( $_POST['_wpnonce'] ) || ! wp_verify_nonce( $_POST['_wpnonce'] ) ) {
			return;
		}

		do_action( 'brizy_cloud_login_submit' );

		wp_redirect( menu_page_url( $this->menu_slug(), false ) );

		exit;

	}


	public function login_submit() {

	}
}