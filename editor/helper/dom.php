<?php

class Brizy_Editor_Helper_Dom extends Brizy_Editor_Helper_DomTag {


	/**
	 * @return Brizy_Editor_Helper_DomTag
	 */
	public function get_head() {
		$headPos    = strpos( $this->get_html(), "<head" );
		$headEndPos = strpos( $this->get_html(), "</head>" );
		$headString = substr( $this->get_html(), $headPos, $headEndPos - $headPos + 7 );

		return new Brizy_Editor_Helper_DomTag( $headString );
	}

	/**
	 * @return $this|Brizy_Editor_Helper_DomTag
	 */
	public function get_body() {

		$bodyPos    = strpos( $this->get_html(), "<body" );
		$bodyEndPos = strpos( $this->get_html(), "</body>" );
		$bodyString = substr( $this->get_html(), $bodyPos, $bodyEndPos - $bodyPos + 7 );

		return new Brizy_Editor_Helper_DomTag( $bodyString );
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
