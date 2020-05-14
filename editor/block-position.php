<?php

class Brizy_Editor_BlockPosition extends Brizy_Admin_Serializable {

	/**
	 * @var string
	 */
	protected $align;

	/**
	 * @var int
	 */
	protected $top;

	/**
	 * @var int
	 */
	protected $bottom;

	/**
	 * Brizy_Editor_BlockPosition constructor.
	 *
	 * @param null $top
	 * @param null $bottom
	 * @param null $align
	 */
	public function __construct( $top = null, $bottom = null, $align = null ) {
		$this->align  = $align;
		$this->top    = $top;
		$this->bottom = $bottom;
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
	public function getTop() {
		return $this->top;
	}

	/**
	 * @param int $top
	 *
	 * @return Brizy_Editor_BlockPosition
	 */
	public function setTop( $top ) {
		$this->top = (int) $top;

		return $this;
	}

	/**
	 * @return int
	 */
	public function getBottom() {
		return $this->bottom;
	}

	/**
	 * @param int $bottom
	 *
	 * @return Brizy_Editor_BlockPosition
	 */
	public function setBottom( $bottom ) {
		$this->bottom = (int) $bottom;

		return $this;
	}


	/**
	 * @return string
	 */
	public function serialize() {
		$get_object_vars = array(
			'align'  => $this->getAlign(),
			'top'    => $this->getTop(),
			'bottom' => $this->getBottom()
		);

		return serialize( $get_object_vars );
	}

	public function jsonSerialize() {
		$get_object_vars = array(
			'top'    => $this->getTop(),
			'bottom' => $this->getBottom(),
			'align'  => $this->getAlign()
		);

		return $get_object_vars;
	}

	public function convertToOptionValue() {
		$get_object_vars = array(
			'align'  => $this->getAlign(),
			'top'    => $this->getTop(),
			'bottom' => $this->getBottom()
		);

		return $get_object_vars;
	}

	static public function createFromSerializedData( $data ) {
		$instance = new self(
			isset( $data['top'] ) ? $data['top'] : null,
			isset( $data['bottom'] ) ? $data['bottom'] : null,
			isset( $data['align'] ) ? $data['align'] : null
		);

		return $instance;
	}
}