<?php

abstract class Brizy_Content_Placeholders_Abstract extends Brizy_Admin_Serializable {


	const DISPLAY_INLINE = 'inline';
	const DISPLAY_BLOCK = 'block';

	/**
	 * @return string
	 */
	protected $label;

	/**
	 * @return string
	 */
	protected $placeholder;

	/**
	 * @var string
	 */
	protected $display = self::DISPLAY_INLINE;

	/**
	 * @param Brizy_Content_Context $context
	 * @param Brizy_Content_ContentPlaceholder $contentPlaceholder
	 * @param null $display
	 *
	 * @return mixed
	 */
	abstract public function getValue( Brizy_Content_Context $context, Brizy_Content_ContentPlaceholder $contentPlaceholder );

	/**
	 * This must return the option value that will be passed to the editor
	 *
	 *
	 * @return mixed
	 */
	abstract protected function getOptionValue();

	/**
	 * @return mixed
	 */
	public function getLabel() {
		return $this->label;
	}

	/**
	 * @param mixed $label
	 *
	 * @return Brizy_Content_Placeholders_Abstract
	 */
	public function setLabel( $label ) {
		$this->label = $label;

		return $this;
	}

	/**
	 * @return string
	 */
	public function getDisplay() {
		return $this->display;
	}

	/**
	 * @param string $display
	 *
	 * @return Brizy_Content_Placeholders_Abstract
	 */
	public function setDisplay( $display ) {
		$this->display = $display;

		return $this;
	}

	/**
	 * @return mixed
	 */
	public function getPlaceholder() {
		return $this->placeholder;
	}

	/**
	 * @param mixed $placeholder
	 *
	 * @return Brizy_Content_Placeholders_Abstract
	 */
	public function setPlaceholder( $placeholder ) {
		$this->placeholder = $placeholder;

		return $this;
	}

	/**
	 * @return array
	 */
	public function convertToOptionValue() {
		return array(
			'label'       => $this->getLabel(),
			'placeholder' => $this->getPlaceholder(),
			'display'     => $this->getDisplay(),
			'data'        => $this->getOptionValue(),
		);
	}

	public function jsonSerialize() {
		return array(
			'label'       => $this->getLabel(),
			'placeholder' => $this->getReplacePlaceholder(),
			'display'     => $this->getDisplay(),
			'data'        => $this->getOptionValue(),
		);
	}

	/**
	 * @return string
	 */
	public function getReplacePlaceholder() {
		$placeholder = $this->getPlaceholder();

		if ( ! empty( $placeholder ) ) {
			return "{{" . $placeholder . "}}";
		}

		return "";
	}

	/**
	 * @return string
	 */
	public function getData() {
		$value = $this->getValue( null );
		if ( is_callable( $value ) ) {
			return $this->getReplacePlaceholder();
		}

		return $value;
	}
}
