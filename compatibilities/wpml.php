<?php

/**
 * Compatibility with WPML
 */
class Brizy_Compatibilities_WPML {

	public function __construct() {
		add_action( 'wp_insert_post',                    [ $this, 'insertNewPost' ], - 10000, 3 );
		add_action( 'wp_insert_post',                    [ $this, 'duplicatePosts' ], - 10000, 3 );
		add_action( 'pre_get_posts',                     [ $this, 'pre_get_posts' ], 11 );
		add_action( 'wp_ajax_wpml-ls-save-settings',     [ $this, 'save_settings' ] );
		add_action( 'wp_ajax_icl_msync_confirm',         [ $this, 'syncMenus' ] );
		add_action( 'brizy_create_editor_config_before', [ $this, 'rmMenusDuplicate' ] );
		add_filter( 'brizy_content',                     [ $this, 'brizyContent' ] );
	}

	/**
	 * This will duplicate the brizy data for bulk duplicate
	 *
	 * @param $postId
	 * @param $post
	 *
	 */
	public function duplicatePosts( $postId, $post ) {
		global $wpml_post_translations;
		$postType = $post->post_type;

		if ( isset( $_POST['langs'] ) ) {
			if ( $wpml_post_translations && is_post_type_translated( $postType ) ) {
				try {
					$currentBrizyPost = Brizy_Editor_Post::get( (int) $_POST['post_id'] );
					$currentBrizyPost->duplicateTo( (int) $postId );
				} catch ( Exception $e ) {
					return;
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
	public function insertNewPost( $postId, $post ) {
		global $wpml_post_translations;
		$postType = $post->post_type;

		if ( isset( $_REQUEST['trid'] ) && isset( $_REQUEST['lang'] ) && isset( $_REQUEST['source_lang'] ) ) {
			if ( $wpml_post_translations && is_post_type_translated( $postType ) ) {
				$originalTranslation = $wpml_post_translations->get_element_id( $_REQUEST['source_lang'], $_REQUEST['trid'] );
				try {
					$originalBrizyPost   = Brizy_Editor_Post::get( (int) $originalTranslation );
					$originalBrizyPost->duplicateTo( (int) $postId );
				} catch (Exception $e) {}
			}
		}
	}

	/**
	 * @param $query
	 *
	 * @return mixed
	 */
	public function pre_get_posts( $query ) {

		if ( isset( $query->query['post_type'] ) && 'attachment' === $query->query['post_type'] && isset( $query->query['meta_query'] ) ) {
			array_walk_recursive(
				$query->query['meta_query'],
				function ( $value, $key ) use ( $query ) {
					if ( 'brizy-font-weight' === $value ) {
						$query->set( 'suppress_filters', true );
					}
				}
			);
		}

		return $query;
	}

	public function save_settings() {

		parse_str($_POST['settings'], $result);

		if ( ! isset( $result['menus'] ) ) {
			return;
		}

		Brizy_Editor_Post::mark_all_for_compilation();
	}

	/**
	 * On sync menus recompile everything again
	 */
	public function syncMenus() {
		Brizy_Editor_Post::mark_all_for_compilation();
	}

	/**
	 * Remove duplicate menus in the editor
	 */
	public function rmMenusDuplicate() {

		$adjustIdUrlCopy = isset( $GLOBALS['icl_adjust_id_url_filter_off'] ) ? $GLOBALS['icl_adjust_id_url_filter_off'] : null;

		$GLOBALS['icl_adjust_id_url_filter_off'] = true;

		add_action( 'brizy_create_editor_config_after', function() use ( $adjustIdUrlCopy ) {
			$GLOBALS['icl_adjust_id_url_filter_off'] = $adjustIdUrlCopy;
		} );
	}

	/**
	 * Fix the url of the switcher languages in the menu when we have in the url ?preview_id=postId
	 *
	 * @param string $content
	 *
	 * @return string
	 */
	public function brizyContent( $content ) {

		if ( ! is_preview() ) {
			return $content;
		}

		add_action( 'wpml_should_filter_preview_lang', '__return_false' );

		return $content;
	}
}