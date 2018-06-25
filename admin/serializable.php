<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 3/16/18
 * Time: 3:02 PM
 */

abstract class Brizy_Admin_Serializable implements Serializable, JsonSerializable {

	public function serialize() {
		$get_object_vars = get_object_vars( $this );

		return serialize( $get_object_vars );
	}

	public function unserialize( $data ) {

		$vars = unserialize( $data );

		foreach ( $vars as $prop => $value ) {
			$this->$prop = $value;
		}
	}

	abstract public function convertToOptionValue( );

	static public function createFromSerializedData( $data ) {
		throw new Exception( 'Not implemented' );
	}

	public function jsonSerialize() {
		return get_object_vars( $this );
	}
}