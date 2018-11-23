<?php

class Brizy_Content_Placeholders_Simple extends Brizy_Content_Placeholders_Abstract {

	/**
	 * @return string|callable
	 */
	protected $value;

	/**
	 * Brizy_Content_Placeholders_Simple constructor.
	 *
	 * @param $label
	 * @param $placeholder
	 * @param $value
	 * @param string $display
	 */
	public function __construct( $label, $placeholder, $value, $display = Brizy_Content_Placeholders_Abstract::DISPLAY_INLINE ) {
		$this->setLabel( $label );
		$this->setPlaceholder( $placeholder );
		$this->setDisplay( $display );

		$this->value = $value;
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