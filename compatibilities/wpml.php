<?php

/**
 * Compatibility with WPML
 */
class Brizy_Compatibilities_WPML {

	public function __construct() {
		add_action( 'wp_insert_post', array( $this, 'insertNewPost' ), -10000, 3 );
		add_action( 'wp_insert_post', array( $this, 'duplicatePosts' ), -10000, 3 );

		add_filter( 'wpml_decode_custom_field', array( $this, 'decode_custom_field' ), 10, 2 );
		add_filter( 'wpml_encode_custom_field',  array( $this, 'encode_custom_field' ), 10, 2 );
		add_filter( 'wpml_pb_should_body_be_translated', array( $this, 'remove_body' ), 10, 2 );
		add_action( 'wpml_pro_translation_completed', array( $this, 'save_post' ), 10, 3 );

		add_filter( 'wpml_basket_is_base64_item', '__return_false' );
		add_filter( 'wpml_document_view_item_link', '__return_empty_string' );
		add_filter( 'wpml_document_edit_item_link', '__return_empty_string' );
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

		if(isset($_POST['langs'])  ) {
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
	 * Remove body from the translation editor because it is generated automatically.
	 *
	 * @param bool    $translate Does body need to be translated.
	 * @param WP_Post $post      The post we are translating.
	 * @return bool
	 */
	public function remove_body( $translate, $post ) {
		$brizyPost = Brizy_Editor_Post::get( $post );
		if ( $brizyPost->uses_editor() ) {
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
		$originalPost = Brizy_Editor_Post::get( $job->original_doc_id );
		if ( $originalPost->uses_editor() ) {
			$translatedPost = Brizy_Editor_Post::get( $post_id );
			if ( ! $translatedPost->uses_editor() ) {
				$translatedPost->set_uses_editor( true );
			}
			$translatedPost->set_needs_compile( true );
		}
	}
}
