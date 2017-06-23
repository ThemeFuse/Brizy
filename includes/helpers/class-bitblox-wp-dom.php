<?php

class BitBlox_WP_DOM extends BitBlox_WP_DOM_Tag {
	public function __construct( $html ) {
		parent::__construct( $html );
	}

	/**
	 * @return BitBlox_WP_DOM_Tag
	 * @throws BitBlox_WP_Exception_Not_Found
	 */
	public function get_body() {
		$tags = $this->get_tags( '/(<body(.*?)<\/body>)/is' );

		if ( empty( $tags ) ) {
			throw new BitBlox_WP_Exception_Not_Found( 'Body tag cannot be found' );
		}

		return $tags[0];
	}

	public function get_styles() {
		$tags = $this->get_tags( '/(<style(.*?)<\/style>)/is' );
		$list = array();

		foreach ( $tags as $tag ) {
			$list[] = $tag->get_content();
		}

		return $list;
	}

	public function get_scripts() {
		return $this->get_attributes_list( $this->get_tags( '/(<script(.*?)<\/script>)/is' ), 'src' );
	}

	public function get_links() {
		return $this->get_attributes_list( $this->get_tags( '/(<link[^>]+>)/is' ), 'href' );
	}

	protected function get_html() {
		return $this->get_tag();
	}

	private function get_attributes_list( array $tags, $attr ) {
		$list = array();

		foreach ( $tags as $tag ) {
			try {
				$link = trim( $tag->get_attr( $attr ) );
				if ( empty( $link ) ) {
					continue;
				}
			} catch ( BitBlox_WP_Exception_Not_Found $exception ) {
				continue;
			}

			$list[] = $link;
		}

		return $list;
	}
}