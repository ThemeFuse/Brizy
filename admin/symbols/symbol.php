<?php

class Brizy_Admin_Symbols_Symbol extends Brizy_Admin_Serializable {
	private $uid;

	private $label;

	private $className;

	private $componentTarget;

	private $version = 0;

	private $model;

	public function __construct( $uid = null, $label = null, $model = null, $version = null, $className = null, $componentTarget = null ) {
		$this->setUid( $uid );
		$this->setLabel( $label );
		$this->setModel( $model );
		$this->setVersion( $version );
		$this->setClassName( $className );
		$this->setComponentTarget( $componentTarget );
	}

	/**
	 * @return mixed
	 */
	public function getUid() {
		return $this->uid;
	}

	/**
	 * @param mixed $uid
	 */
	public function setUid( $uid ) {
		$this->uid = $uid;
	}

	/**
	 * @return mixed
	 */
	public function getLabel() {
		return $this->label;
	}

	/**
	 * @param mixed $label
	 */
	public function setLabel( $label ) {
		$this->label = $label;
	}

	/**
	 * @return int
	 */
	public function getVersion() {
		return $this->version;
	}

	/**
	 * @param int $version
	 */
	public function setVersion( $version ) {
		$this->version = $version;
	}

	/**
	 * @return mixed
	 */
	public function getModel() {
		return $this->model;
	}

	/**
	 * @param mixed $model
	 */
	public function setModel( $model ) {
		$this->model = $model;
	}

	/**
	 * @return mixed
	 */
	public function getClassName() {
		return $this->className;
	}

	/**
	 * @param mixed $className
	 */
	public function setClassName( $className ) {
		$this->className = $className;
	}

	/**
	 * @return mixed
	 */
	public function getComponentTarget() {
		return $this->componentTarget;
	}

	/**
	 * @param mixed $componentTarget
	 */
	public function setComponentTarget( $componentTarget ) {
		$this->componentTarget = $componentTarget;
	}


	/**
	 * @param $data
	 *
	 * @return Brizy_Admin_Symbols_Symbol
	 * @throws Exception
	 */
	static public function createFromSerializedData( $data ) {
		if ( is_null( $data ) ) {
			throw new Exception( 'Invalid parameter provided' );
		}

		return new self( isset( $data['uid'] ) ? $data['uid'] : null,
		isset( $data['label'] ) && ! empty( $data['label'] ) ? $data['label'] : null,
		isset( $data['data'] ) && ! empty( $data['data'] ) ? $data['data'] : null,
		isset( $data['version'] ) ? $data['version'] : null,
		isset( $data['className'] ) ? $data['className'] : null,
		isset( $data['componentVersion'] ) ? $data['componentVersion'] : null
		);
	}


	/**
	 * @param $json
	 *
	 * @return Brizy_Admin_Symbols_Symbol
	 * @throws Exception
	 */
	static public function createFromJsonObject( $json ) {
		if ( is_null( $json ) ) {
			throw new Exception( 'Invalid parameter provided' );
		}

		return new self( isset( $json->uid ) ? $json->uid : null,
		isset( $json->label ) ? $json->label : null,
		isset( $json->data ) ? $json->data : null,
		isset( $json->version ) ? $json->version : null ,
		isset( $json->className ) ? $json->className : null,
		isset( $json->componentVersion ) ? $json->componentVersion : null
		);
	}


	/**
	 * @param Brizy_Admin_Symbols_Symbol $patch
	 *
	 * @return void
	 */
	public function patchFrom( $patch ) {
		if ( ! is_null( $patch->getModel() ) && ! empty( $patch->getModel() ) ) {
			$this->setModel( $patch->getModel() );
		}
		if ( ! is_null( $patch->getLabel() ) && ! empty( $patch->getLabel() ) ) {
			$this->setLabel( $patch->getLabel() );
		}
		if ( ! is_null( $patch->getVersion() ) && ! empty( $patch->getVersion() ) ) {
			$this->setVersion( $patch->getVersion() );
		}
		if ( ! is_null( $patch->getClassName() ) && ! empty( $patch->getClassName() ) ) {
			$this->setClassName( $patch->getClassName() );
		}
		if ( ! is_null( $patch->getComponentTarget() ) && ! empty( $patch->getComponentTarget() ) ) {
			$this->setComponentTarget( $patch->getComponentTarget() );
		}
	}

	public function incrementVersion() {
		$this->setVersion( $this->getVersion() + 1 );
	}

	public function convertToOptionValue() {
		return array(
			'uid'     => $this->getUid(),
			'label'   => $this->getLabel(),
			'model'    => $this->getModel(),
			'className'    => $this->getClassName(),
			'componentTarget'    => $this->getComponentTarget(),
			'version' => $this->getVersion(),
		);
	}

	public function jsonSerialize() {
		return $this->convertToOptionValue();
	}
}
