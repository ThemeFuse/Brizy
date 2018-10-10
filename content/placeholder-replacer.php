<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 8/21/18
 * Time: 4:37 PM
 */

class Brizy_Content_PlaceholderReplacer {

	/**
	 * @var Brizy_Content_Context
	 */
	private $context;

	/**
	 * @var Brizy_Content_Providers_AbstractProvider
	 */
	private $placeholderProvider;

	/**
	 * @var Brizy_Content_PlaceholderExtractor
	 */
	private $placeholderExtractor;

	/**
	 * Brizy_Content_PlaceholderReplacer constructor.
	 *
	 * @param $context
	 * @param $placeholderProvider
	 * @param $extractor
	 */
	public function __construct( $context, $placeholderProvider, $extractor ) {
		$this->context              = $context;
		$this->placeholderProvider  = $placeholderProvider;
		$this->placeholderExtractor = $extractor;
	}

	/**
	 * @return mixed
	 */
	public function getContent() {

		$placeholders        = $this->placeholderExtractor->extract();
		$toReplace           = array();
		$toReplaceWithValues = array();
		foreach ( $placeholders as $contentPlaceholder ) {
			try {
				$placeholder = $this->placeholderProvider->getPlaceholder( $contentPlaceholder->getName() );

				if ( ! $placeholder ) {
					continue;
				}

				$toReplace[]           = $contentPlaceholder->getUid();
				$toReplaceWithValues[] = $placeholder->getValue( $this->context, $contentPlaceholder );
			} catch ( Exception $e ) {
				continue;
			}
		}

		$content = str_replace( $toReplace, $toReplaceWithValues, $this->context->getContent() );

		$this->context->setContent( $content );

		return $this->context->getContent();
	}

}