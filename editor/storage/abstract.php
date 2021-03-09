<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

abstract class Brizy_Editor_Storage_Abstract {

	public function loadStorage( $value ) {
		$this->update_storage( $value );
	}


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
	 * @param $key
	 * @param bool $thorw_if_notset
	 *
	 * @return mixed
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public function get( $key, $thorw_if_notset = true ) {
		$storage = $this->get_storage();

		if ( isset( $storage[ $key ] ) ) {
			return $storage[ $key ];
		}

		if ( $thorw_if_notset ) {
			throw new Brizy_Editor_Exceptions_NotFound( "The key [{$key}] was not found in storage." );
		}

		return null;
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
	abstract protected function update_storage( $storage );

	/**
	 * @return array
	 */
	abstract public function get_storage();
}
