<?php


/**
 * @deprecated
 * 
 * Class Brizy_Content_PlaceholderReplacer
 */
class Brizy_Content_PlaceholderReplacer {

	/**
	 * @var Brizy_Content_Providers_AbstractProvider
	 */
	private $placeholderProvider;


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
	 * @param $context
	 *
	 * @return string|string[]
	 */
	public function getContent( $content) {

		$toReplace           = array();
		$toReplaceWithValues = array();
		list( $placeholders, $acontent ) = $this->placeholderExtractor->extract( $content );

		if(!$this->context)
		{
			$this->context = Brizy_Content_ContextFactory::createEmptyContext();
		}

		// set the placeholders found at this level
		$this->context->setPlaceholders($placeholders);

		if ( $placeholders ) {
			foreach ( $placeholders as $contentPlaceholder ) {
				try {
					$placeholder = $this->placeholderProvider->getPlaceholder( $contentPlaceholder->getName() );
					if ( $placeholder ) {
                        $toReplace[] = $contentPlaceholder->getUid();
						$toReplaceWithValues[] = $placeholder->getValue( $this->context , $contentPlaceholder );
					} else {
                        $toReplace[] = $contentPlaceholder->getPlaceholder();
						$toReplaceWithValues[] = '';
					}

				} catch ( Exception $e ) {

					if (defined('WP_DEBUG') && true === WP_DEBUG) {
						var_dump($e);
					}

					continue;
				}
			}
		}

		$acontent = str_replace( $toReplace, $toReplaceWithValues, $acontent );

		return $acontent;
	}

}
