<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Flash {
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
		add_action( 'wp_loaded', array( 'Brizy_Flash', '_action_render_notices' ) );
		add_action( 'admin_notices', array( 'Brizy_Flash', '_action_render_notices' ) );
		add_action( 'shutdown', array( 'Brizy_Flash', '_action_store_notices' ) );
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
			echo Brizy_Admin::render( 'notice', $notice );
		}

		self::$notices = array();
	}

	public static function _action_store_notices() {
		if ( ! empty( self::$notices ) ) {
			set_transient( 'brizy-admin-notices', self::$notices, 120 );
		}
	}

	protected static function load_notices() {
		$notices = get_transient( 'brizy-admin-notices' );
		if ( $notices ) {
			self::$notices = $notices;
			delete_transient( 'brizy-admin-notices' );
		}
	}
}