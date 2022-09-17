<?php


/**
 * Class Brizy_Admin_Post_RevisionManager
 */
class Brizy_Admin_Post_RevisionManager {

	/**
	 * @var Brizy_Admin_Post_AbstractMonitor[]
	 */
	protected $monitors = array();


	/**
	 * Brizy_Admin_Post_RevisionManager constructor.
	 */
	public function __construct() {

		add_action( 'wp_restore_post_revision', array( $this, 'restorePostRevisionMeta' ), 11, 2 );

		if ( ! defined( 'WP_POST_REVISIONS' ) || ( defined( 'WP_POST_REVISIONS' ) && WP_POST_REVISIONS !== false ) ) {
			add_action( 'save_post', array( $this, 'savePost' ), 11, 2 );
		}


	}

	/**
	 * @return Brizy_Admin_Post_AbstractMonitor[]
	 */
	public function getMonitors() {
		return $this->monitors;
	}

	/**
	 * @param Brizy_Admin_Post_AbstractMonitor[] $monitors
	 *
	 * @return Brizy_Admin_Post_RevisionManager
	 */
	public function setMonitors( $monitors ) {
		$this->monitors = $monitors;

		return $this;
	}

	/**
	 * @param Brizy_Admin_Post_AbstractMonitor $monitor
	 *
	 * @return Brizy_Admin_Post_RevisionManager
	 */
	public function addMonitor( $monitor ) {
		$this->monitors[] = $monitor;

		return $this;
	}

	/**
	 * @param $postId
	 * @param $type
	 *
	 * @return bool
	 */
	public function getMatchingMonitor( $postId, $type ) {
		foreach ( $this->monitors as $monitor ) {
			if ( $monitor->shouldStoreMetaRevision( $postId, $type ) ) {
				return $monitor;
			}
		}

		return false;
	}

	/**
	 * @param $postId
	 * @param $post
	 */
	public function savePost( $postId, $post, $update = false ) {
		$postParentId = wp_is_post_revision( $postId );
		$postType     = get_post_type( $post->post_parent );

		// ignore all posts that are not watched
		if ( $postParentId && $monitor = $this->getMatchingMonitor( $postParentId, $postType ) ) {
			// copy meta data only for existing posts
			$this->copyMetaDataToRevision( $postParentId, $postId, $monitor );
		}
	}

	/**
	 * @param int $postId
	 * @param int $revisionId
	 */
	public function restorePostRevisionMeta( $postId, $revisionId ) {
		$postType = get_post_type( $postId );

		// ignore all posts that are not watched
		if ( $monitor = $this->getMatchingMonitor( $postId, $postType ) ) {
			// copy meta data only for existing posts
			$this->restoreRevisionMetaDataToPost( $postId, $revisionId, $monitor );
		}

	}

	/**
	 * This method will add all meta data entries from $post to $revision post
	 *
	 * @param int $post
	 * @param int $revision
	 * @param Brizy_Admin_Post_AbstractMonitor $monitor
	 */
	private function copyMetaDataToRevision( $post, $revision, $monitor ) {

		global $wpdb;
		$tablePostMeta    = $wpdb->postmeta;
		$meta_key_count   = count( $monitor->getPostMetaKeys() );
		$meta_keys_params = rtrim( str_repeat( '%s,', $meta_key_count ), ',' );
		$params           = array( (int) $revision, (int) $post );
		// Delete all meta keys for revision
		$this->cleanMetaData( $post, $revision, $monitor );

		// Get all metas of parent post and add them to the revision of this parent
		$query = "INSERT INTO {$tablePostMeta} (post_Id, meta_key, meta_value) 
									SELECT %d, meta_key, meta_value 
									FROM {$tablePostMeta} 
									WHERE post_id=%d";

		if ( $meta_key_count > 0 ) {
			$query  .= " and meta_key IN ({$meta_keys_params})";
			$params = array_merge( $params, $monitor->getPostMetaKeys() );
		} else {
			$query .= " and meta_key NOT IN ('_edit_last','_edit_lock','_thumbnail_id','_wp_attached_file','_wp_attachment_metadata')";
		}

		$wpdb->query( $wpdb->prepare( $query, $params ) );

		if ( $meta_key_count > 0 && in_array( 'brizy', $monitor->getPostMetaKeys() ) ) {

			wp_cache_delete( $revision, 'post_meta');

			try {

				$storage = Brizy_Editor_Storage_Post::instance( $revision );
				$data    = $storage->get( Brizy_Editor_Post::BRIZY_POST );

				$data['compiled_html']      = '';
				$data['compiled_html_body'] = '';
				$data['compiled_html_head'] = '';

				$storage->set( Brizy_Editor_Post::BRIZY_POST, $data );

			} catch ( Exception $e ) {
				return;
			}

			$wpdb->update(
				$wpdb->posts,
				[ 'post_content' => '<div class="brz-root__container"><!-- version:' . time() . ' --></div>' ],
				[ 'ID' => $revision ],
                [ '%s' ]
			);
		}
	}

