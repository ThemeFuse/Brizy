<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Post_Storage extends Brizy_Storage_Model {
	/**
	 * @param $id
	 *
	 * @return Brizy_Post_Storage
	 */
	public static function instance( $id ) {
		return new Brizy_Post_Storage( $id );
	}

	private $id;

	protected function __construct( $id ) {
		$this->id = $id;
	}

	protected function get_id() {
		return $this->id;
	}

	/**
	 * @return array
	 */
	protected function get_storage() {
		return (array) get_post_meta( $this->get_id(), $this->key(), true );
	}

	/**
	 * @param array $storage
	 *
	 * @return $this
	 */
	protected function update_storage( array $storage ) {
		update_post_meta( $this->get_id(), $this->key(), $storage );

		return $this;
	}

	protected function key() {
		return 'brizy';
	}
}