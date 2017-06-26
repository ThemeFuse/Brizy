<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class BitBlox_WP_Flash {
	const INFO = 'info';
	const WARNING = 'waring';
	const SUCCESS = 'success';
	const ERROR = 'error';

	private static $notices = array();

	public static function _init() {
		if ( defined( 'DOING_AJAX' ) ) {
			return;
		}

		static $initialised = false;

		if ( $initialised ) {
			return;
		}

		self::load_notices();
		add_action( 'wp_loaded', array( 'BitBlox_WP_Flash', '_action_render_notices' ) );
		add_action( 'admin_notices', array( 'BitBlox_WP_Flash', '_action_render_notices' ) );
		add_action( 'shutdown', array( 'BitBlox_WP_Flash', '_action_store_notices' ) );
		$initialised = true;
	}

	public static function add_notice( $code, $message, $type = self::INFO ) {
		self::$notices[ $code ] = array(
			'message' => $message,
			'type'    => $type,
		);
	}

	public static function _action_render_notices() {
		foreach ( self::$notices as $notice ) {
			echo BitBlox_WP_Admin::render( 'notice', $notice );
		}

		self::$notices = array();
	}

	public static function _action_store_notices() {
		if ( ! empty( self::$notices ) ) {
			set_transient( 'bitblox-wp-admin-notices', self::$notices, 120 );
		}
	}

	protected static function load_notices() {
		$notices = get_transient( 'bitblox-wp-admin-notices' );
		if ( $notices ) {
			self::$notices = $notices;
			delete_transient( 'bitblox-wp-admin-notices' );
		}
	}
}