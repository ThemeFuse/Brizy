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

		$this->render_for_current_user( $response, $post );

		return $response;
	}

	/**
	 * The stored post_content may contain content resolved for another user (pages saved before the fix),
	 * so content.rendered and excerpt.rendered are rebuilt from the compiled html for the requesting user,
	 * the same way the page is rendered on the frontend.
	 *
	 * @param WP_REST_Response $response
	 * @param WP_Post $post
	 */
	private function render_for_current_user( $response, $post ) {

		$hasContent = isset( $response->data['content']['rendered'] );
		$hasExcerpt = isset( $response->data['excerpt']['rendered'] );

		if ( ! $hasContent && ! $hasExcerpt ) {
			return;
		}

		// WordPress already emptied the fields when the password is required and was not provided.
		// The REST password override is removed before this filter runs, so read the response state first.
		$locked = $hasContent
			? ! empty( $response->data['content']['protected'] ) && '' === $response->data['content']['rendered']
			: post_password_required( $post );

		if ( $locked ) {
			return;
		}

		try {
			$html = Brizy_Editor_Post::get( $post )->getCompiledHtml();
			$html = $html ? apply_filters( 'brizy_content', $html, Brizy_Editor_Project::get(), $post, 'body' ) : '';
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->exception( $e );
			// fail closed: never fall back to the stored copy
			$html = '';
		}

		if ( $hasContent ) {
			$response->data['content']['rendered'] = $html;
		}

		if ( $hasExcerpt && '' === trim( $post->post_excerpt ) ) {
			$excerptLength = (int) apply_filters( 'excerpt_length', 55 );
			$excerptMore   = apply_filters( 'excerpt_more', ' [&hellip;]' );
			$excerpt       = wp_trim_words( wp_strip_all_tags( $html ), $excerptLength, $excerptMore );

			$response->data['excerpt']['rendered'] = wpautop( $excerpt );
		}
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