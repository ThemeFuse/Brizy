<?php

class Brizy_Editor_Helper_DomTag {

	/**
	 * @var string
	 */
	private $html_tag;

	/**
	 * Brizy_DOM_Tag constructor.
	 *
	 * @param string $tag
	 */
	public function __construct( $tag ) {
		$this->html_tag = trim( $tag );
	}

	/**
	 * @return string
	 */
	public function get_tag() {
		return $this->html_tag;
	}

	/**
	 * @param $name
	 *
	 * @return null
	 */
	public function get_attr( $name ) {
		preg_match( "/$name\s*=\s*\"([^\"]*)\"/i", $this->get_tag(), $res );

		if ( isset( $res[1] ) ) {
			return $res[1];
		}

		return null;
	}

	/**
	 * @return array
	 */
	public function get_attrs() {
		$res = array();
		preg_match_all( "/(\S+)=(?:\"(.[^\"]*)\")/", $this->get_tag(), $res );

		$l = count( $res[0] );

		$attrs = array();

		for ( $i = 0; $i < $l; $i ++ ) {
			$attrs[ $res[1][ $i ] ] = $res[2][ $i ];
		}

		return $attrs;
	}

	/**
	 * @return string
	 */
	public function get_content() {

		$res = preg_match( "/\/>$/i", $this->get_tag() );

		if ( $res === 1 ) {
			return '';
		}

		$html  = $this->get_tag();
		$start = strpos( $html, ">" )+1;
		$end   = strrpos( $html, "<" );

		return  substr($html,$start,$end-$start);
	}

	/**
	 * @param $pattern
	 *
	 * @return Brizy_Editor_Helper_DomTag[]
	 */
	public function get_tags( $pattern ) {
		$tags = array();

		preg_match_all( $pattern, $this->get_tag(), $matches );

		foreach ( $matches[0] as $value ) {
			$tags[] = new Brizy_Editor_Helper_DomTag( $value );
		}

		return $tags;
	}

	/**
	 * @return Brizy_Editor_Helper_DomTag[]
	 */
	public function get_links() {

		return $this->get_tags( '/(<link[^>]+>)/is' );
	}


	/**
	 * @param $rel_value
	 *
	 * @return Brizy_Editor_Helper_DomTag[]
	 */
	public function get_links_by_rel( $rel_value ) {

		return $this->get_tags( "/(<link\s+(?=[^>]*rel=\"{$rel_value}\").[^>]*>)/is" );
	}


	/**
	 * @return Brizy_Editor_Helper_DomTag[]
	 */
	public function get_scripts() {
		return $this->get_tags( '/(<script(.*?)<\/script>)/is' );
	}

	/**
	 * @return Brizy_Editor_Helper_DomTag[]
	 */
	public function get_styles() {
		return $this->get_tags( '/(<style(.*?)<\/style>)/is' );
	}


}
