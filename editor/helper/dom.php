<?php

class Brizy_Editor_Helper_Dom extends Brizy_Editor_Helper_DomTag {

	/**
	 * @return Brizy_Editor_Helper_DomTag
	 */
	public function get_head() {
		$tags = $this->get_tags( "/(<head.*<\/head>)/is" );

		if ( empty( $tags ) ) {
			return new Brizy_Editor_Helper_DomTag('');
		}

		return $tags[0];
	}

	/**
	 * @return $this|Brizy_Editor_Helper_DomTag
	 */
	public function get_body() {
		$tags = $this->get_tags( "/(<body.*<\/body>)/is" );

		if ( empty( $tags ) ) {
			return new Brizy_Editor_Helper_DomTag('');
		}

		return $tags[0];
	}


	/**
	 * Return the tag html
	 *
	 * @return string
	 */
	protected function get_html() {
		return $this->get_tag();
	}

	/**
	 * @todo: Move this somewhere else..
	 *
	 * @param array $tags
	 * @param $attr
	 *
	 * @return array
	 */
	public function get_attributes( $tags, $attr ) {
		$list = array();

		foreach ( $tags as $tag ) {
			$link = trim( $tag->get_attr( $attr ) );

			if ( empty( $link ) ) {
				continue;
			}

			$list[] = $link;
		}

		return $list;
	}

}