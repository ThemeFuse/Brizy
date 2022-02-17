<?php

class Brizy_Editor_Filters_Api extends Brizy_Admin_AbstractApi {

	const nonce = 'brizy-api';
	const AJAX_FILTER_PLACEHOLDERS_CONTENT = '_filter_placeholders_content';

	protected function initializeApiActions() {
		$this->addNoPrivAjaxAction( self::AJAX_FILTER_PLACEHOLDERS_CONTENT, array( $this, 'filterPlaceholdersContent' ) );
		$this->addAjaxAction( self::AJAX_FILTER_PLACEHOLDERS_CONTENT, array( $this, 'filterPlaceholdersContent' ) );
	}

	protected function getRequestNonce() {
		return $this->param( 'hash' );
	}

	public function filterPlaceholdersContent() {

		if(empty($postId = $this->param('post_id'))) {
			$this->error(400, 'Please provide the post id');
		}

		if(empty($placeholders = $this->param('placeholders'))) {
			$this->error(400, 'Please provide the placeholders param');
		}

		$placeholderContents = [];
		$brizyPost = Brizy_Editor_Post::get($postId);
		$postContent = $this->getBrizyPostContent(Brizy_Editor_Project::get(), $brizyPost);

		$placeholderProvider = new Brizy_Content_PlaceholderProvider();
		$context = new Brizy_Content_Context(Brizy_Editor_Project::get(),$brizyPost,$brizyPost->getWpPost(),'');
		$context->setProvider( $placeholderProvider );
		$extractor           = new \BrizyPlaceholders\Extractor( $placeholderProvider );

		/**
		 * @var \BrizyPlaceholders\ContentPlaceholder[] $contentPlaceholders;
		 */
		list( $contentPlaceholders, $placeholderInstances, $newPostContent ) = $extractor->extract( $postContent );
		$context->setPlaceholders($contentPlaceholders);

		foreach( $placeholders as $placeholderId) {
			/**
			 * @var \BrizyPlaceholders\ContentPlaceholder $placeholder;
			 */
			$placeholder = $context->getPlaceholderById($placeholderId);

			if(!$placeholder) continue;

			/**
			 * @var Brizy_Content_Placeholders_Abstract $placeholderInstance;
			 */
			$placeholderInstance = $placeholderProvider->getPlaceholderSupportingName($placeholder->getName());
			$placeholderContents[$placeholderId] = $placeholderInstance->getValue($context,$placeholder);
		}


		$this->success(['placeholders'=>$placeholderContents]);
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
