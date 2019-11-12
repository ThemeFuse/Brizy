<?php

abstract class Brizy_Editor_Entity extends Brizy_Admin_Serializable {

	/**
	 * @var string
	 */
	protected $uid;

	/**
	 * @var int
	 */
	private $wp_post_id;

	/**
	 * @var WP_Post
	 */
	private $wp_post = null;

	/**
	 * Brizy_Editor_Entity constructor.
	 */
	public function __construct( $postId ) {

		if ( ! is_numeric( $postId ) ) {
			throw new Exception( 'Invalid post id provided' );
		}

		Brizy_Editor::checkIfPostTypeIsSupported( $postId );

		$this->setWpPostId( $postId );

		$this->loadInstanceData();
	}


	/**
	 * Will return the key on witch the object data will be saved in storage
	 *
	 * @return mixed
	 */
	abstract protected function getObjectKey();

	/**
	 * Load all object data
	 */
	abstract protected function loadInstanceData();

	/**
	 * Save post data and and trigger post update
	 *
	 * @return mixed
	 */
	abstract public function savePost();

	/**
	 * @return $this
	 */
	public function save() {
		$this->createUid();

		return $this;
	}

	/**
	 * @return Brizy_Editor_Post[]
	 * @throws Brizy_Editor_Exceptions_NotFound
	 * @throws Brizy_Editor_Exceptions_UnsupportedPostType
	 */
	public static function get_all_brizy_post_ids() {
		global $wpdb;
		$posts = $wpdb->get_results(
			$wpdb->prepare( "SELECT p.ID FROM {$wpdb->postmeta} pm 
									JOIN {$wpdb->posts} p ON p.ID=pm.post_id and p.post_type <> 'revision'  and p.post_type<>'attachment'
									WHERE pm.meta_key = %s ", Brizy_Editor_Storage_Post::META_KEY )
		);

		return array_map( function ( $o ) {
			return (int) $o->ID;
		}, $posts );
	}

	/**
	 * @return int
	 */
	public function getWpPostId() {
		return $this->wp_post_id;
	}

	/**
	 * @param int $wp_post_id
	 *
	 * @return Brizy_Editor_Entity
	 */
	public function setWpPostId( $wp_post_id ) {
		$this->wp_post_id = $wp_post_id;

		return $this;
	}

	/**
	 * Return the post parent id
	 *
	 * @return int
	 */
	public function getWpPostParentId() {
		return $this->getWpPost()->post_parent ?: $this->getWpPostId();
	}

	/**
	 * @return WP_Post
	 */
	public function getWpPost() {
		return $this->wp_post ?: ( $this->wp_post = get_post( $this->getWpPostId() ) );
	}

	/**
	 * @return string
	 */
	public function getUid() {
		return $this->uid;
	}

	/**
	 * Return an instance of Brizy_Editor_Storage_Abstract that will store the object data
	 *
	 * @return Brizy_Editor_Storage_Post
	 */
	protected function getStorage() {
		return Brizy_Editor_Storage_Post::instance( $this->wp_post_id );
	}

	/**
	 * @return mixed|string
	 */
	protected function createUid() {
		if ( $uid = $this->getUid() ) {
			return $uid;
		}

		$post_parent_id = $this->getWpPostParentId() ?: $this->getWpPostId();
		$uid            = get_post_meta( $post_parent_id, 'brizy_post_uid', true );

		if ( ! $uid ) {
			$uid = md5( $post_parent_id . time() );
			update_post_meta( $post_parent_id, 'brizy_post_uid', $uid );
		}

		return $this->uid = $uid;
	}

}