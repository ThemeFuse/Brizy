<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

abstract class Brizy_Editor_Storage_Abstract {

	/**
	 * @param string $key
	 * @param $value
	 *
	 * @return Brizy_Editor_Storage_Abstract
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
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public function get( $key ) {
		$storage = $this->get_storage();

		if ( isset( $storage[ $key ] ) ) {
			return $storage[ $key ];
		}

		throw new Brizy_Editor_Exceptions_NotFound();
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
	 * @return Brizy_Editor_Storage_Abstract
	 */
	abstract protected function update_storage( array $storage );

	/**
	 * @return array
	 */
	abstract protected function get_storage();
}