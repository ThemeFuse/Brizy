<?php defined( 'ABSPATH' ) or die();

class Brizy_Admin_NetworkSettings {

	/**
	 * @return Brizy_Admin_NetworkSettings
	 */
	public static function _init() {

		static $instance;

		return $instance ? $instance : $instance = new self();
	}

	/**
	 * Brizy_Admin_NetworkSettings constructor.
	 */
	private function __construct() {
		add_action( 'network_admin_menu', array( $this, 'actionRegisterSettingsPage' ) );
		add_action( 'brizy_network_settings_render_tabs', array( $this, 'render_tabs' ) );
		add_action( 'brizy_network_settings_render_content', array( $this, 'render_tab_content' ) );
	}

	public static function menu_slug() {
		return Brizy_Editor::prefix( '-network-settings' );
	}

	/**
	 * @internal
	 */
	function actionRegisterSettingsPage() {

		add_menu_page( Brizy_Editor::get()->get_name(),
			Brizy_Editor::get()->get_name(),
			'read',
			self::menu_slug(),
			array( $this, 'render' ),
			__bt( 'brizy-logo', plugins_url( 'static/img/brizy-logo.svg', __FILE__ ) ),
			//plugins_url( '/static/img/brizy-logo.svg', __FILE__ ),
			'58'
		);
	}

	private function get_selected_tab() {
		return ( ! empty( $_REQUEST['tab'] ) ) ? esc_attr( $_REQUEST['tab'] ) : 'license';
	}

	private function get_tabs() {
		$selected_tab = $this->get_selected_tab();
		$tabs         = [];

		return apply_filters( 'brizy_network_settings_tabs', $tabs, $selected_tab );
	}

	/**
	 * @internal
	 */
	public function render() {

		try {
			echo Brizy_Admin_View::render(
				'settings/network-view',
				array()
			);
		} catch ( Exception $e ) {

		}
	}

	public function render_tabs() {
		$tabs = $this->get_tabs();
		foreach ( $tabs as $tab ) {
			$is_active_class = $tab['is_selected'] ? 'nav-tab-active' : '';
			?>
            <a href="<?php echo $tab['href'] ?>"
               class="nav-tab <?php echo $is_active_class ?>"><?php echo __( $tab['label'] ) ?></a>
			<?php
		}
	}

	public function render_tab_content() {
		$tab = $this->get_selected_tab();

		echo apply_filters( 'brizy_network_settings_render_tab', '', $tab );
	}

}







































































