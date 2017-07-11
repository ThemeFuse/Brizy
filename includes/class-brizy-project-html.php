<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Project_Html {
	private $html;
	private $dom;

	public function __construct( $html ) {
		$this->html = $html;
	}

	public function get_html() {
		return $this->html;
	}

	public function get_content() {
		return $this->dom()->get_body()->strip_tags( array( 'script' ) )->get_content();
	}

	public function get_scripts() {
		return $this->dom()->get_attributes( $this->dom()->get_tags( '/(<script(.*?)<\/script>)/is' ), 'src' );
	}

	public function get_links() {
		return $this->dom()->get_attributes( $this->dom()->get_tags( '/(<link[^>]+>)/is' ), 'href' );
	}

	public function get_styles() {
		$tags = $this->dom()->get_tags( '/(<style(.*?)<\/style>)/is' );
		$list = array();

		foreach ( $tags as $tag ) {
			$list[] = $tag->get_content();
		}

		return $list;
	}

	private function dom() {
		return $this->dom ? $this->dom : new Brizy_DOM( $this->get_html() );
	}
}