<?php defined( 'ABSPATH' ) or die();

class Brizy_Admin_PanelPostContent {

	public static function _init() {
		static $instance;

		if ( ! $instance ) {
			$instance = new self();
		}

		return $instance;
	}

	protected function __construct() {
		add_filter( 'wp_insert_post_data',           [ $this, 'wp_insert_post_data' ], 10, 2 );
		add_action( 'rest_request_before_callbacks', [ $this, 'rest_request_before_callbacks' ] );
		add_filter( 'content_edit_pre',              [ $this, 'fixContentForPastBrizyPosts' ], 10, 2 );
	}

	public function wp_insert_post_data( $data, $postarr ) {

		$post_id = $postarr['ID'];

		if ( wp_doing_ajax() ) {
			return $data;
		}

		try {

			$postEditor = Brizy_Editor_Post::get( $post_id );

			if ( ! $postEditor->uses_editor() ) {
				return $data;
			}

			$data['post_content'] = $postEditor->get_compiled_page()->get_body();

			return $data;

		} catch ( Exception $e ) {
			return $data;
		}
	}

	public function rest_request_before_callbacks( $response ){

		$postsTypes = Brizy_Editor::get()->supported_post_types();

		foreach( $postsTypes as $postType ) {
			add_action( "rest_prepare_{$postType}", [ $this, 'reset_prepare_post' ] );
		}

		return $response;
	}

	public function reset_prepare_post( $response ) {

		global $post;

		if ( ! isset( $response->data['content']['raw'] ) ) {
			return $response;
		}

		try {
			$editorPost = Brizy_Editor_Post::get( $post->ID );

			if ( ! $editorPost->uses_editor() ) {
				return $response;
			}

			$response->data['content']['raw'] = apply_filters( 'brizy_content', $editorPost->get_compiled_page()->get_body(), Brizy_Editor_Project::get(), $editorPost->getWpPost() );

		} catch ( Exception $e ) {
			return $response;
		}

		return $response;
	}

	/**
	 * @param $content
	 *
	 * @param $postId
	 *
	 * @return null|string|string[]
	 * @throws Exception
	 */
	public function fixContentForPastBrizyPosts( $content, $postId ) {

		$post = get_post( $postId );

		// do not fix anything for popups/blocksand templates
		if ( in_array( $post->post_type, [
			Brizy_Admin_Templates::CP_TEMPLATE,
			Brizy_Admin_Blocks_Main::CP_GLOBAL,
			Brizy_Admin_Blocks_Main::CP_SAVED,
			Brizy_Admin_Popups_Main::CP_POPUP
		] ) ) {
			return $content;
		}

		try {
			$editorPost = Brizy_Editor_Post::get( $postId );

			if ( ! $editorPost->uses_editor() ) {
				return $content;
			}

			return apply_filters( 'brizy_content', $editorPost->get_compiled_page()->get_body(), Brizy_Editor_Project::get(), $editorPost->getWpPost() );

		} catch ( Exception $e ) {
			return $content;
		}
	}
}
