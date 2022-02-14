<?php

class Brizy_Editor_Filters_Api extends Brizy_Admin_AbstractApi {

	const nonce = 'brizy-api';
	const AJAX_FILTER_PLACEHOLDERS_CONTENT = '_filter_placeholders_content';

	protected function initializeApiActions() {
		if ( ! Brizy_Editor_User::is_user_allowed() ) {
			return;
		}
		$this->addAjaxAction( self::AJAX_FILTER_PLACEHOLDERS_CONTENT, array( $this, 'filterPlaceholdersContent' ) );
	}

	protected function getRequestNonce() {
		return $this->param( 'hash' );
	}

	public function filterPlaceholdersContent() {
		$this->verifyNonce(self::nonce);

		if(empty($postId = $this->param('post_id'))) {
			$this->error(400, 'Please provide the post id');
		}

		if(empty($postLoopId = $this->param('post_loop_id'))) {
			$this->error(400, 'Please provide the post loop id');
		}

		if(empty($placeholders = $this->param('placeholders'))) {
			$this->error(400, 'Please provide the placeholders param');
		}

		$brizyPost = Brizy_Editor_Post::get($postId);
		$postContent = $this->getBrizyPostContent(Brizy_Editor_Project::get(), $brizyPost);

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

		return apply_filters(
			'brizy_content',
			$content,
			$project,
			$post->getWpPost(),
			'body'
		);
	}
}
