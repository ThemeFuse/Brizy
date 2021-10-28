<?php

class Brizy_MaintenanceMode {

	private static $instance;
	private $send_headers = false;

	public static function init() {

		if ( self::$instance ) {
			return self::$instance;
		}

		self::$instance = new self();

		return self::$instance;
	}

	/**
	 * Brizy_Maintenance_Mode constructor.
	 */
	private function __construct() {
		$args = self::get_settings();

		if ( empty( $args['mode'] ) || empty( $args['page'] ) || $this->is_requested_a_file() ) {
			return;
		}

		if ( 'maintenance' === $args['mode'] ) {
			add_action( 'template_redirect', [ $this, '_action_template_redirect' ], 11 );
		}

		if ( is_user_logged_in() ) {
			add_action( 'admin_bar_menu', [ $this, 'action_add_menu_in_admin_bar' ], 301 );
			add_action( 'admin_head', [ $this, 'print_style' ] );
			add_action( 'wp_head', [ $this, 'print_style' ] );
        }

		$this->set_query( $args );
	}

	private function set_query( $args ) {

		if ( current_user_can( 'manage_options' ) || $this->is_login() ) {
			return;
		}

		if ( 'logged' === $args['who'] && is_user_logged_in() ) {
			return;
		}

		if ( false !== strpos( $args['ips'], $this->get_user_ip() ) ) {
			return;
		}

		if ( 'custom' === $args['who'] ) {
			$user          = wp_get_current_user();
			$user_roles    = $user->roles;
			$compare_roles = array_intersect( $user_roles, $args['roles'] );

			if ( ! empty( $compare_roles ) ) {
				return;
			}
		}

		if ( is_user_logged_in() && ( is_admin() || ! empty( $_GET ) ) ) {
			wp_redirect( home_url() );
			exit;
		}

		$this->send_headers = true;

		$GLOBALS['post'] = get_post( $args['page'] );

		query_posts( [
			'p'         => $args['page'],
			'post_type' => 'page',
		] );
	}

	public function _action_template_redirect() {

		if ( ! $this->send_headers ) {
			return;
		}

		$protocol = wp_get_server_protocol();
		header( "$protocol 503 Service Unavailable", true, 503 );
		header( 'Content-Type: text/html; charset=utf-8' );
		header( 'Retry-After: 600' );
	}

	/**
	 * Add menu in admin bar.
	 *
	 * Adds "Maintenance Mode" items to the WordPress admin bar.
	 *
	 * Fired by `admin_bar_menu` filter.
	 *
	 * @access public
	 *
	 * @param \WP_Admin_Bar $wp_admin_bar WP_Admin_Bar instance, passed by reference.
	 */
	public function action_add_menu_in_admin_bar( \WP_Admin_Bar $wp_admin_bar ) {

		$args = self::get_settings();

		$wp_admin_bar->add_node( [
			'id'    => 'brizy-maintenance-on',
			'title' => __( 'Maintenance Mode ON', 'brizy' ),
			'href'  => esc_url( add_query_arg( [ 'page' => Brizy_Admin_Settings::menu_slug(), 'tab' => 'maintenance' ], admin_url() ) ),
		] );

		$wp_admin_bar->add_node( [
			'id'     => 'brizy-maintenance-edit',
			'parent' => 'brizy-maintenance-on',
			'title'  => __( 'Edit Page', 'brizy' ),
			'href'   => add_query_arg(
				[ Brizy_Editor::prefix('-edit') => '' ],
				get_permalink( $args['page'] )
			),
		] );
	}

	/**
	 * Print css style.
	 *
	 * Adds custom CSS to the HEAD html tag. The CSS that emphasise the maintenance
	 * mode with red colors.
	 *
	 * Fired by `admin_head` and `wp_head` filters.
	 *
	 * @access public
	 */
	public function print_style() {
		?>
		<style>#wp-admin-bar-brizy-maintenance-on > a { background-color: #dc3232; }
			#wp-admin-bar-brizy-maintenance-on > .ab-item:before { content: "\f160"; top: 2px; }
		</style>
		<?php
	}

	private function get_user_ip() {

		if ( ! empty( $_SERVER['HTTP_X_FORWARDED_FOR'] ) ) {
			if ( strpos( $_SERVER['HTTP_X_FORWARDED_FOR'], ',' ) > 0 ) {
				$addr = explode( ",", $_SERVER['HTTP_X_FORWARDED_FOR'] );

				return trim( $addr[0] );
			}

			return $_SERVER['HTTP_X_FORWARDED_FOR'];

		} elseif ( ! empty( $_SERVER['REMOTE_ADDR'] ) ) {
			return $_SERVER['REMOTE_ADDR'];
		} elseif ( ! empty( $_SERVER['HTTP_CLIENT_IP'] ) ) {
			return $_SERVER['HTTP_CLIENT_IP'];
		} else {
			return 'unknown.ip';
		}
	}

	private function is_login() {
		$files = get_included_files();

		return
			in_array( ABSPATH . 'wp-login.php', $files ) ||
			in_array( ABSPATH . 'wp-register.php', $files ) ||
			$_SERVER['PHP_SELF'] == '/wp-login.php' ||
			( isset( $_GLOBALS['pagenow'] ) && $GLOBALS['pagenow'] === 'wp-login.php' );
	}

	public static function get_settings() {
		return wp_parse_args( Brizy_Editor_Storage_Common::instance()->get( 'maintenance', false ), [
			'mode'  => '',
			'who'   => 'logged',
			'roles' => [],
			'ips'   => '',
            'page'  => ''
		] );
	}

	private function is_requested_a_file() {
	    $out = false;

	    if (
	            ! empty( $_GET[ Brizy_Editor::prefix( Brizy_Public_CropProxy::ENDPOINT ) ] )
                &&
	            ! empty( $_GET[ Brizy_Editor::prefix( Brizy_Public_CropProxy::ENDPOINT_FILTER ) ] )
        ) {
		    $out = true;
        }

	    if ( ! empty( $_GET[ Brizy_Admin_Fonts_Main::CP_FONT ] ) ) {
	        $out = true;
        }

	    if ( ! empty( $_GET[ Brizy_Editor::prefix( Brizy_Public_AttachmentProxy::ENDPOINT ) ] ) ) {
	        $out = true;
        }

		return $out;
	}
}