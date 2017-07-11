<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

abstract class Brizy_Storage_Model {

	/**
	 * @param string $key
	 * @param $value
	 *
	 * @return Brizy_Storage_Model
	 */
	public function set( $key, $value ) {
		$storage         = $this->get_storage();
		$storage[ $key ] = $value;
		$this->update_storage( $storage );

		return $this;
	}

	/**
	 * @param string $key
	 *
	 * @return mixed
	 * @throws Brizy_Exception_Not_Found
	 */
	public function get( $key ) {
		$storage = $this->get_storage();

		if ( isset( $storage[ $key ] ) ) {
			return $storage[ $key ];
		}

		throw new Brizy_Exception_Not_Found();
	}

	public function delete( $key ) {
		$storage = $this->get_storage();
		if ( isset( $storage[ $key ] ) ) {
			unset( $storage[ $key ] );
			$this->update_storage( $storage );
		}

		return $this;
	}

	/**
	 * @param array $storage
	 *
	 * @return Brizy_Storage_Model
	 */
	abstract protected function update_storage( array $storage );

	/**
	 * @return array
	 */
	abstract protected function get_storage();
}