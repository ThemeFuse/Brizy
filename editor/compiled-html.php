<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Editor_CompiledHtml {

	/**
	 * @var Brizy_Editor_Helper_Dom
	 */
	private $dom;

	/**
	 * Brizy_Editor_CompiledHtml constructor.
	 *
	 * @param $html
	 */
	public function __construct( $html ) {
		$this->dom = new Brizy_Editor_Helper_Dom( $html );
	}

	/**
	 * @return string
	 */
	public function get_body() {
		$body_tag = $this->dom->get_body();
		return $body_tag->get_content();
	}

	/**
	 * @param bool $include_parent_tag
	 *
	 * @return string
	 */
	public function get_head( $include_parent_tag = false ) {
		$head_tag = $this->dom->get_head();
		return $head_tag->get_content();
	}

}