	private function cleanMetaData( $post, $revision, $monitor ) {
		global $wpdb;
		$params           = array( (int) $revision );
		$meta_key_count   = count( $monitor->getPostMetaKeys() );
		$meta_keys_params = rtrim( str_repeat( '%s,', $meta_key_count ), ',' );
		$tablePostMeta    = "{$wpdb->prefix}postmeta";
		$query            = "DELETE FROM {$tablePostMeta} WHERE post_id=%d and meta_key IN ({$meta_keys_params})";
		$params           = array_merge( $params, $monitor->getPostMetaKeys() );
		$wpdb->query( $wpdb->prepare( $query, $params ) );
	}

	/**
	 * This method will add all meta data entries from $revision to $post
	 *
	 * @param int $post
	 * @param int $revision
	 * @param Brizy_Admin_Post_AbstractMonitor $monitor
	 */
	private function restoreRevisionMetaDataToPost( $post, $revision, $monitor ) {
		global $wpdb;
		try {

			$tablePostMeta = "{$wpdb->prefix}postmeta";

			$wpdb->query( "START TRANSACTION" );

			$revisionMetaValues = $this->getRevisionMetaValues( $revision, $monitor );

			if ( $revisionMetaValues === false ) {
				throw new Exception();
			}

			foreach ( $revisionMetaValues as $meta ) {

				$wpdb->query( $wpdb->prepare( "DELETE FROM {$wpdb->prefix}postmeta WHERE post_id=%d and meta_key=%s", $post, $meta->meta_key ) );
				$res = $wpdb->query( $wpdb->prepare( "INSERT INTO {$tablePostMeta} (post_id,meta_key,meta_value) VALUES (%d,%s,%s)", $post, $meta->meta_key, $meta->meta_value ) );

				if ( $res === false ) {
					throw new Exception();
				}
			}

			Brizy_Editor_Post::cleanClassCache();
			$brizyPost = Brizy_Editor_Post::get( $post );

			if ( $brizyPost->uses_editor() ) {
				$brizyPost->set_needs_compile( true );
				$brizyPost->saveStorage();
			}

			$wpdb->query( 'COMMIT' );
		} catch ( Exception $e ) {
			$wpdb->query( 'ROLLBACK' );
		}

	}

	/**
	 * @param int $post
	 * @param Brizy_Admin_Post_AbstractMonitor $monitor
	 */
	private function cleanMetakeys( $post, $monitor ) {
		global $wpdb;

		$meta_key_count   = count( $monitor->getPostMetaKeys() );
		$params           = array( (int) $post );
		$meta_keys_params = rtrim( str_repeat( '%s,', $meta_key_count ), ',' );

		$query = "DELETE FROM {$wpdb->prefix}postmeta WHERE post_id=%d";

		if ( $meta_key_count > 0 ) {
			$query  .= " and meta_key IN ({$meta_keys_params})";
			$params = array_merge( $params, $monitor->getPostMetaKeys() );
		} else {
			$query .= " and meta_key NOT IN ('_edit_last','_edit_lock','_thumbnail_id','_wp_attached_file','_wp_attachment_metadata')";
		}

		$wpdb->query( $wpdb->prepare( $query, $params ) );
	}

	/**
	 * @param $revision
	 * @param $monitor
	 *
	 * @return array|null|object
	 */
	private function getRevisionMetaValues( $revision, $monitor ) {
		global $wpdb;

		$meta_key_count   = count( $monitor->getPostMetaKeys() );
		$params           = array( (int) $revision );
		$meta_keys_params = rtrim( str_repeat( '%s,', $meta_key_count ), ',' );

		$query = "SELECT * FROM {$wpdb->prefix}postmeta WHERE post_id=%d";

		if ( $meta_key_count > 0 ) {
			$query  .= " and meta_key IN ({$meta_keys_params})";
			$params = array_merge( $params, $monitor->getPostMetaKeys() );
		} else {
			$query .= " and meta_key NOT IN ('_edit_last','_edit_lock','_thumbnail_id','_wp_attached_file','_wp_attachment_metadata')";
		}

		$query = $wpdb->prepare( $query, $params );

		return $wpdb->get_results( $query );
	}


}