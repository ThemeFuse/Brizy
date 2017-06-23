<?php

class BitBlox_WP_DOM_Tag {

	private $tag;

	/**
	 * BitBlox_WP_DOM_Tag constructor.
	 *
	 * @param string $tag
	 */
	public function __construct( $tag ) {
		$this->tag = $tag;
	}

	/**
	 * @return string
	 */
	public function get_tag() {
		return $this->tag;
	}

	/**
	 * @param $name
	 *
	 * @return string
	 * @throws BitBlox_WP_Exception_Not_Found
	 */
	public function get_attr( $name ) {
		preg_match( "/$name=\"([^\"]*)\"/i", $this->get_tag(), $res );

		if ( count( $res ) < 2 ) {
			throw new BitBlox_WP_Exception_Not_Found( "No $name attribute found" );
		}

		return $res[1];
	}

	/**
	 * @return string
	 */
	public function get_content() {
		preg_match( "/\/>$/i", $this->get_tag(), $res );

		if ( $res ) {
			return '';
		}

		preg_match( "/<[^>]+>(.*)<\/[^>]+>$/is", $this->get_tag(), $res );

		return $res[1];
	}

	/**
	 * @param array $tags
	 *
	 * @return $this
	 */
	public function strip_tags( array $tags ) {
		$string = $this->get_tag();
		foreach ( $tags as $tag ) {
			$string = preg_replace( "/<$tag [^>]+>/i", '', $string );
			$string = preg_replace( "/<(\/)?$tag(.|\\s)+<\/$tag>/i", '', $string );
		}

		$this->tag = $string;

		return $this;
	}

	/**
	 * @param $pattern
	 *
	 * @return BitBlox_WP_DOM_Tag[]
	 */
	public function get_tags( $pattern ) {
		$tags = array();

		preg_match_all( $pattern, $this->get_tag(), $matches );
		foreach ( $matches[0] as $value ) {
			$tags[] = new BitBlox_WP_DOM_Tag( $value );
		}

		return $tags;
	}
}