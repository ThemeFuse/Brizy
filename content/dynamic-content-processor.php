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

        // load all page placeholders
        $postContent = $this->getBrizyPostContent($context->getProject(), Brizy_Editor_Post::get($context->getWpPost()));
        /**
         * @var \BrizyPlaceholders\ContentPlaceholder[] $contentPlaceholders;
         */
        list( $contentPlaceholders, $placeholderInstances, $newPostContent ) = $extractor->extract( $postContent );
        $context->setPlaceholders($contentPlaceholders);


		list( $contentPlaceholders, $placeholderInstances, $content ) = $extractor->extract( $content );

		$replacer = new Replacer( $placeholderProvider );

		$content = $replacer->replaceWithExtractedData( $contentPlaceholders, $placeholderInstances, $content, $context );

		return $content;
	}


    private function getBrizyPostContent(Brizy_Editor_Project $project,Brizy_Editor_Post $post) {
        $project = Brizy_Editor_Project::get();

        if (!$post->get_compiled_html()) {
            $compiled_html_body = $post->get_compiled_html_body();
            $content = Brizy_SiteUrlReplacer::restoreSiteUrl($compiled_html_body);
            $post->set_needs_compile(true)->saveStorage();
        } else {
            $compiled_page = $post->get_compiled_page();
            $content = $compiled_page->get_body();
        }

        return $content;
    }
}
