<?php

class BitBlox_WP {

	private static $instance;

	public static function get() {
		return self::$instance ? self::$instance : self::$instance = new self();
	}

	private function __construct() {
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
}