<?php

use BrizyPlaceholders\ContentPlaceholder;
use BrizyPlaceholders\ContextInterface;

class Brizy_Content_Placeholders_GlobalBlock extends Brizy_Content_Placeholders_Abstract {
	static $cache = [];


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
		$inLoop = $context->searchParentPlaceholderByName( 'brizy_dc_post_loop' ) || $context->searchParentPlaceholderByName( 'editor_product_upsells' ) || $context->searchParentPlaceholderByName( 'menu_loop' );
		$uid    = $placeholder->getAttribute( 'uid' );
		if ( ! $uid ) {
			return '';
		}
		$content = '';
		if ( isset( self::$cache[ $uid ] ) ) {
			if ( ! $inLoop ) {
				$content = self::$cache[ $uid ];
				//return ''; // return empty because this block has be shown once.
			} else {
				$content = self::$cache[ $uid ];
			}
		} else {
			$blockManager = new Brizy_Admin_Blocks_Manager( Brizy_Admin_Blocks_Main::CP_GLOBAL );
			$block        = $blockManager->getEntity( $uid );
			if ( ! $block ) {
				return '';
			}
			$content = self::$cache[ $uid ] = $this->returnBlockContent( $block );
		}

		return apply_filters( 'brizy_content', $content, Brizy_Editor_Project::get(), $context->getWpPost() );
	}


	/**
	 * @param Brizy_Editor_Block $block
	 *
	 * @return string
	 */
	private function returnBlockContent( $block ) {
		try {
			$compiler = new Brizy_Editor_Compiler( Brizy_Editor_Project::get(), new Brizy_Admin_Blocks_Manager( Brizy_Admin_Blocks_Main::CP_GLOBAL ), new Brizy_Editor_UrlBuilder( Brizy_Editor_Project::get(), $block ), Brizy_Config::getCompilerUrls(), Brizy_Config::getCompilerDownloadUrl() );
			if ( $compiler->needsCompile( $block ) ) {
				$editorConfig = Brizy_Editor_Editor_Editor::get( Brizy_Editor_Project::get(), $block )->config( Brizy_Editor_Editor_Editor::COMPILE_CONTEXT );
				$compiler->compilePost( $block, $editorConfig );
			}

		} catch ( Exception $e ) {
			Brizy_Logger::instance()->exception( $e );
		}
		/**
		 * @var
		 */
		$sectionSet = $block->getCompiledSectionManager();
		$html    = $sectionSet->buildHtml();
		$content = <<<HTML
		\n<!-- GLOBAL BLOCK [{$block->getWpPostId()}]-->
		{$html}
		<!-- END GLOBAL BLOCK [{$block->getWpPostId()}]-->
		\n
HTML;

		return $content;
	}
}