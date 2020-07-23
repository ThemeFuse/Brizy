<?php

class Brizy_Admin_OptimizeImages {

	const PAGE_KEY = 'brizy-optimize-images';

	/**
	 * @var Brizy_TwigEngine
	 */
	private $twig;

	/**
	 * @var string
	 */
	private $screenName;

	/**
	 * @return Brizy_Admin_OptimizeImages
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
		add_action( 'brizy_optimizer_submit', array( $this, 'settings_submit' ) );
		$this->twig = Brizy_TwigEngine::instance( BRIZY_PLUGIN_PATH . "/admin/views/optimizer/" );
	}

	public function addSubmenuPage() {
		$this->screenName = add_submenu_page( Brizy_Admin_Settings::menu_slug(),
			__( 'Optimize Images' ),
			__( 'Optimize Images' ),
			'manage_options',
			self::menu_slug(),
			array( $this, 'render' )
		);
	}

	public function render() {
		$context = $this->getDefaultViewContext();
		$tab     = $this->get_selected_tab();
		switch ( $tab ) {
			default:
			case 'settings':
				echo $this->get_settings_tab( $context );
				break;

		}
	}

	/**
	 * @internal
	 **/
	public function action_validate_form_submit() {

		$screen = get_current_screen();

		if ( $this->screenName != $screen->id ) {
			return;
		}

		if ( count( $_POST ) == 0 ) {
			return;
		}

		if ( ! isset( $_POST['_wpnonce'] ) || ! wp_verify_nonce( $_POST['_wpnonce'] ) ) {
			return;
		}

		do_action( 'brizy_optimizer_submit' );
		$tab = $this->get_selected_tab();
		wp_redirect( menu_page_url( $this->menu_slug(), false ) . ( $tab ? '&tab=' . $tab : '' ) );
		exit;
	}

	public function settings_submit() {

		switch ( $_POST['tab'] ) {
			case 'settings':
				$this->optimizer_settings_submit();
				break;
		}
	}

	private function optimizer_settings_submit() {

		$settings     = Brizy_Editor_Project::get()->getImageOptimizerSettings();
		$optimezer_id = Brizy_Editor_Asset_Optimize_BunnyCdnOptimizer::ID;

		$settings[ $optimezer_id ]['optimize'] = ! empty( $_POST[ $optimezer_id ]['optimize'] );

		Brizy_Editor_Project::get()->setImageOptimizerSettings( $settings );
		Brizy_Editor_Project::get()->saveStorage();
		Brizy_Admin_Flash::instance()->add_success( 'Settings are saved successfully.' );
	}

	private function get_settings_tab( $context ) {
		$settings     = Brizy_Editor_Project::get()->getImageOptimizerSettings();
		$optimezer_id = Brizy_Editor_Asset_Optimize_BunnyCdnOptimizer::ID;

		$context['optimizer_id'] = $optimezer_id;
		$context['optimize'] = ! empty( $settings[ $optimezer_id ]['optimize'] );

		return $this->twig->render( 'optimizer-settings.html.twig', $context );
	}

	/**
	 * @return array
	 */
	private function getDefaultViewContext() {
		$context = array(
			'tab_list' => $this->get_tabs(),
			'nonce'    => wp_nonce_field( - 1, "_wpnonce", true, false )
		);

		return $context;
	}

	/**
	 * @return string|void
	 */
	private function get_selected_tab() {
		return ( ! empty( $_REQUEST['tab'] ) ) ? esc_attr( $_REQUEST['tab'] ) : 'settings';
	}

	/**
	 * @return mixed|void
	 */
	private function get_tabs() {
		$selected_tab = $this->get_selected_tab();
		$tabs         = array(
			array(
				'id'          => 'settings',
				'label'       => __( 'Settings', 'brizy' ),
				'is_selected' => is_null( $selected_tab ) || $selected_tab == 'settings',
				'href'        => menu_page_url( self::menu_slug(), false ) . "&tab=settings"
			),
		);

		return apply_filters( 'brizy_optimizer_tabs', $tabs );
	}

}
