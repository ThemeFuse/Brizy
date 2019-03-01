<?php

abstract class Brizy_Admin_Serializable implements Serializable, JsonSerializable {

	/**
	 * @return string
	 */
	public function serialize() {
		$get_object_vars = get_object_vars( $this );

		return serialize( $get_object_vars );
	}

	/**
	 * @param string $data
	 */
	public function unserialize( $data ) {

		$vars = unserialize( $data );

		foreach ( $vars as $prop => $value ) {
			$this->$prop = $value;
		}
	}

	/**
	 * @return mixed
	 */
	abstract public function convertToOptionValue();

	/**
	 * @param $data
	 *
	 * @throws Exception
	 */
	static public function createFromSerializedData( $data ) {
		throw new Exception( 'Not implemented' );
	}

	/**
	 * @return array|mixed
	 */
	public function jsonSerialize() {
		return get_object_vars( $this );
	}
}