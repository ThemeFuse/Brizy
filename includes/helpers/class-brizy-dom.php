<?php

class Brizy_DOM extends Brizy_DOM_Tag {
	public function __construct( $html ) {
		parent::__construct( $html );
	}

	/**
	 * @return Brizy_DOM_Tag
	 * @throws Brizy_Exception_Not_Found
	 */
	public function get_body() {
		$tags = $this->get_tags( '/(<body(.*?)<\/body>)/is' );

		if ( empty( $tags ) ) {
			throw new Brizy_Exception_Not_Found( 'Body tag cannot be found' );
		}

		return $tags[0];
	}

	protected function get_html() {
		return $this->get_tag();
	}

	public function get_attributes( array $tags, $attr ) {
		$list = array();

		foreach ( $tags as $tag ) {
			try {
				$link = trim( $tag->get_attr( $attr ) );
				if ( empty( $link ) ) {
					continue;
				}
			} catch ( Brizy_Exception_Not_Found $exception ) {
				continue;
			}

			$list[] = $link;
		}

		return $list;
	}
}