<?php

class Brizy_Editor_Dependency extends \Brizy_Admin_Serializable {
	const TYPE_PAGE = 'page';
	const TYPE_SYMBOL = 'symbol';
	const TYPE_GLOBAL_BLOCK = 'global_block';

	private $type;
	private $uid;

	public function __construct( $type, $uid ) {
		$this->type = $type;
		$this->uid  = $uid;
	}

	/**
	 * @return mixed
	 */
	public function getType() {
		return $this->type;
	}

	public function setType( $type ) {

		if ( in_array( $type, [ self::TYPE_PAGE, self::TYPE_SYMBOL, self::TYPE_GLOBAL_BLOCK ] ) ) {
			$this->type = $type;
		} else {
			throw new Exception( 'Invalid dependency type provided' );
		}

		return $this;
	}

	/**
	 * @return mixed
	 */
	public function getUid() {
		return $this->uid;
	}

	/**
	 * @param mixed $uid
	 *
	 * @return Brizy_Editor_Dependency
	 */
	public function setUid( $uid ) {
		$this->uid = $uid;

		return $this;
	}

	public function convertToOptionValue() {
		$item = array(
			'type' => $this->getType(),
			'uid'  => $this->getUid(),
		);

		return $item;
	}

	public function jsonSerialize() {
		return $this->convertToOptionValue();
	}

	static public function createFromSerializedData( $data ) {
		if ( is_null( $data ) ) {
			throw new Exception( 'Invalid parameter provided' );
		}
		if ( ! isset( $data['type'] ) || ! isset( $data['uid'] ) ) {
			throw new Exception( 'Invalid symbol data provided' );
		}

		return new self( $data['type'], $data['uid'] );
	}

}