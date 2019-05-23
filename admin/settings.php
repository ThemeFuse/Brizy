<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}



class Brizy_Admin_Settings {

	private $selected_post_types;

	private $role_list;

	private $capability_options;

	/**
	 * @var string
	 */
	private $screenName;


	public static function menu_slug() {
		return 'brizy-settings';
	}

	/**
	 * @return Brizy_Admin_Settings
	 */
	public static function _init() {

		static $instance;

		return $instance ? $instance : $instance = new self();
	}

	/**
	 * Brizy_Admin_Settings constructor.
	 */
	private function __construct() {

		add_action( 'admin_menu', array( $this, 'actionRegisterSettingsPage' ) );

		if ( ! is_network_admin() ) {
			add_action( 'admin_menu', array( $this, 'actionRegisterRoleManagerPage' ), 9 );
			add_action( 'admin_menu', array( $this, 'actionRegisterGoProPage' ), 20 );
		} else {
			add_action( 'network_admin_menu', array( $this, 'actionRegisterSettingsPage' ), 10 );
		}

		add_action( 'admin_head', array( $this, 'addClassToWpNavMenu' ) );
		add_action( 'current_screen', array( $this, 'action_validate_form_submit' ) );
		add_action( 'brizy_settings_role_capability_row', array( $this, 'role_capability_select_row' ) );
		add_action( 'brizy_settings_post_type_row', array( $this, 'post_type_row' ) );
		add_action( 'brizy_settings_submit', array( $this, 'settings_submit' ) );
		add_action( 'brizy_settings_render_tabs', array( $this, 'render_tabs' ) );
		add_action( 'brizy_settings_render_content', array( $this, 'render_tab_content' ) );

		$this->role_list          = self::get_role_list();
		$this->capability_options = $this->get_capability_options();

		try {
			$this->selected_post_types = Brizy_Editor_Storage_Common::instance()->get( 'post-types' );
		} catch ( Exception $e ) {
			$this->selected_post_types = array( 'post', 'page' );

			Brizy_Editor_Storage_Common::instance()->set( 'post-types', $this->selected_post_types );
		}
	}

	/**
	 * Keep the tempate menu selected
	 */
	function addClassToWpNavMenu() {
		global $parent_file, $submenu_file, $post_type;
		if ( Brizy_Admin_Templates::CP_TEMPLATE == $post_type ) :
			$submenu_file = 'edit.php?post_type=brizy_template';
		endif;
	}

	/**
	 * @internal
	 */
	function actionRegisterSettingsPage() {

		if ( ! Brizy_Editor::is_user_allowed() || is_network_admin() ) {
			return;
		}

		$this->screenName =  add_menu_page( Brizy_Editor::get()->get_name(),
			Brizy_Editor::get()->get_name(),
			'read',
			self::menu_slug(),
			array( $this, 'render' ),
			__bt( 'brizy-logo', plugins_url( 'static/img/brizy-logo.svg', __FILE__ ) ),
			//plugins_url( '/static/img/brizy-logo.svg', __FILE__ ),
			81
		);
	}

	/**
	 * @internal
	 */
	function actionRegisterRoleManagerPage() {
		 add_submenu_page( self::menu_slug(), __( 'Role Manager' ), __( 'Role Manager' ), 'manage_options', self::menu_slug(), array(
			$this,
			'render'
		) );
	}

	/**
	 * @internal
	 */
	public function actionRegisterGoProPage() {

	    if ( class_exists( 'BrizyPro_Main' ) ) {
	        return;
        }

		add_submenu_page(
            self::menu_slug(),
            '',
            '<span style="display:flex;color:#00b9eb;">
                <svg height="20" width="20">
                    <path d="M13,7 L12,7 L12,4.73333333 C12,2.6744 10.206,1 8,1 C5.794,1 4,2.6744 4,4.73333333 L4,7 L3,7 C2.448,7 2,7.41813333 2,7.93333333 L2,14.0666667 C2,14.5818667 2.448,15 3,15 L13,15 C13.552,15 14,14.5818667 14,14.0666667 L14,7.93333333 C14,7.41813333 13.552,7 13,7 Z M10,5 L12,5 L12,7 L10,7 L6,7 L6,5 C6,3.897 6.897,3 8,3 C9.103,3 10,3.897 10,5 Z" fill="#00b9eb" fill-rule="nonzero"/>
                </svg>' .
                __( 'Go Pro', 'brizy' ) .
            '</span>',
            'manage_options',
			Brizy_Config::GO_PRO_DASHBOARD_URL,
            array()
        );
	}

	private function get_selected_tab() {
		return $tab = ( ! empty( $_REQUEST['tab'] ) ) ? esc_attr( $_REQUEST['tab'] ) : null;
	}

	private function get_tabs() {
		$selected_tab = $this->get_selected_tab();
		$tabs         = array(
			array(
				'id'          => 'general',
				'label'       => 'General',
				'is_selected' => is_null( $selected_tab ) || $selected_tab == 'general',
				'href'        => menu_page_url( self::menu_slug(), false ) . "&tab=general"
			),
			array(
				'id'          => 'roles',
				'label'       => 'Role Manager',
				'is_selected' => $selected_tab == 'roles',
				'href'        => menu_page_url( self::menu_slug(), false ) . "&tab=roles"
			),

		);

		return apply_filters( 'brizy_settings_tabs', $tabs );
	}

	private function get_tab_content( $tab ) {
		switch ( $tab ) {
			default:
			case 'general':
				return $this->get_general_tab();
				break;
			case 'roles':
				return $this->get_roles_tab();
				break;

		}
	}

