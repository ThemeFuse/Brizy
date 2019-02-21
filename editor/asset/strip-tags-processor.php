<?php


class Brizy_Editor_Asset_StripTagsProcessor implements Brizy_Editor_Content_ProcessorInterface {


	/**
	 * @var string[]
	 */
	private $tags;

	/**
	 * Brizy_Editor_Asset_StripTagsProcessor constructor.
	 *
	 * @param $tags
	 */
	public function __construct( $tags ) {
		$this->tags = $tags;
	}

	/**
	 * @param string $content
	 * @param Brizy_Content_Context $context
	 *
	 * @return mixed|string
	 */
	public function process( $content, Brizy_Content_Context  $context ) {

		foreach ( $this->tags as $tag ) {
			//$content = $this->strip_tags_content( $content, $tag );
		}

		return $content;
	}


	/**
	 * @param $content
	 * @param string $atag
	 *
	 * @return null|string|string[]
	 */
	private function strip_tags_content( $content, $atag = '' ) {

		preg_match_all( '/<(.+?)[\s]*\/?[\s]*>/si', trim( $atag ), $tags );
		$tags = array_unique( $tags[1] );

		if ( is_array( $tags ) AND count( $tags ) > 0 ) {
			return preg_replace( '@<(' . implode( '|', $tags ) . ')\b.*?>(.*?</\1>)?@si', '', $content );
		}

		return $content;
	}


	/*
	 *
	 // old code
	   preg_match_all( '/<(.+?)[\s]*\/?[\s]*>/si', trim( $tags ), $tags );
		$tags = array_unique( $tags[1] );

		if ( is_array( $tags ) AND count( $tags ) > 0 ) {
			if ( $invert == false ) {
				return preg_replace( '@<(?!(?:' . implode( '|', $tags ) . ')\b)(\w+)\b.*?>(.*?</\1>)?@si', '', $text );
			} else {
				return preg_replace( '@<(' . implode( '|', $tags ) . ')\b.*?>(.*?</\1>)?@si', '', $text );
			}
		} elseif ( $invert == false ) {
			return preg_replace( '@<(\w+)\b.*?>.*?</\1>@si', '', $text );
		}

	 * */
}