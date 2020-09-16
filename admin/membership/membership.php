<?php defined( 'ABSPATH' ) or die();

class Brizy_Admin_Membership_Membership {

	const CP_ROLE = 'editor_roles';

	public static function _init() {

		static $instance;

		return $instance ? $instance : $instance = new self();
	}

	private function __construct() {
		add_action( 'enter_title_here',                   [ $this, 'enter_title_here' ] );
		add_action( 'transition_post_status',             [ $this, 'transition_post_status' ], 10, 3 );
		add_filter( 'post_updated_messages',              [ $this, 'post_updated_messages' ] );
		add_filter( 'post_row_actions',                   [ $this, 'post_row_actions' ], 10, 1 );
		add_filter( 'bulk_actions-edit-' . self::CP_ROLE, [ $this, 'bulk_actions' ] );
		add_filter( 'admin_enqueue_scripts',              [ $this, 'admin_enqueue_scripts' ] );
		add_filter( 'admin_head',                         [ $this, 'admin_head' ] );
		add_action( 'show_user_profile',                  [ $this, 'output_checklist' ] );
		add_action( 'edit_user_profile',                  [ $this, 'output_checklist' ] );
		add_action( 'user_new_form',                      [ $this, 'output_checklist' ] );
		add_action( 'profile_update',                     [ $this, 'profile_update' ] );
	}

	static public function registerCustomPostRoles() {

		$labels = array(
			'name'               => _x( 'Roles', 'post type general name', 'brizy' ),
			'singular_name'      => _x( 'Role', 'post type singular name', 'brizy' ),
			'menu_name'          => _x( 'Roles', 'admin menu', 'brizy' ),
			'name_admin_bar'     => _x( 'Role', 'add new on admin bar', 'brizy' ),
			'add_new'            => _x( 'Add Role', 'add new post type role', 'brizy' ),
			'add_new_item'       => __( 'Add New Role', 'brizy' ),
			'new_item'           => __( 'New Role', 'brizy' ),
			'edit_item'          => __( 'Edit Role', 'brizy' ),
			'view_item'          => __( 'View Role', 'brizy' ),
			'all_items'          => __( 'Roles', 'brizy' ),
			'search_items'       => __( 'Search Role', 'brizy' ),
			'parent_item_colon'  => __( 'Parent Role:', 'brizy' ),
			'not_found'          => __( 'No Roles found.', 'brizy' ),
			'not_found_in_trash' => __( 'No Roles found in Trash.', 'brizy' )
		);

		register_post_type( self::CP_ROLE,
			array(
				'labels'              => $labels,
				'public'              => false,
				'has_archive'         => false,
				'description'         => __bt( 'brizy', 'Brizy' ) . ' ' . __( 'roles', 'brizy' ) . '.',
				'publicly_queryable'  => false,
				'show_ui'             => true,
				'show_in_menu'        => 'users.php',
				'query_var'           => false,
				'rewrite'             => array( 'slug' => 'editor-roles' ),
				'capability_type'     => 'page',
				'hierarchical'        => false,
				'show_in_rest'        => false,
				'can_export'          => true,
				'exclude_from_search' => true,
				'supports'            => array( 'title' )
			)
		);
	}

	public function enter_title_here( $title ) {

		if ( ! $this->is_screen_roles() ) {
			return $title;
		}

		return esc_html__( 'Enter Role Name', 'brizy' );
	}

	private function is_screen_roles() {

		if ( ! function_exists( 'get_current_screen' ) ) {
			return false;
		}

		$screen = get_current_screen();

		return ! ( empty( $screen->post_type ) || self::CP_ROLE !== $screen->post_type );
	}

	public function transition_post_status( $new_status, $old_status, $post ) {

		if ( ! $this->can_update_roles() || $post->post_type !== self::CP_ROLE ) {
			return;
		}

		$postID = $post->ID;

		if ( $old_status == 'publish' && $new_status != 'publish' ) {
			remove_role( get_post_meta( $postID, 'role_id', true ) );
		}

		if ( $new_status === 'publish' ) {
			$role_id         = get_post_meta( $postID, 'role_id', true );
			$roleDisplayName = empty( $post->post_title ) ? 'Role #' . $postID : $post->post_title;

			if ( ! $role_id ) {
				$role_id = sanitize_title_with_dashes( $roleDisplayName ) . '-' . $postID;
				update_post_meta( $postID, 'role_id', $role_id );
			}

			remove_role( $role_id );

			add_role( $role_id, $roleDisplayName );
		}
	}

