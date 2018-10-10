<?php

class Brizy_Content_Placeholders_Simple extends Brizy_Content_Placeholders_Abstract {

	/**
	 * @return string|callable
	 */
	protected $value;

	/**
	 * Brizy_Editor_Content_GenericPlaceHolder constructor.
	 *
	 * @param string $label
	 * @param string $placeholder
	 * @param string|array $value
	 */
	public function __construct( $label, $placeholder, $value ) {
		$this->label       = $label;
		$this->placeholder = $placeholder;
		$this->value       = $value;
	}

	/**
	 * @param Brizy_Content_ContentPlaceholder $contentPlaceholder
	 * @param Brizy_Content_Context $context
	 *
	 * @return mixed|string
	 */
	public function getValue( Brizy_Content_Context $context, Brizy_Content_ContentPlaceholder $contentPlaceholder ) {

		$method = $this->value;

		if ( is_object( $method ) && ( $method instanceof Closure ) ) {
			return call_user_func( $method, $context, $contentPlaceholder );
		}

		return $this->value;
	}

	/**
	 * @return mixed|string
	 */
	protected function getOptionValue() {

		$method = $this->value;

		if ( is_callable( $method ) ) {
			return $this->getReplacePlaceholder();
		}

		return $this->value;
	}
}