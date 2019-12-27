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
		$args = wp_parse_args( Brizy_Editor_Storage_Common::instance()->get( 'maintenance', false ), [
			'mode'  => '',
			'who'   => 'logged',
			'roles' => [],
			'ips'   => [],
		] );

		if ( 'maintenance' === $args['mode'] ) {
			add_action( 'template_redirect', [ $this, '_action_template_redirect' ], 11 );
		}

		$this->set_query( $args );
	}

	private function set_query( $args ) {

		if ( empty( $args['mode'] ) || current_user_can( 'manage_options' ) || $this->is_login() ) {
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

		if ( empty( $args['page'] ) ) {
			return;
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
}