	public function post_updated_messages( $messages ) {

		$messages[ self::CP_ROLE ] = array(
			0  => '',
			1  => __( 'Role updated.', 'brizy' ),
			2  => __( 'Custom field updated.', 'brizy' ),
			3  => __( 'Custom field deleted.', 'brizy' ),
			4  => __( 'Role updated.', 'brizy' ),
			6  => __( 'Role published.', 'brizy' ),
			7  => __( 'Role saved.', 'brizy' ),
			8  => __( 'Role submitted.', 'brizy' ),
		);

		return $messages;
	}

	public function post_row_actions( $actions ) {

		if ( ! $this->is_screen_roles() ) {
			return $actions;
		}

		unset( $actions['inline hide-if-no-js'] );

		return $actions;
	}

	public function bulk_actions( $actions ){
		unset( $actions[ 'edit' ] );
		return $actions;
	}

	public function admin_enqueue_scripts() {
		global $pagenow;

		if ( 'user-edit.php' !== $pagenow && 'user-new.php' !== $pagenow && 'profile.php' !== $pagenow ) {
			return;
		}

		wp_register_script( 'editor-add-roles-checklist', '', [ 'jquery' ], '', true );
		wp_enqueue_script( 'editor-add-roles-checklist' );

		$script =
			"jQuery( document ).ready( function( $ ) {
                $( '.user-role-wrap td' ).html( $( '.editor-checklist-roles' ).html() );
                $( '.editor-checklist-roles' ).remove();
            } );";

		wp_add_inline_script( 'editor-add-roles-checklist', $script );
	}

	public function admin_head() {

		if ( ! $this->is_screen_roles() ) {
			return;
		}

		echo '<style>#minor-publishing{display:none;}</style>';
	}

	public function output_checklist( $user ) {

		if ( ! $this->can_update_roles() ) {
			return;
		}

		wp_nonce_field( 'editor-user-profile', 'editor-user-profile-nonce' );

		echo Brizy_Admin_View::render(
			'membership/checklist',
			[
				'roles'      => $this->get_editable_roles(),
				'user_roles' => isset( $user->roles ) ? $user->roles : null
			]
		);
	}

	/**
	 * Update the given user's roles as long as we've passed the nonce
	 * and permissions checks.
	 *
	 * @param int $user_id The user ID whose roles might get updated.
	 */
	public function profile_update( $user_id ) {

		if ( ! isset( $_POST['editor-user-profile-nonce'] ) || ! wp_verify_nonce( $_POST['editor-user-profile-nonce'], 'editor-user-profile' ) ) {
			return;
		}

		if ( ! $this->can_update_roles() ) {
			return;
		}

		$roles = ( isset( $_POST['editor_multiple_roles'] ) && is_array( $_POST['editor_multiple_roles'] ) ) ? $_POST['editor_multiple_roles'] : [];

		$roles = array_map( 'sanitize_key', (array) $roles );
		$roles = array_filter( (array) $roles, 'get_role' );
		$user  = get_user_by( 'id', (int) $user_id );

		// Remove all editable roles
		$editable       = get_editable_roles();
		$editable_roles = is_array( $editable ) ? array_keys( $editable ) : [];

		foreach( $editable_roles as $role ) {
			$user->remove_role( $role );
		}

		foreach( $roles as $role ) {
			$user->add_role( $role );
		}
	}

	/**
	 * Check whether or not a user can edit roles. User must have the edit_roles cap and
	 * must be on a specific site (and not in the network admin area). Users also can't
	 * edit their own roles unless they're a network admin.
	 *
	 * @return bool True if current user can update roles, false if not.
	 */
	public function can_update_roles() {

		if ( is_network_admin() || ! current_user_can( 'promote_users' ) || ( defined( 'IS_PROFILE_PAGE' ) && IS_PROFILE_PAGE && ! current_user_can( 'manage_sites' ) ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Get all editable roles by the current user
	 *
	 * @return array editable roles
	 */
	public function get_editable_roles() {

		$editable_roles = get_editable_roles();
		$final_roles    = [];

		foreach ( $editable_roles as $key => $role ) {
			$final_roles[ $key ] = $role['name'];
		}

		return $final_roles;
	}
}