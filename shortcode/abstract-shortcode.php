<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 1/24/18
 * Time: 5:14 PM
 */

abstract class Brizy_Shortcode_AbstractShortcode {

	const BRIZY_SHORTCODES_PREFIX = 'brizy_';

	/**
	 * Get shortcode name
	 *
	 * @return string
	 */
	abstract public function getName();

	/**
	 * @param $atts
	 *
	 * @return string
	 */
	abstract public function render($atts);

	/**
	 * Brizy_AbstractSidebar constructor.
	 */
	public function __construct() {
		add_shortcode( $this->getShortCodeId(), array( $this, 'render' ) );
	}

	private function getShortCodeId() {
		return self::BRIZY_SHORTCODES_PREFIX.$this->getName();
	}
}