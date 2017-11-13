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
	 * @return string
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public function get_attr( $name ) {
		preg_match( "/$name\s*=\s*\"([^\"]*)\"/i", $this->get_tag(), $res );

		if ( isset( $res[1] ) ) {
			return $res[1];
		}

		return null;
	}

	public function get_attrs()
	{
		$res = array();
		preg_match_all( "/(\S+)=(?:\"(.[^\"]*)\")/", $this->get_tag(), $res );

		$l = count($res[0]);

		$attrs = array();

		for($i=0;$i<$l;$i++)
		{
			$attrs[ $res[1][$i] ] = $res[2][$i];
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

		$content = $this->get_tag();
		preg_match( "/^<[^>]+>(.*)<\/[^>]+>$/is", $content, $res );

		if ( isset( $res[1] ) ) {

			return $res[1];
		}

		return null;
	}

	/**
	 * @return $this
	 */
	public function strip_regions( ) {
		$string = $this->get_tag();

		$string = preg_replace( "/(<\!--\s*Enqueue\s+Start\s*-->(?:(?:(?!<\!--Enqueue\s+End-->).)*)<\!--\s*Enqueue\s+End\s*-->)/is",'', $string );

		$this->html_tag = $string;

		return $this;
	}

	public function fix_shortcode_attributes()
	{
		if($string = preg_replace( "/\&quot;/",'"', $this->html_tag ))
		{
			$this->html_tag = $string;
		}

		return $this;
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
	 * @return array
	 */
	public function get_links() {

		$regions = $this->get_regions();
		$links   = array();

		if ( is_array( $regions ) ) {
			foreach ( $regions as $region ) {
				/**
				 * @var Brizy_Editor_Helper_DomTag $region ;
				 */
				$region_links = $region->get_tags( '/(<link[^>]+>)/is' );

				$links = array_merge( $links, $region_links );

			}
		}

		return $links;
	}


	/**
	 * @param $rel_value
	 *
	 * @return array
	 */
	public function get_links_by_rel($rel_value) {

		$regions = $this->get_regions();
		$links   = array();

		if ( is_array( $regions ) ) {
			foreach ( $regions as $region ) {
				/**
				 * @var Brizy_Editor_Helper_DomTag $region ;
				 */
				$region_links = $region->get_tags( "/(<link\s+(?=[^>]*rel=\"{$rel_value}\").[^>]*>)/is" );

				$links = array_merge( $links, $region_links );

			}
		}

		return $links;
	}



	/**
	 * @return array
	 */
	public function get_scripts() {

		$regions = $this->get_regions();

		$scripts = array();

		if ( is_array( $regions ) ) {
			foreach ( $regions as $region ) {
				/**
				 * @var Brizy_Editor_Helper_DomTag $region ;
				 */
				$region_scripts = $region->get_tags( '/(<script(.*?)<\/script>)/is' );

				$scripts = array_merge( $scripts, $region_scripts );

			}
		}

		return $scripts;

	}

	public function get_styles() {
		$regions = $this->get_regions();
		$styles  = array();

		if ( is_array( $regions ) ) {
			foreach ( $regions as $region ) {
				/**
				 * @var Brizy_Editor_Helper_DomTag $region ;
				 */
				$region_styles = $region->get_tags( '/(<style(.*?)<\/style>)/is' );

				$styles = array_merge( $styles, $region_styles );

			}
		}

		return $styles;
	}


	public function get_regions() {
		$matches = array();
		preg_match_all( "/(<\!--\s*Enqueue\s+Start\s*-->(?:(?:(?!<\!--Enqueue\s+End-->).)*)<\!--\s*Enqueue\s+End\s*-->)/is", $this->get_tag(), $matches );
		$regions = array();

		if ( isset( $matches[1] ) && is_array( $matches[1] ) ) {
			foreach ( $matches[1] as $value ) {
				$regions[] = new Brizy_Editor_Helper_DomTag( $value );
			}
		}

		return $regions;
	}
}