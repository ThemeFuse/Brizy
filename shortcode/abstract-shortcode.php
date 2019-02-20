<?php


abstract class Brizy_Shortcode_AbstractShortcode {

	const BRIZY_SHORTCODES_PREFIX = 'brizy_';
	const BRIZY_SHORTCODES_ACTION_PREFIX = 'brizy_shortcode_';
	const BRIZY_SHORTCODES_FILTER_PREFIX = 'brizy_shortcode_filter_';

	/**
	 * Get shortcode name
	 *
	 * @return string
	 */
	abstract public function getName();

	/**
	 * @param $atts
	 * @param null $content
	 *
	 * @return mixed
	 */
	abstract public function render( $atts, $content = null );

	/**
	 * @param $atts
	 * @param null $content
	 *
	 * @return string
	 */
	final public function masterRender( $atts, $content = null ) {
		ob_start();

		do_action( $this->getBeforeActionName() );

		echo apply_filters( $this->getFilterName(), $this->render( $atts, $content ) );

		do_action( $this->getAfterActionName() );

		return ob_get_clean();
	}

	/**
	 * Brizy_Shortcode_AbstractShortcode constructor.
	 */
	public function __construct() {
		add_shortcode( $this->getShortCodeId(), array( $this, 'masterRender' ) );
	}

	/**
	 * @return string
	 */
	private function getShortCodeId() {
		return self::BRIZY_SHORTCODES_PREFIX . $this->getName();
	}

	/**
	 * @return string
	 */
	private function getBeforeActionName() {
		return self::BRIZY_SHORTCODES_ACTION_PREFIX . 'before_' . $this->getName();
	}

	/**
	 * @return string
	 */
	private function getAfterActionName() {
		return self::BRIZY_SHORTCODES_ACTION_PREFIX . 'after_' . $this->getName();
	}

	/**
	 * @return string
	 */
	private function getFilterName() {
		return self::BRIZY_SHORTCODES_FILTER_PREFIX . $this->getName();
	}
}