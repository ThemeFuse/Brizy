<?php

use BrizyPlaceholders\ContentPlaceholder;
use BrizyPlaceholders\ContextInterface;

class Brizy_Content_Placeholders_GlobalBlocks extends Brizy_Content_Placeholders_Abstract {

	public function __construct(
		$label, $placeholder, $group = null, $display = Brizy_Content_Placeholders_Abstract::DISPLAY_INLINE, $attrs = []
	) {
		$this->setLabel( $label );
		$this->setPlaceholder( $placeholder );
		$this->setDisplay( $display );
		$this->setGroup( $group );
		$this->setAttributes( $attrs );
	}

	/**
	 * @param ContextInterface $context
	 * @param ContentPlaceholder $placeholder
	 *
	 * @return string
	 * @throws Exception
	 */
	public function getValue( ContextInterface $context, ContentPlaceholder $placeholder ) {
		$position = $placeholder->getAttribute( 'position' ) ?: 'top';

		$template = Brizy_Admin_Templates::getTemplate();
		if ( $template ) {
			$blocks = Brizy_Admin_Blocks_Main::_init()->getMatchingBrizyBlocks( $template->getWpPost() );
		} else {
			$blocks = Brizy_Admin_Blocks_Main::_init()->getMatchingBrizyBlocks( $context->getEntity() );
		}

		$blocks = array_filter( $blocks, function ( Brizy_Editor_Post $block ) use ( $position ) {
			$is_referenced_in_page = Brizy_Admin_Blocks_Main::_init()->isReferencedInPage( $block );

			return $block->getPosition()->getAlign() == $position and ! $is_referenced_in_page;
		} );
		usort( $blocks, function ( $first, $second ) use ( $position ) {
			if ( $position == 'top' ) {
				return $first->getPosition()->getTop() > $second->getPosition()->getTop() ? 1 : - 1;
			} else {
				return $first->getPosition()->getBottom() > $second->getPosition()->getBottom() ? 1 : - 1;
			}
		} );

		return $this->returnBlocksContent( $blocks );
	}

	/**
	 * @param array $blocks
	 *
	 * @return string
	 */
	private function returnBlocksContent( array $blocks ) {

		$content = "";
		foreach ( $blocks as $block ) {
			/**
			 * @var
			 */
			$html    = base64_decode( $block->get_encoded_compiled_html() );
			$content .= <<<HTML
\n<!-- GLOBAL BLOCK [{$block->getWpPostId()}]-->
{$html}
<!-- END GLOBAL BLOCK [{$block->getWpPostId()}]-->
\n
HTML;
		}

		return $content;
	}
}