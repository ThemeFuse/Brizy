<?php

use BrizyPlaceholders\Extractor;
use BrizyPlaceholders\Replacer;

class Brizy_Content_ReferencedGlobalBlockProcessor implements Brizy_Editor_Content_ProcessorInterface {
	/**
	 * @param string $content
	 * @param Brizy_Content_Context $context
	 *
	 * @return mixed|string
	 */
	public function process( $content, Brizy_Content_Context $context ) {

		if(is_null($content)) return null;

		$placeholderProvider = new Brizy_Content_Providers_GlobalBlockProvider( $context );
		$extractor           = new Extractor( $placeholderProvider );
		$context->setProvider( $placeholderProvider );
		list( $contentPlaceholders, $placeholderInstances, $acontent ) = $extractor->extract( $content );

		foreach ( $contentPlaceholders as $placeholder ) {
			$attrs        = $placeholder->getAttributes();
			$blockManager = new Brizy_Admin_Blocks_Manager( Brizy_Admin_Blocks_Main::CP_GLOBAL );
			if ( isset( $attrs['uid'] ) ) {
				$block = $blockManager->getEntity( $attrs['uid'] );

				if ( $block ) {
					Brizy_Admin_Blocks_Main::_init()->addReferencedInPage( $block );
				}
			}
		}


		return $content;

	}
}