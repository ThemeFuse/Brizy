<?php

trait Brizy_Editor_AutoSaveAware {

	/**
	 * @param WP_Post $post
	 * @param $callaback
	 *
	 * @return bool|WP_Error
	 */
	public function auto_save_post( \WP_Post $post, $callaback ) {
		try {
			$user_id                   = get_current_user_id();
			$postParentId              = $post->post_parent;
			$old_autosave              = $this->getLastAutosave( $postParentId?$postParentId:$post->ID, $user_id );
			$post_data                 = get_object_vars( $post );
			$post_data['post_content'] .= "\n<!-- " . time() . "-->";
			$autosavePost              = null;

			if ( $old_autosave ) {
				$autosavePost = self::get( $old_autosave );
			}

			if ( $old_autosave ) {
				$new_autosave                = _wp_post_revision_data( $post_data, true );
				$new_autosave['ID']          = $old_autosave;
				$new_autosave['post_author'] = $user_id;

				// If the new autosave has the same content as the post, delete the autosave.
				$autosave_is_different = false;

				foreach ( array_intersect( array_keys( $new_autosave ), array_keys( _wp_post_revision_fields( $post ) ) ) as $field ) {
					if ( normalize_whitespace( $new_autosave[ $field ] ) != normalize_whitespace( $post->$field ) ) {
						$autosave_is_different = true;
						break;
					}
				}

				if ( ! $autosave_is_different ) {
					wp_delete_post_revision( $old_autosave );

					return new WP_Error( 'rest_autosave_no_changes', __( 'There is nothing to save. The autosave and the post content are the same.' ), array( 'status' => 400 ) );
				}

				/**
				 * This filter is documented in wp-admin/post.php.
				 */
				do_action( 'wp_creating_autosave', $new_autosave );

				// wp_update_post expects escaped array.
				wp_update_post( wp_slash( $new_autosave ) );

			} else {
				// Create the new autosave as a special post revision.
				$revId        = _wp_put_post_revision( $post_data, true );
				$autosavePost = self::get( $revId );
			}

			$callaback( $autosavePost );

		} catch ( Exception $exception ) {
			Brizy_Logger::instance()->exception( $exception );

			return false;
		}
	}


	/**
	 * @param $postId
	 * @param $userId
	 *
	 * @return int|void|null
	 * @throws Exception
	 */
	public static function getAutoSavePost( $postId, $userId ) {
		$postParentId = wp_get_post_parent_id( $postId );
		$autosave     = wp_get_post_autosave( $postParentId ?$postParentId:$postId, $userId );

		if ( ! $autosave ) {
			return;
		}

		$post = get_post( $postId );

		$postDate     = new DateTime( $post->post_modified );
		$autosaveDate = new DateTime( $autosave->post_modified );

		if ( $postDate > $autosaveDate ) {
			return null;
		}

		return $autosave->ID;
	}

	/**
	 * @param int $postParentId
	 */
	private function deleteOldAutoSaves( $postParentId ) {
		global $wpdb;
		$user_id = get_current_user_id();

		$wpdb->query( $wpdb->prepare( "
										DELETE p, pm FROM {$wpdb->posts} p  
										INNER JOIN {$wpdb->postmeta} pm ON pm.post_id = p.id
										WHERE p.post_author = %d and 
											  p.post_parent = %d and 
											  p.post_type = 'revision' and 
											  p.post_name LIKE %s", $user_id, $postParentId, "{$postParentId}-autosave%" ) );
	}

	/**
	 * @param int $postParentId
	 * @param int $user_id
	 *
	 * @return int
	 */
	protected function getLastAutosave( $postParentId, $user_id ) {
		global $wpdb;

		$postParentId = (int) $postParentId;
		$user_id      = (int) $user_id;

		$query = sprintf( "SELECT ID FROM {$wpdb->posts} WHERE  post_parent = %d AND post_type= 'revision' AND post_status= 'inherit'AND post_name LIKE '%d-autosave%%'", $postParentId, $postParentId );

		if ( is_integer( $user_id ) ) {
			$query .= " AND post_author={$user_id}";
		}

		$query .= " ORDER BY post_date DESC";

		return (int) $wpdb->get_var( $query );

	}

	/**
	 * @return mixed
	 */
	abstract protected function populateAutoSavedData( $autosave );

}
