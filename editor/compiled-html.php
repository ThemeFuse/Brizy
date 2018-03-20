<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Editor_CompiledHtml {

	/**
	 * @var Brizy_Editor_Helper_Dom
	 */
	private $dom;

	public function __construct( $html ) {

		$this->dom = new Brizy_Editor_Helper_Dom( $html );
	}

	public function strip_regions() {
		$this->dom->strip_regions();

		return $this;
	}

	public function get_content() {
		return $this->strip_regions()->dom->get_content();
	}

	public function get_body($include_parent_tags = false) {

		if($include_parent_tags)
			return $this->dom->get_body()->get_tag();
		else
			return $this->dom->get_body()->get_content();
	}

	public function get_head() {
		return $this->dom->get_head()->get_content();
	}

	public function get_head_scripts() {
		$script_tags = $this->dom->get_head()->get_scripts();

		return $this->dom->get_attributes( $script_tags, 'src' );
	}

	public function get_footer_scripts() {
		$script_tags = $this->dom->get_body()->get_scripts();

		return $this->dom->get_attributes( $script_tags, 'src' );
	}

	public function get_links_tags() {
		$link_tags = $this->dom->get_head()->get_links();

		return $link_tags;
	}

	public function get_inline_styles() {
		$style_tags = $this->dom->get_styles();
		$list       = array();

		if ( is_array( $style_tags ) ) {
			foreach ( $style_tags as $tag ) {

				$content = $tag->get_content();
				$list[]  = $content;
			}
		}

		return $list;
	}

}