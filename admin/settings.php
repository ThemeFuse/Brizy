<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Admin_Settings {

	private $role_list;

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
		$this->role_list = $this->get_role_list();

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
			array(
				'types' => array_map( array( $this, 'is_selected' ), $this->list_post_types() ),
				'roles' => array_map( array( $this, 'is_role_selected' ), $this->list_wp_roles() )
			)
		);
	}

	public function get_url() {
		return menu_page_url( self::menu_slug(), false );
	}

	/**
	 * @internal
	 */
	function _action_register_settings_page() {
		add_menu_page( brizy()->get_name(),
			brizy()->get_name(), 'manage_options',
			self::menu_slug(),
			array( $this, 'render' ) );
	}

	/**
	 * @internal
	 **/
	public function _action_validate_form_submit() {

		if ( count( $_POST ) == 0 ) {
			return;
		}

		if ( ! isset( $_POST['_wpnonce'] ) || ! wp_verify_nonce( $_POST['_wpnonce'] ) ) {
			return;
		}

		$post_types = isset( $_POST['post-types'] ) ? $_POST['post-types'] : array();
		$roles = isset( $_POST['exclude-roles'] ) ? $_POST['exclude-roles'] : array();

		Brizy_Editor_Storage_Common::instance()->set( 'post-types', $post_types );
		Brizy_Editor_Storage_Common::instance()->set( 'exclude-roles', $roles );

		add_action( 'admin_notices', array( $this, 'success_notice' ) );

		//wp_redirect( $this->get_url() );
	}

	public function success_notice() {
		?>
        <div class="notice notice-success is-dismissible">
            <p><?php _e( 'Settings saved.', 'brizy' ); ?></p>
        </div>
		<?php
	}


	public function error_notice() {
		?>
        <div class="notice error is-dismissible">
            <p><?php _e( 'An error occurred, please try again later.!', 'brizy' ); ?></p>
        </div>
		<?php
	}

	protected function list_post_types() {
		$get_post_types = get_post_types( array( 'public' => true ), 'objects' );

		$types = array_filter(
			$get_post_types,
			array( $this, 'filter_types' )
		);

		return array_map( array( $this, 'to_type' ), $types );
	}

	private function get_role_list() {
		$roles = wp_roles()->roles;

		unset( $roles['administrator'] );

		foreach ( $roles as $key => $role ) {
			$roles[ $key ]['id'] = $key;
		}

		return $roles;
	}

	/**
	 * @return array
	 */
	public function list_wp_roles() {
		return $this->role_list;
	}


	private function to_type( WP_Post_Type $type ) {
		return array(
			'type' => $type->name,
			'name' => $type->labels->name,
		);
	}

	private function filter_types( WP_Post_Type $type ) {

		return in_array(
			$type->name,
			apply_filters( 'brizy:settings:exclude_post_types', brizy()->supported_post_types() )
		);
	}

	private function is_selected( $type ) {
		$type['selected'] = in_array( $type['type'], Brizy_Editor_Storage_Common::instance()->get( 'post-types') );

		return $type;
	}

	private function is_role_selected( $role ) {
		try {
			$selected_roles = Brizy_Editor_Storage_Common::instance()->get( 'exclude-roles' );
		} catch ( Exception $e ) {
			$selected_roles = array();
		}
		$role['selected'] = in_array( $role['id'], $selected_roles );

		return $role;
	}
}