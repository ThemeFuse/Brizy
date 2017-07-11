<?php

class Brizy_WP {

	private static $settings_key = 'post-types';

	private static $instance;

	public static function get() {
		return self::$instance ? self::$instance : self::$instance = new self();
	}

	private function __construct() {
		add_filter( 'brizy:post_types', array( $this, '_filter_brizy_supported_port_types' ) );
	}

	public function get_path( $rel = '/' ) {
		$s = DIRECTORY_SEPARATOR;

		return rtrim( plugin_dir_path( dirname( __FILE__ ) . '../' ), $s ) . $s . ltrim( $rel, $s );
	}

	public function get_url( $rel = '' ) {
		return rtrim( plugin_dir_url( 'brizy/brizy.php' ), '/' ) . '/' . ltrim( $rel, '/' );
	}

	public function get_domain() {
		return 'brizy';
	}

	public function get_version() {
		return BRIZY_VERSION;
	}

	public function get_slug() {
		return 'brizy';
	}

	public function supported_post_types() {
		return apply_filters( 'brizy:post_types', array( 'page' ) );
	}

	public function get_name() {
		return 'Brizy';
	}

	/**
	 * @internal
	 *
	 * @param array $types
	 *
	 * @return array
	 **/
	public function _filter_brizy_supported_port_types( $types ) {

		$saved = $this->get_post_types();

		if ( $saved === null ) {
			return $types;
		}

		return $saved;
	}

	protected function get_post_types() {
		try {
			return Brizy_Storage::instance()->get( self::$settings_key );
		} catch ( Brizy_Exception_Not_Found $exception ) {
			return null;
		}
	}
}