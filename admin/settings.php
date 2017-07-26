<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Admin_Settings {

	public static function menu_slug() {
		return brizy()->get_slug() . '-settings';
	}

	public static function _init() {
		static $instance;

		return $instance ? $instance : $instance = new self();
	}

	private function __construct() {
		add_action( 'admin_menu', array( $this, '_action_register_settings_page' ) );
		add_action( 'current_screen', array( $this, '_action_validate_form_submit' ) );
	}

	public function is_settings_page() {
		return get_current_screen()->base === "settings_page_" . brizy()->get_slug() . "-settings";
	}

	/**
	 * @internal
	 */
	public function render() {
		echo Brizy_Admin_Main::render(
			'settings/view',
			array( 'types' => array_map( array( $this, 'is_selected' ), $this->list_post_types() ) )
		);
	}

	public function get_url() {
		return menu_page_url( self::menu_slug(), false );
	}

	/**
	 * @internal
	 */
	function _action_register_settings_page() {
		add_submenu_page(
			'options-general.php',
			brizy()->get_name(),
			brizy()->get_name() . ' ' . __( 'settings', 'brizy' ),
			'manage_options',
			self::menu_slug(),
			array( $this, 'render' )
		);
	}

	/**
	 * @internal
	 **/
	public function _action_validate_form_submit() {
		if ( ! isset( $_POST['_wpnonce'] )
		     || ! wp_verify_nonce( $_POST['_wpnonce'] )
		     || ! isset( $_POST['post-types'] )
		) {
			return;
		}

		Brizy_Editor_Storage_Common::instance()->set( 'post-types', (array) $_POST['post-types'] );
		wp_redirect( $this->get_url() );
	}

	protected function list_post_types() {
		$types = array_filter(
			get_post_types( array( 'public' => true ), 'objects' ),
			array( $this, 'filter_types' )
		);

		return array_map( array( $this, 'to_type' ), $types );
	}

	private function to_type( WP_Post_Type $type ) {
		return array(
			'type' => $type->name,
			'name' => $type->labels->name,
		);
	}

	private function filter_types( WP_Post_Type $type ) {
		return ! in_array(
			$type->name,
			apply_filters( 'brizy:settings:exclude_post_types', array( 'attachment' ) )
		);
	}

	private function is_selected( $type ) {
		$type['selected'] = in_array( $type['type'], brizy()->supported_post_types() );

		return $type;
	}
}
