<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Editor_Storage_Common extends Brizy_Editor_Storage_Abstract {

	const KEY = 'brizy';

	/**
	 * @return Brizy_Editor_Storage_Common
	 */
	public static function instance() {
		static $instance;

		if ( ! $instance ) {
			$instance = new self();
		}

		return $instance;
	}

	/**
	 * @return array
	 */
	public function get_storage() {

		$get_option = (array) get_option( $this->key(), array() );

		return $get_option;
	}

	/**
	 * @param array $storage
	 *
	 * @return $this
	 */
	protected function update_storage( $storage ) {
		update_option( $this->key(), $storage );

		return $this;
	}

	protected function key() {
		return self::KEY;
	}


	/**
	 * @param $meta_type
	 * @param $object_id
	 * @param string $meta_key
	 * @param bool $single
	 *
	 * @return mixed
	 */
	public function get_metadata( $object_id, $meta_key = '', $single = false ) {
		return  (array) get_option( $meta_key, array() );
	}

	/**
	 * @param $meta_type
	 * @param $object_id
	 * @param $meta_key
	 * @param $meta_value
	 * @param string $prev_value
	 *
	 * @return mixed
	 */
	public function update_metadata( $object_id, $meta_key, $meta_value, $prev_value = '' ) {
		update_option($meta_key, $meta_value );
	}
}