<?php

class Brizy_Content_DynamicContentProcessor implements Brizy_Editor_Content_ProcessorInterface {

	/**
	 * @param string $content
	 * @param Brizy_Content_Context $context
	 *
	 * @return mixed
	 */
	public function process( $content, Brizy_Content_Context $context ) {

		$placeholderProvider = new Brizy_Content_PlaceholderProvider( $context );
		$extractor           = new \BrizyPlaceholders\Extractor( $placeholderProvider );

		$context->setProvider( $placeholderProvider );

		list( $contentPlaceholders, $placeholderInstances, $content ) = $extractor->extract( $content );

		$replacer = new Brizy_Content_PlaceholderReplacer( $context, $placeholderProvider );

		$content = $replacer->getContent( $contentPlaceholders, $content ,$context);

		return $content;
	}
}
