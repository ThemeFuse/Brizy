<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 8/21/18
 * Time: 4:37 PM
 */

class Brizy_Content_PlaceholderExtractor {

	/**
	 * @var Brizy_Content_Context
	 */
	private $context;


	/**
	 * BrizyPro_Content_PlaceholderExtractor constructor.
	 *
	 * @param Brizy_Content_Context $context
	 */
	public function __construct( $context ) {
		$this->context = $context;
	}

	/**
	 * @return string
	 */
	public function getContent() {
		return $this->content;
	}

	/**
	 * @return array
	 */
	public function extract() {

		$placeholders = array();
		$expression   = "/(?<placeholder>{{\s*(?<placeholderName>.+?)(?<attributes>(?:\s+)((?:\w+='(?:.[^']*|)'\s*)*))?}}(?:(?<content>.*?){{\s*end_(\g{placeholderName})\s*}})?)/ims";

		$matches = array();

		preg_match_all( $expression, $this->context->getContent(), $matches );

		if ( count( $matches['placeholder'] ) == 0 ) {
			return $placeholders;
		}

		foreach ( $matches['placeholder'] as $i => $name ) {
			$placeholders[] = $placeholder = new Brizy_Content_ContentPlaceholder(
				$matches['placeholderName'][ $i ],
				$matches['placeholder'][ $i ],
				$this->getPlaceholderAttributes( $matches['attributes'][ $i ] ),
				$matches['content'][ $i ]
			);

			//$content = str_replace( $placeholder->getPlaceholder(), $placeholder->getUid(), $this->context->getContent(), 1 );
			$content = $this->context->getContent();
			$pos = strpos($content, $placeholder->getPlaceholder());
			if ($pos !== false) {
				$content = substr_replace($content, $placeholder->getUid(), $pos, strlen($placeholder->getPlaceholder()));
			}

			$this->context->setContent( $content );
		}

		return $placeholders;
	}

	/**
	 * Split the attributs from attribute string
	 *
	 * @param $attributeString
	 *
	 * @return array
	 */
	private function getPlaceholderAttributes( $attributeString ) {
		$attrString  = trim( $attributeString );
		$attrMatches = array();
		$attributes  = array();
		preg_match_all( "/(\w+)='([^']*)'/mi", $attrString, $attrMatches );

		if ( isset( $attrMatches[0] ) && is_array( $attrMatches[0] ) ) {
			foreach ( $attrMatches[1] as $i => $name ) {
				$attributes[ $name ] = $attrMatches[2][ $i ];
			}
		}

		return $attributes;
	}

}