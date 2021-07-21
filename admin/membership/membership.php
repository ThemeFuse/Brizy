<?php

class Brizy_Admin_Membership_Membership {

	static $instance = null;

	/**
	 * @return Brizy_Admin_Membership_Membership
	 */
	public static function _init() {
		static $instance;

		if ( ! $instance ) {
			$instance = new self();
		}

		return $instance;
	}

	public function __construct() {
		add_action( 'admin_bar_init', [ $this, 'admin_bar_init' ] );
	}

	public function admin_bar_init() {

		$pid = Brizy_Editor::get()->currentPostId();

		if ( Brizy_Admin_Templates::instance()->getTemplateForCurrentPage() || ( $pid && Brizy_Editor_Entity::isBrizyEnabled( $pid ) ) ) {
			add_action( 'admin_bar_menu', [ $this, 'admin_bar_menu' ], 10000 );
			add_action( 'wp_head',        [ $this, 'wp_head' ] );
		}
	}

	/**
	 * @return array
	 */
	public static function roleList() {
		$editable_roles = apply_filters( 'editable_roles', wp_roles()->roles );
		$wpRoles        = [ 'customer', 'shop_manager', 'subscriber', 'contributor', 'author', 'editor', 'administrator' ];
		$roles          = [];

		foreach ( $wpRoles as $role ) {
			if ( isset( $editable_roles[ $role ] ) ) {
				$roles[] = [
					'role' => $role,
					'name' => translate_user_role( $editable_roles[ $role ]['name'] )
				];
			}
		}

		return apply_filters( 'brizy_avaible_roles', $roles );
	}

	public function admin_bar_menu( &$wp_admin_bar ) {

		if ( is_admin() ) {
			return;
		}

		global $wp;

		$roles = self::roleList();

		array_unshift( $roles,
			[
				'name' => esc_html__( 'Default', 'brizy-pro' ),
				'role' => 'default'
			],
			[
				'name' => esc_html__( 'Not Logged', 'brizy-pro' ),
				'role' => 'not_logged'
			]
		);

		$getRole  = 'default';
		$selected = $roles[0]['name'];

		if ( ! empty( $_GET['role'] ) ) {
			$index = array_search( $_GET['role'], wp_list_pluck( $roles, 'role' ) );

			if ( false !== $index ) {
				$selected = $roles[ $index ]['name'];
				$getRole  = $_GET['role'];
			}
		}

		$wp_admin_bar->add_menu( [
			'id'    => $this->get_menu_id(),
			'title' => sprintf( esc_html__( 'View Page As %s', 'brizy-pro' ), $selected )
		] );

		foreach ( $roles as $role ) {
			$args = [
				'parent' => $this->get_menu_id(),
				'id'     => Brizy_Editor::prefix( '-membership-view-as-' . $role['role'] ),
				'title'  => $role['name'],
				'href' => add_query_arg( 'role', $role['role'], add_query_arg( [ $_GET ], wp_guess_url() ) ),
			];

			if ( $role['role'] == $getRole ) {
				$args['meta'] = [ 'class' => 'active' ];
			}

			$wp_admin_bar->add_node( $args );
		}
	}

	public function wp_head() {
		echo
			'<style id="membership-css">' .
				'#wp-admin-bar-' . $this->get_menu_id() . ' .active a {
					color: #72aee6 !important;
				}
			</style>';
	}

	private function get_menu_id() {
		return Brizy_Editor::prefix( '-membership-admin-bar-menu' );
	}
}
