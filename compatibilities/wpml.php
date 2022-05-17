<?php

/**
 * Compatibility with WPML
 */
class Brizy_Compatibilities_WPML {

	public function __construct() {
		add_action( 'init',                              [ $this, 'init' ] );
		add_action( 'wp_insert_post',                    [ $this, 'insertNewPost' ], - 10000, 3 );
		add_action( 'wp_insert_post',                    [ $this, 'duplicatePosts' ], - 10000, 3 );
		add_action( 'pre_get_posts',                     [ $this, 'pre_get_posts' ], 11 );
		add_action( 'wp_ajax_wpml-ls-save-settings',     [ $this, 'save_settings' ] );
		add_action( 'wp_ajax_icl_msync_confirm',         [ $this, 'syncMenus' ] );
		add_action( 'brizy_create_editor_config_before', [ $this, 'rmMenusDuplicate' ] );
		add_filter( 'brizy_content',                     [ $this, 'brizyContent' ] );
		//add_filter( 'wpml_pb_should_body_be_translated', [ $this, 'remove_body' ], PHP_INT_MAX, 2 );
		add_action( 'wpml_pro_translation_completed',    [ $this, 'save_post' ], 10, 3 );
		add_filter( 'wpml_document_view_item_link',      '__return_empty_string' );
		add_filter( 'wpml_document_edit_item_link',      '__return_empty_string' );
		add_action( 'brizy_get_posts_rules_args',        [ $this, 'changeSuppressFilter' ] );
		add_action( 'brizy_get_posts_current_template',  [ $this, 'changeSuppressFilter' ] );
		add_action( 'brizy_get_posts_global_popups',     [ $this, 'changeSuppressFilter' ] );
		add_action( 'brizy_get_posts_saved_popups',      [ $this, 'changeSuppressFilter' ] );
//		add_filter( 'wpml_decode_custom_field',          [ $this, 'decode_custom_field' ], 10, 2 );
//		add_filter( 'wpml_encode_custom_field',          [ $this, 'encode_custom_field' ], 10, 2 );
		add_filter( 'wpml_basket_base64_item',           '__return_false' );
		add_filter( 'icl_job_elements',                  [ $this, 'icl_job_elements' ], 10, 2 );
	}

	public function init() {
		if ( isset( $_GET[ Brizy_Editor::prefix( '-edit' ) ] ) || isset( $_GET[ Brizy_Editor::prefix( '-edit-iframe' ) ] ) ) {
			add_filter( 'wpml_ls_html', '__return_empty_string' );
		}
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

	/**
	 * Remove body from the translation editor because it is generated automatically.
	 *
	 * @param bool $translate Does body need to be translated.
	 * @param WP_Post $post The post we are translating.
	 *
	 * @return bool
	 */
	public function remove_body( $translate, $post ) {

		if ( $this->isUsingEditor( $post->ID ) ) {
			$translate = false;
		}

		return $translate;
	}

	/**
	 * Compile translated brizy pages.
	 *
	 * @param int $post_id The ID of the translated post.
	 */
	public function save_post( $post_id, $fields, $job ) {

		try {
			$originalPost = Brizy_Editor_Post::get( $job->original_doc_id );
		} catch ( Exception $e ) {
			return;
		}

		if ( ! $originalPost->uses_editor() ) {
			return;
		}

		try {
			$translatedPost = Brizy_Editor_Post::get( $post_id );

			if ( ! $translatedPost->uses_editor() ) {
				$originalPost->duplicateTo( $post_id );
			}

		} catch ( Exception $e ) {
			return;
		}

		$translatedPost->set_needs_compile( true );
		$translatedPost->saveStorage();
	}

	public function changeSuppressFilter( $args ) {
		$args['suppress_filters'] = false;

		return $args;
	}

	/**
	 * Decodes editor_data to send for translation.
	 *
	 * @param array  $value The value of the custom field.
	 * @param string $key   The key of the custom field.
	 * @return array
	 */
	public function decode_custom_field( $value, $key ) {
		// We only need to handle this for 'brizy' custom field.
		if ( 'brizy' === $key ) {
			// WPML calls this filter twice, so we need to check if it was already decoded.
			if ( isset( $value['brizy-post']['editor_data'] ) && is_scalar( $value['brizy-post']['editor_data'] ) ) {
				$value['brizy-post']['editor_data'] = json_decode( base64_decode( $value['brizy-post']['editor_data'], true ), true );
			}
		}
		return $value;
	}

	/**
	 * Encode editor_data after its translated.
	 *
	 * @param array  $value The value of the custom field.
	 * @param string $key   The key of the custom field.
	 * @return array
	 */
	public function encode_custom_field( $value, $key ) {
		// We only need to handle this for 'brizy' custom field.
		if ( 'brizy' === $key ) {
			// WPML calls this filter twice, so we need to check if it was already encoded.
			if ( isset( $value['brizy-post']['editor_data'] ) && ! is_scalar( $value['brizy-post']['editor_data'] ) ) {
				$value['brizy-post']['editor_data'] = base64_encode( json_encode( $value['brizy-post']['editor_data'] ) );
			}
		}
		return $value;
	}

	/**
	 * @param array $elements Array of fields to translate.
	 * @param object $postId The ID of the post being translated.
	 *
	 * @return array
	 */
	public function icl_job_elements( $elements, $postId ) {

		if ( ! $this->isUsingEditor( $postId ) ) {
			return $elements;
		}

		$editor = Brizy_Editor_Post::get( $postId );

//		if ( ! $editor->isCompiledWithCurrentVersion() || $editor->get_needs_compile() ) {
//			try {
//				$editor->compile_page();
//				$editor->saveStorage();
//				$editor->savePost();
//			} catch ( Exception $e ) {
//				$test = 0;
//			}
//		}

		$body = $editor->get_encoded_compiled_html();

		foreach ( $elements as $element ) {
			if ( $element->field_type == 'body' ) {
				$element->field_data = $body;
				break;
			}
		}

		return $elements;
	}

	/**
	 * @param $postId
	 *
	 * @return bool
	 */
	private function isUsingEditor( $postId ) {
		try {
			$originalPost = Brizy_Editor_Post::get( $postId );
		} catch ( Exception $e ) {
			return false;
		}

		return $originalPost->uses_editor();
	}
}