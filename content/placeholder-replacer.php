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
	 */
	public function __construct( $context,   $placeholderProvider ) {
		$this->placeholderProvider  = $placeholderProvider;
	}

	/**
	 * @param $placeholders
	 * @param $content
	 * @param $context
	 *
	 * @return string|string[]
	 */
	public function getContent( $placeholders, $content, $context= null) {

		$toReplace           = array();
		$toReplaceWithValues = array();

		if(!$context)
		{
			$context = Brizy_Content_ContextFactory::createEmptyContext();
		}

		if ( $placeholders ) {
			foreach ( $placeholders as $contentPlaceholder ) {
				try {
					$placeholder = $this->placeholderProvider->getPlaceholder( $contentPlaceholder->getName() );
					if ( $placeholder ) {
                        $toReplace[] = $contentPlaceholder->getUid();
						$toReplaceWithValues[] = $placeholder->getValue( $context , $contentPlaceholder );
					} else {
                        $toReplace[] = $contentPlaceholder->getPlaceholder();
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
