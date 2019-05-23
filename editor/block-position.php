<?php

class Brizy_Editor_BlockPosition extends Brizy_Admin_Serializable {

	/**
	 * @var string
	 */
	protected $align;

	/**
	 * @var int
	 */
	protected $index;

	/**
	 * Brizy_Editor_BlockPosition constructor.
	 *
	 * @param string $align
	 * @param int $index
	 */
	public function __construct( $align, $index ) {
		$this->align = $align;
		$this->index = $index;
	}

	/**
	 * @return string
	 */
	public function getAlign() {
		return $this->align;
	}

	/**
	 * @param string $align
	 *
	 * @return Brizy_Editor_BlockPosition
	 */
	public function setAlign( $align ) {
		$this->align = $align;

		return $this;
	}

	/**
	 * @return int
	 */
	public function getIndex() {
		return $this->index;
	}

	/**
	 * @param int $index
	 *
	 * @return Brizy_Editor_BlockPosition
	 */
	public function setIndex( $index ) {
		$this->index = $index;

		return $this;
	}


	/**
	 * @return string
	 */
	public function serialize() {
		$get_object_vars = array(
			'align' => $this->getAlign(),
			'index' => $this->getIndex()
		);

		return serialize( $get_object_vars );
	}

	public function jsonSerialize() {
		$get_object_vars = array(
			'index' => $this->getIndex(),
			'align' => $this->getAlign()
		);

		return $get_object_vars;
	}

	public function convertToOptionValue() {
		$get_object_vars = array(
			'align' => $this->getAlign(),
			'index' => $this->getIndex()
		);

		return $get_object_vars;
	}

	static public function createFromSerializedData( $data ) {
		$instance = new self( $data['align'], $data['index'] );

		return $instance;
	}
}