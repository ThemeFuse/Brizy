<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}


class Brizy_Admin_NetworkSettings {

	private $selected_post_types;

	private $role_list;

	private $capability_options;

	/**
	 * @var string
	 */
	private $screenName;

	public static function menu_slug() {
		return Brizy_Editor::prefix( '-network-settings' );
	}

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

	/**
	 * @internal
	 */
	function actionRegisterSettingsPage() {

		$this->screenName = add_menu_page( Brizy_Editor::get()->get_name(),
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
	 * Return the list of capabilities including the label
	 *
	 * @return mixed|void
	 */
	public function get_capability_options() {
		return apply_filters( 'brizy_settings_capability_options', array(
			array( 'capability' => '', 'label' => __( 'No Access' ) ),
			array(
				'capability' => Brizy_Admin_Capabilities::CAP_EDIT_WHOLE_PAGE,
				'label'      => __( 'Full Access', 'brizy' )
			)
		) );
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







































































