<?php

class Brizy_Admin_Post_BrizyPostsMonitor extends Brizy_Admin_Post_AbstractMonitor {

	/**
	 * Brizy_Admin_Post_BrizyPostsMonitor constructor.
	 */
	public function __construct() {
		parent::__construct( null, array(
			'brizy',
			'brizy-post-compiler-version',
			'brizy-post-editor-version',
			'brizy_post_uid',
			'brizy-rules',
			'brizy_data_version'
		) );
	}

	/**
	 * @param $postId
	 * @param $postType
	 *
	 * @return bool|mixed
	 */
	public function shouldStoreMetaRevision( $postId, $postType ) {
		return $this->isUsingBrizy( $postId );
	}

	/**
	 * @param $postId
	 *
	 * @return bool
	 */
	protected function isUsingBrizy( $postId ) {
		$get_post_meta = get_post_meta( $postId, Brizy_Editor_Storage_Post::META_KEY, true );
		return ! ! $get_post_meta;
	}
}