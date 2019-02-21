<?php


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
	 * @param $placeholders
	 * @param $content
	 *
	 * @return mixed
	 */
	public function getContent( $placeholders = null, $content = null ) {

		$toReplace           = array();
		$toReplaceWithValues = array();

		if ( $placeholders ) {
			foreach ( $placeholders as $contentPlaceholder ) {
				try {
					$placeholder = $this->placeholderProvider->getPlaceholder( $contentPlaceholder->getName() );
					$toReplace[] = $contentPlaceholder->getUid();

					if ( $placeholder ) {
						$toReplaceWithValues[] = $placeholder->getValue( $this->context, $contentPlaceholder );
					} else {
						$toReplaceWithValues[] = '';
					}

				} catch ( Exception $e ) {
					continue;
				}
			}
		}

		$content = str_replace( $toReplace, $toReplaceWithValues, $content );

		return $content;
	}

}