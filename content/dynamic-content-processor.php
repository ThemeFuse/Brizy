<?php

use BrizyPlaceholders\Extractor;
use BrizyPlaceholders\Replacer;

class Brizy_Content_DynamicContentProcessor implements Brizy_Editor_Content_ProcessorInterface {

	/**
	 * @param string $content
	 * @param Brizy_Content_Context $context
	 *
	 * @return mixed
	 */
	public function process( $content, Brizy_Content_Context $context ) {

		$placeholderProvider = new Brizy_Content_PlaceholderProvider( $context );
		$extractor           = new Extractor( $placeholderProvider );

		$context->setProvider( $placeholderProvider );

		list( $contentPlaceholders, $placeholderInstances, $content ) = $extractor->extract( $content );

		$replacer = new Replacer( $placeholderProvider );

		$content = $replacer->replaceWithExtractedData( $contentPlaceholders, $placeholderInstances, $content, $context );

		// try to see if there are still placeholders that were not replaces
		list( $contentPlaceholders, $placeholderInstances, $content2 ) = $extractor->extract( $content );
		$level = (int)$context->getLevel();
		if ( count( $placeholderInstances ) !== 0 && $level < 5 ) {
			$context->setLevel( $level + 1 );
			$content = $this->process( $content, $context );
		}

		return $content;
	}
}
