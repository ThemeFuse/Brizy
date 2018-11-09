<?php

/**
 * Compatibility with WPML
 */
class Brizy_Compatibilities_WPML {

	public function __construct() {
		add_action( 'wp_insert_post', array( $this, 'insertNewPost' ), -10000, 3 );
		add_action( 'wp_insert_post', array( $this, 'duplicatePosts' ), -10000, 3 );
	}

	/**
	 * This will duplicate the brizy data for bulk duplicate
	 *
	 * @param $postId
	 * @param $post
	 *
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public function duplicatePosts($postId,$post) {
		global $wpml_post_translations;
		$postType = $post->post_type;

		if(isset($_POST['langs']) && isset($_POST['langs']) ) {
			if ( $wpml_post_translations && is_post_type_translated( $postType ) ) {
				$currentBrizyPost = Brizy_Editor_Post::get( (int) $postId );
				$originalBrizyPost = Brizy_Editor_Post::get( (int) $_POST['post_id'] );
				if ( $originalBrizyPost->uses_editor() && ! $currentBrizyPost->uses_editor() ) {
					// copy data from original
					$data = $originalBrizyPost->storage();
					$storage = $data->get('brizy-post');
					$currentBrizyPost->loadStorageData( $storage );
					$currentBrizyPost->save();
				}
			}
		}

	}

	/**
	 * This will duplicate the brizy post data when the plus sign is clicked
	 *
	 * @param $postId
	 * @param $post
	 *
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public function insertNewPost($postId,$post) {
		global $wpml_post_translations;
		$postType = $post->post_type;

		if(isset($_REQUEST['trid']) && isset($_REQUEST['lang']) && isset($_REQUEST['source_lang'])) {
			if ( $wpml_post_translations && is_post_type_translated( $postType ) ) {
				$originalTranslation = $wpml_post_translations->get_element_id($_REQUEST['source_lang'], $_REQUEST['trid']);
				$currentBrizyPost = Brizy_Editor_Post::get( (int) $postId );
				$originalBrizyPost = Brizy_Editor_Post::get( (int) $originalTranslation );
				if ( $originalTranslation && $originalBrizyPost->uses_editor() && ! $currentBrizyPost->uses_editor() ) {
					// copy data from original
					$data = $originalBrizyPost->storage();
					$storage = $data->get('brizy-post');
					$currentBrizyPost->loadStorageData( $storage );
					$currentBrizyPost->save();
				}
			}
		}
	}
}