<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Admin_Settings {

	private $selected_post_types;

	private $role_list;

	public static function menu_slug() {
		return brizy()->get_slug() . '-settings';
	}

	public static function _init() {

		static $instance;

		return $instance ? $instance : $instance = new self();
	}

	private function __construct() {

		add_action( 'admin_menu', array( $this, 'action_register_settings_page' ) );
		add_action( 'current_screen', array( $this, 'action_validate_form_submit' ) );
		$this->role_list = $this->get_role_list();

		try {
			$this->selected_post_types = Brizy_Editor_Storage_Common::instance()->get( 'post-types' );
		} catch ( Exception $e ) {
			$this->selected_post_types = array( 'post', 'page' );

			Brizy_Editor_Storage_Common::instance()->set( 'post-types', $this->selected_post_types );
		}
	}

	public function is_settings_page() {
		return get_current_screen()->base === "settings_page_" . brizy()->get_slug() . "-settings";
	}

	/**
	 * @internal
	 */
	public function render() {

		try {
			$list_post_types = $this->list_post_types();
			$args            = array(
				'types'   => array_map( array( $this, 'is_selected' ), $list_post_types ),
				'roles'   => array_map( array( $this, 'is_role_selected' ), $this->list_wp_roles() ),
				'project' => Brizy_Editor_Project::get()
			);
			echo Brizy_Admin_View::render(
				'settings/view',
				$args
			);

			//echo Brizy_Admin_View::render( 'settings/debug', array() );
		} catch ( Exception $e ) {

		}
	}

	/**
	 * @internal
	 */
	function action_register_settings_page() {
		add_menu_page( brizy()->get_name(),
			brizy()->get_name(),
			'manage_options',
			self::menu_slug(),
			array( $this, 'render' ),
			plugins_url( '/static/img/brizy-logo.svg', __FILE__ ),
			81
		);
	}

	/**
	 * @internal
	 **/
	public function action_validate_form_submit() {

		$error_count = 0;

		if ( count( $_POST ) == 0 ) {
			return;
		}

		if ( ! isset( $_POST['_wpnonce'] ) || ! wp_verify_nonce( $_POST['_wpnonce'] ) ) {
			return;
		}
		$allowed_post_types = array_map( array( $this, 'to_type' ), $this->post_types() );
		$allowed_roles      = array_map( array( $this, 'role_to_id' ), $this->list_wp_roles() );

		$post_types = isset( $_POST['post-types'] ) ? (array) $_POST['post-types'] : array();
		$roles      = isset( $_POST['exclude-roles'] ) ? (array) $_POST['exclude-roles'] : array();

		$array_diff = array_diff( $post_types, $allowed_post_types );

		if ( count( $array_diff ) > 0 ) {
			//error
			Brizy_Admin_Flash::instance()->add_error( 'Invalid post type selected' );
			$error_count ++;
		}

		if ( count( array_diff( $roles, (array) $allowed_roles ) ) > 0 ) {
			//error
			Brizy_Admin_Flash::instance()->add_error( 'Invalid role selected' );
			$error_count ++;
		}

		if ( $error_count == 0 ) {
			$this->selected_post_types = $post_types;

			Brizy_Editor_Storage_Common::instance()->set( 'post-types', $post_types );
			Brizy_Editor_Storage_Common::instance()->set( 'exclude-roles', $roles );

			Brizy_Admin_Flash::instance()->add_success( 'Settings saved.' );
		}

		wp_redirect( menu_page_url( brizy()->get_name() ) );

	}

	protected function list_post_types() {
		$types = $this->post_types();

		return array_map( array( $this, 'to_choice' ), $types );
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

	/**
	 * @return array
	 */
	protected function post_types() {
		$types = get_post_types( array( 'public' => true ), 'objects' );

		$types = array_filter(
			$types,
			array( $this, 'filter_types' )
		);

		return $types;
	}


	private function to_choice( WP_Post_Type $type ) {
		return array(
			'type' => $type->name,
			'name' => $type->labels->name,
		);
	}

	private function to_type( WP_Post_Type $type ) {
		return $type->name;
	}

	private function role_to_id( $value ) {
		return $value['id'];
	}


	private function filter_types( WP_Post_Type $type ) {

		return ! in_array( $type->name, array( 'attachment', 'elementor_library' ) );
	}

	private function is_selected( $type ) {
		$type['selected'] = in_array( $type['type'], $this->selected_post_types );

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