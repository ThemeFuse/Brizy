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
		add_filter( 'content_edit_pre',              [ $this, 'content_edit_pre' ], 10, 2 );
	}

	public function wp_insert_post_data( $data, $postarr ) {

		// Do not run when the page is updated from editor, only from wp dashboard
		if ( wp_doing_ajax() || $postarr['post_type'] == 'revision' ) {
			return $data;
		}

		$data['post_content'] = $this->get_compiled_html( $postarr['ID'], $data['post_content'], false );

		return $data;
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

		$response->data['content']['raw'] = $this->get_compiled_html( $post->ID, $response->data['content']['raw'] );

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
	public function content_edit_pre( $content, $postId ) {

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

		return $this->get_compiled_html( $postId, $content );
	}

	private function get_compiled_html( $postId, $content, $applyFilters = true ) {

		if ( ! Brizy_Editor_Entity::isBrizyEnabled( $postId ) ) {
			return $content;
		}

		try {
			$editor  = Brizy_Editor_Post::get( $postId );
			$project = Brizy_Editor_Project::get();
		} catch ( Exception $e ) {
			return $content;
		}

		if ( ! $editor->isCompiledWithCurrentVersion() || $editor->get_needs_compile() ) {
			try {
				$editor->compile_page();
				$editor->saveStorage();
				$editor->savePost();
			} catch ( Exception $e ) {}
		}

		$content = $editor->get_compiled_page()->getPageContent();

		return $applyFilters ? apply_filters( 'brizy_content', $content, $project, $editor->getWpPost() ) : $content;
	}
}