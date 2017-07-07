<?php

class BitBlox_WP {

	private static $settings_key = 'post-types';

	private static $instance;

	public static function get() {
		return self::$instance ? self::$instance : self::$instance = new self();
	}

	private function __construct() {
		add_filter( 'bitblox_wp:post_types', array( $this, '_filter_bitblox_supported_port_types' ) );
	}

	public function get_path( $rel = '/' ) {
		$s = DIRECTORY_SEPARATOR;

		return rtrim( plugin_dir_path( dirname( __FILE__ ) . '../' ), $s ) . $s . ltrim( $rel, $s );
	}

	public function get_url( $rel = '' ) {
		return rtrim( plugin_dir_url( 'bitblox-wp/bitblox-wp.php' ), '/' ) . '/' . ltrim( $rel, '/' );
	}

	public function get_domain() {
		return 'bitblox-wp';
	}

	public function get_version() {
		return BITBLOX_WP_VERSION;
	}

	public function get_slug() {
		return 'bitblox-wp';
	}

	public function supported_post_types() {
		return apply_filters( 'bitblox_wp:post_types', array( 'page' ) );
	}

	public function get_name() {
		return 'Bitblox WP';
	}

	/**
	 * @internal
	 *
	 * @param array $types
	 *
	 * @return array
	 **/
	public function _filter_bitblox_supported_port_types( $types ) {

		$saved = $this->get_post_types();

		if ( $saved === null ) {
			return $types;
		}

		return $saved;
	}

	protected function get_post_types() {
		try {
			return BitBlox_WP_Storage::instance()->get( self::$settings_key );
		} catch ( BitBlox_WP_Exception_Not_Found $exception ) {
			return null;
		}
	}
}