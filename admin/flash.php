<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Admin_Flash {

	const BRIZY_NOTICE_TRANSIENT_KEY = 'brizy-admin-notices';

	/**
	 * @var Brizy_Admin_Flash
	 */
	private static $instance;

	const INFO = 'info';
	const WARNING = 'waring';
	const SUCCESS = 'success';
	const ERROR = 'error';

	/**
	 * @var array
	 */
	private $notices = array();

	public static function instance() {

		if ( self::$instance ) {
			return self::$instance;
		}

		return self::$instance = new self();
	}

	public function initialize() {

		//add_action( 'wp_loaded', array( $this, '_action_render_notices' ) );
		add_action( 'admin_notices', array( $this, '_action_render_notices' ),100 );
		add_action( 'network_admin_notices', array( $this, '_action_render_notices' ),100 );
		add_action( 'shutdown', array( $this, '_action_store_notices' ) );

		$this->load_notices();
	}

	public function _action_render_notices() {
		foreach ( $this->notices as $notice ) {
			echo Brizy_Admin_View::render( 'notice', $notice );
		}

		$this->notices = array();
	}

	public function _action_store_notices() {
		if ( ! empty( $this->notices ) ) {
			set_transient( self::BRIZY_NOTICE_TRANSIENT_KEY, $this->notices, 120 );
		}
	}

	protected function load_notices() {
		$notices = get_transient( self::BRIZY_NOTICE_TRANSIENT_KEY );
		if ( $notices ) {
			$this->notices = $notices;
			delete_transient( self::BRIZY_NOTICE_TRANSIENT_KEY );
		}
	}


	public function add( $message, $type ) {
		$this->notices[ md5( $message ) ] = array(
			'message' => $message,
			'type'    => $type,
		);
	}


	public function add_info( $message ) {
		$this->add( $message, self::INFO );
	}

	public function add_warning( $message ) {
		$this->add( $message, self::WARNING );
	}

	public function add_success( $message ) {
		$this->add( $message, self::SUCCESS );
	}

	public function add_error( $message ) {
		$this->add( $message, self::ERROR );
	}

	public function count() {
		return count( $this->notices );
	}

	public function has( $hash ) {
		return isset( $this->notices[ $hash ] );
	}

	public function has_notice_type( $type ) {

		$array_filter = array_filter( $this->notices, function ( $var ) use ( $type ) {
			return $var['type'] == $type;
		} );

		return count( $array_filter ) > 0;
	}

	public function get( $hash ) {
		if ( $this->has( $hash ) ) {
			return $this->notices[ $hash ];
		}

		return null;
	}
}