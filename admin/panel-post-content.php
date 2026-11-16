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
		add_action( 'rest_request_before_callbacks', [ $this, 'rest_request_before_callbacks' ] );
		add_filter( 'content_edit_pre',              [ $this, 'content_edit_pre' ], 10, 2 );
		// runs before Brizy_Public_Main::insert_page_content and Brizy_Admin_Templates::filterPageContent (-12000)
		add_filter( 'the_content',                   [ $this, 'the_content' ], -12001 );
		// runs before wp_trim_excerpt (10) builds the excerpt from the stored post_content
		add_filter( 'get_the_excerpt',               [ $this, 'get_the_excerpt' ], 9, 2 );
	}

	/**
	 * Search results, archives, feeds and posts loops print the stored post_content of a brizy post,
	 * which may contain content resolved for another user (pages saved before the fix).
	 * Replace it with the compiled html rendered for the current user.
	 *
	 * The post viewed on its own page is rendered by Brizy_Public_Main and is skipped here.
	 *
	 * @param string $content
	 *
	 * @return string
	 */
	public function the_content( $content ) {

		$post = get_post();

		if ( ! $post instanceof WP_Post || ! $this->is_stored_brizy_content( $content, $post ) ) {
			return $content;
		}

		if ( is_singular() && get_queried_object_id() === $post->ID && ! wp_doing_ajax() ) {
			return $content;
		}

		if ( post_password_required( $post ) ) {
			return '';
		}

		return $this->render_for_current_user_safe( $post );
	}

	/**
	 * When the post has no manual excerpt, WordPress builds it from the stored post_content.
	 * Build it from the content rendered for the current user instead.
	 *
	 * @param string $excerpt
	 * @param WP_Post|null $post
	 *
	 * @return string
	 */
	public function get_the_excerpt( $excerpt, $post = null ) {

		$post = get_post( $post );

		if ( '' !== trim( (string) $excerpt ) || ! $post instanceof WP_Post || ! Brizy_Editor_Entity::isBrizyEnabled( $post->ID ) ) {
			return $excerpt;
		}

		if ( post_password_required( $post ) ) {
			return $excerpt;
		}

		try {
			return Brizy_Editor_Post::get( $post )->getExcerptForCurrentUser();
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->exception( $e );

			return '';
		}
	}

	/**
	 * @param WP_Post $post
	 *
	 * @return string
	 */
	private function render_for_current_user_safe( $post ) {
		try {
			return Brizy_Editor_Post::get( $post )->renderCompiledContentForCurrentUser();
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->exception( $e );

			// fail closed: never fall back to the stored copy
			return '';
		}
	}

	/**
	 * Is $content the stored post_content of a brizy post (and not a template or an already rendered content)?
	 * The stored copy ends with a unique version marker added on save.
	 *
	 * @param string $content
	 * @param WP_Post $post
	 *
	 * @return bool
	 */
	private function is_stored_brizy_content( $content, $post ) {

		if ( ! is_string( $content ) || false === strpos( $content, 'brz-root__container' ) ) {
			return false;
		}

		if ( ! Brizy_Editor_Entity::isBrizyEnabled( $post->ID ) ) {
			return false;
		}

		if ( preg_match( '/<!-- version:\d+ -->/', $post->post_content, $marker ) ) {
			return false !== strpos( $content, $marker[0] );
		}

		return trim( $content ) === trim( $post->post_content );
	}

	public function rest_request_before_callbacks( $response ){

		$postsTypes = Brizy_Editor::get()->supported_post_types();

		foreach( $postsTypes as $postType ) {
			add_filter( "rest_prepare_{$postType}", [ $this, 'reset_prepare_post' ], 10, 2 );
		}

		return $response;
	}

	/**
	 * @param WP_REST_Response $response
	 * @param WP_Post $post
	 *
	 * @return WP_REST_Response
	 */
	public function reset_prepare_post( $response, $post ) {

		if ( ! $post instanceof WP_Post || ! Brizy_Editor_Entity::isBrizyEnabled( $post->ID ) ) {
			return $response;
		}

		if ( isset( $response->data['content']['raw'] ) ) {
			$response->data['content']['raw'] = $this->get_compiled_html( $post->ID, $response->data['content']['raw'] );
		}

		// content.rendered and excerpt.rendered are built through the_content and get_the_excerpt,
		// which render the brizy content for the requesting user (see the_content and get_the_excerpt above)

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

	private function get_compiled_html( $postId, $content ) {

		if ( ! Brizy_Editor_Entity::isBrizyEnabled( $postId ) ) {
			return $content;
		}

		try {
			$editor = Brizy_Editor_Post::get( $postId );

			try {
		        $compiler = new Brizy_Editor_Compiler(
			        Brizy_Editor_Project::get(),
			        new Brizy_Admin_Blocks_Manager( Brizy_Admin_Blocks_Main::CP_GLOBAL ),
			        new Brizy_Editor_UrlBuilder( Brizy_Editor_Project::get(), $editor ),
			        Brizy_Config::getCompilerUrls(),
			        Brizy_Config::getCompilerDownloadUrl()
		        );

		        if ( $compiler->needsCompile( $editor ) ) {
			        $editorConfig = Brizy_Editor_Editor_Editor::get( Brizy_Editor_Project::get(), $editor )
			                                                   ->config( Brizy_Editor_Editor_Editor::COMPILE_CONTEXT );
			        $compiler->compilePost( $editor, $editorConfig );
		        }

		        global $wpdb;

				$query = $wpdb->get_col( "SELECT post_content FROM $wpdb->posts WHERE ID = $postId" );

				if ( ! isset( $query[0] ) ) {
					return $content;
				}

				$content = $query[0];

	        } catch ( Exception $e ) {
		        Brizy_Logger::instance()->exception( $e );
	        }

		} catch ( Exception $e ) {
			return $content;
		}

		return $content;
	}
}