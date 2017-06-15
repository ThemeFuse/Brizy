<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class BitBlox_WP_Storage extends BitBlox_WP_Storage_Model {

	/**
	 * @return BitBlox_WP_Storage
	 */
	public static function instance() {
		static $instance;

		return $instance ? $instance : $instance = new BitBlox_WP_Storage();
	}

	protected function __construct() {

	}

	/**
	 * @return array
	 */
	protected function get_storage() {
		return (array) get_option( $this->key(), array() );
	}

	/**
	 * @param array $storage
	 *
	 * @return $this
	 */
	protected function update_storage( array $storage ) {
		update_option( $this->key(), $storage );

		return $this;
	}

	protected function key() {
		return 'bitblox-wp';
	}
}