	private function get_general_tab() {
		$list_post_types = $this->list_post_types();
		$prepared_types  = array_map( array( $this, 'is_selected' ), $list_post_types );

		return Brizy_Admin_View::render(
			'settings/general',
			array( 'types' => $prepared_types, )
		);
	}

	private function get_roles_tab() {
		return Brizy_Admin_View::render(
			'settings/roles',
			array( 'roles' => array_map( array( $this, 'is_role_selected' ), $this->list_wp_roles() ), )
		);
	}

	/**
	 * @return bool
	 */
	public function is_settings_page() {
		return get_current_screen()->base === "settings_page_" . Brizy_Editor::get()->get_slug() . "-settings";
	}

	public function settings_submit() {

		$screen = get_current_screen();

		if ( $this->screenName != $screen->id ) {
			return;
		}

		switch ( $_POST['tab'] ) {
			case 'general':
				$this->general_settings_submit();
				break;
			case 'roles':
				$this->roles_settings_submit();
				break;
		}
	}


	public function general_settings_submit() {
		$error_count        = 0;
		$allowed_post_types = array_map( array( $this, 'to_type' ), $this->post_types() );
		$post_types         = isset( $_POST['post-types'] ) ? (array) $_POST['post-types'] : array();
		$array_diff         = array_diff( $post_types, $allowed_post_types );

		if ( count( $array_diff ) > 0 ) {
			//error
			Brizy_Admin_Flash::instance()->add_error( 'Invalid post type selected' );
			$error_count ++;
		}

		if ( $error_count == 0 ) {
			$this->selected_post_types = $post_types;
			Brizy_Editor_Storage_Common::instance()->set( 'post-types', $post_types );
		}

	}

	/**
	 * Return the list of allowed capabilities Ids
	 * @return array
	 */
	public function get_capabilities() {
		$capabilities = $this->get_capability_options();
		$caps         = array();

		foreach ( $capabilities as $capability ) {
			$caps[] = $capability['capability'];
		}

		return $caps;
	}

	/**
	 * Return the list of capabilities including the label
	 *
	 * @return mixed|void
	 */
	public function get_capability_options() {
		return apply_filters( 'brizy_settings_capability_options', array(
			array( 'capability' => '', 'label' => 'No Access' ),
			array( 'capability' => Brizy_Admin_Capabilities::CAP_EDIT_WHOLE_PAGE, 'label' => 'Full Access' )
		) );
	}

	public function roles_settings_submit() {
		$allowed_roles        = array_map( array( $this, 'role_to_id' ), $this->list_wp_roles() );
		$allowed_capabilities = $this->get_capabilities();
		$roles                = isset( $_POST['role-capability'] ) ? (array) $_POST['role-capability'] : array();

		if ( count( $roles ) != 0 ) {
			foreach ( $roles as $role_id => $capability ) {

				if ( ! in_array( $role_id, $allowed_roles ) ) {
					continue;
				}

				// validate capability
				if ( $capability != "" && ! in_array( $capability, $allowed_capabilities ) ) {
					continue;
				}

				// remove all brizy capabilities from this role
				foreach ( $allowed_capabilities as $cap ) {
					wp_roles()->remove_cap( $role_id, $cap );
				}

				if ( $capability != "" ) {
					wp_roles()->add_cap( $role_id, $capability );
				}
			}
		}
	}

	/**
	 * @internal
	 */
	public function render() {

		if ( is_network_admin() ) {
			return;
		}

		try {
			echo Brizy_Admin_View::render(
				'settings/view',
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

		echo apply_filters( 'brizy_settings_render_tab', $this->get_tab_content( $tab ) );
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

		do_action( 'brizy_settings_submit' );

		if ( ! Brizy_Admin_Flash::instance()->has_notice_type( Brizy_Admin_Flash::ERROR ) ) {
			Brizy_Admin_Flash::instance()->add_success( 'Settings saved.' );
		}

		$tab = $this->get_selected_tab();

		wp_redirect( menu_page_url( $this->menu_slug(), false ) . ( $tab ? '&tab=' . $tab : '' ) );

		exit;

	}

	protected function list_post_types() {
		$types = $this->post_types();

		return array_map( array( $this, 'post_type_to_choice' ), $types );
	}

	static public function get_role_list() {
		$roles = wp_roles()->roles;

		unset( $roles['administrator'] );

		foreach ( $roles as $key => $role ) {
			$roles[ $key ]['id'] = $key;
		}

		$roles = apply_filters( 'brizy_settings_roles', $roles );

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


	private function post_type_to_choice( WP_Post_Type $type ) {
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
		$role['selected'] = ! isset( $role['capabilities'][ Brizy_Admin_Capabilities::CAP_EDIT_WHOLE_PAGE ] );

		return $role;
	}

	public function role_capability_select_row( $role ) {
		?>
        <tr class="user-display-name-wrap">
            <th><label for="display_name"><?php echo $role['name'] ?></label></th>
            <td>
                <select name="role-capability[<?php echo $role['id'] ?>]">
					<?php
					foreach ( $this->capability_options as $option ) {
						?>
                        <option value="<?php echo $option['capability'] ?>"
							<?php echo isset( $role['capabilities'][ $option['capability'] ] ) ? 'selected' : '' ?>>
							<?php echo $option['label'] ?>
                        </option>
						<?php
					}
					?>
                </select>
            </td>
        </tr>
		<?php
	}

	public function post_type_row( $type ) {
		?>
        <label>
            <input type="checkbox"
                   name="post-types[]"
                   value="<?php echo $type['type']; ?>"
				<?php echo $type['selected'] ? 'checked' : ''; ?>
            >
			<?php echo $type['name']; ?>
        </label>
		<?php
	}
}







































































