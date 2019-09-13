<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 1/18/19
 * Time: 12:20 PM
 */


class Brizy_Editor_Layout extends Brizy_Editor_Post {

	const BRIZY_LAYOUT_META = 'brizy-meta';
	const BRIZY_LAYOUT_MEDIA = 'brizy-media';
	const BRIZY_CLOUD_UPDATE_META = 'brizy-cloud-update-required';

	/**
	 * @var string
	 */
	protected $meta = '';

	/**
	 * @var string
	 */
	protected $media;

	/**
	 * @var array
	 */
	protected $cloudId;

	/**
	 * @var Brizy_Editor_Layout
	 */
	static protected $layout_instance = null;

	/**
	 * @param $apost
	 *
	 * @return Brizy_Editor_Layout|null
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public static function get( $apost, $uid = null ) {

		$wp_post_id = $apost;
		if ( $apost instanceof WP_Post ) {
			$wp_post_id = $apost->ID;
		}

		if ( isset( self::$layout_instance[ $wp_post_id ] ) ) {
			return self::$layout_instance[ $wp_post_id ];
		}

		return self::$layout_instance[ $wp_post_id ] = new self( $wp_post_id, $uid );

	}

	/**
	 * Brizy_Editor_Layout constructor.
	 *
	 * @param $wp_post_id
	 * @param null $uid
	 *
	 * @throws Brizy_Editor_Exceptions_NotFound
	 * @throws Brizy_Editor_Exceptions_UnsupportedPostType
	 */
	public function __construct( $wp_post_id, $uid = null ) {

		self::checkIfPostTypeIsSupported( $wp_post_id );
		$this->wp_post_id = (int) $wp_post_id;

		if ( $this->wp_post_id ) {
			$this->wp_post = get_post( $this->wp_post_id );
		}

		// get the storage values
		$storage      = $this->storage();
		$storage_post = $storage->get( self::BRIZY_POST, false );

		$this->loadStorageData( $storage_post );


		if ( $uid ) {
			$this->uid = $uid;
			update_post_meta( $this->get_parent_id(), 'brizy_post_uid', $this->uid );
		} else {
			$this->create_uid();
		}
	}

	/**
	 * @return null
	 */
	public function getUid() {
		return $this->uid;
	}

	/**
	 * @param null $uid
	 *
	 * @return Brizy_Editor_Layout
	 */
	public function setUid( $uid ) {
		$this->uid = $uid;

		return $this;
	}

	/**
	 * @return bool
	 */
	public function isCloudUpdateRequired() {
		return (bool) get_metadata( 'post', $this->wp_post_id, self::BRIZY_CLOUD_UPDATE_META, true );
	}

	/**
	 * @param bool $cloudUpdateRequired
	 *
	 * @return Brizy_Editor_Layout
	 */
	public function setCloudUpdateRequired( $cloudUpdateRequired ) {
		update_metadata( 'post', $this->wp_post_id, self::BRIZY_CLOUD_UPDATE_META, (int) $cloudUpdateRequired );

		return $this;
	}

	/**
	 * @return array
	 */
	public function getMeta() {
		return get_metadata( 'post', $this->wp_post_id, self::BRIZY_LAYOUT_META, true );
	}

	/**
	 * @param string $meta
	 *
	 * @return Brizy_Editor_Layout
	 */
	public function setMeta( $meta ) {
		$this->meta = $meta;
		update_metadata( 'post', $this->wp_post_id, self::BRIZY_LAYOUT_META, $meta );
	}

	public function getMedia() {
		return get_metadata( 'post', $this->wp_post_id, self::BRIZY_LAYOUT_MEDIA, true );
	}

	/**
	 * @param string $media
	 *
	 * @return Brizy_Editor_Layout
	 */
	public function setMedia( $media ) {
		$this->media = $media;
		update_metadata( 'post', $this->wp_post_id, self::BRIZY_LAYOUT_MEDIA, $media );
	}


	/**
	 * @return mixed
	 */
	public function get_template() {
		return get_post_meta( $this->get_id(), '_wp_page_template', true );
	}

	/**
	 * @param string $editor_version
	 */
	public function set_editor_version( $editor_version ) {
		$this->editor_version = $editor_version;
		update_metadata( 'post', $this->wp_post_id, self::BRIZY_POST_EDITOR_VERSION, $editor_version );
	}


	/**
	 * @return array
	 */
	public function getCloudId() {
		return $this->cloudId;
	}

	/**
	 * @param array $cloudId
	 *
	 * @return Brizy_Editor_Layout
	 */
	public function setCloudId( $cloudId ) {
		$this->cloudId = $cloudId;

		return $this;
	}


	/**
	 * @return array|mixed
	 */
	public function auto_save_post() {
		try {
			$user_id                   = get_current_user_id();
			$post                      = $this->get_wp_post();
			$postParentId              = $this->get_parent_id();
			$old_autosave              = wp_get_post_autosave( $postParentId, $user_id );
			$post_data                 = get_object_vars( $post );
			$post_data['post_content'] .= "\n<!-- " . time() . "-->";
			$autosavePost              = null;

			if ( $old_autosave ) {
				$autosavePost = self::get( $old_autosave );
			}

			if ( $old_autosave ) {
				$new_autosave                = _wp_post_revision_data( $post_data, true );
				$new_autosave['ID']          = $old_autosave->ID;
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
					wp_delete_post_revision( $old_autosave->ID );

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

			$autosavePost = $this->populateAutoSavedData( $autosavePost );
			$autosavePost->save();

		} catch ( Exception $exception ) {
			Brizy_Logger::instance()->exception( $exception );

			return false;
		}
	}


	public function jsonSerialize() {
		$data                = get_object_vars( $this );
		$data['editor_data'] = base64_decode( $data['editor_data'] );

		$data['cloudId'] = $this->getCloudId();
		$data['meta']    = $this->getMeta();

		unset( $data['wp_post'] );

		return $data;
	}

	/**
	 * @param $data
	 */
	public function loadStorageData( $data ) {
		parent::loadStorageData( $data );

		if ( isset( $data['cloudId'] ) ) {
			$this->cloudId = $data['cloudId'];
		}
	}

	/**
	 * @return array|mixed
	 */
	public function convertToOptionValue() {
		$data            = parent::convertToOptionValue();
		$data['cloudId'] = $this->getCloudId();

		return $data;
	}

	/**
	 * @param $type
	 * @param array $arags
	 *
	 * @return array
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public static function getLayoutByUid( $uid ) {

		$filterArgs = array(
			'post_type'      => Brizy_Admin_Layouts_Main::CP_LAYOUT,
			'meta_key'       => 'brizy_post_uid',
			'meta_value'     => $uid,
			'posts_per_page' => 1,
			'post_status'    => 'any',
			'orderby'        => 'ID',
			'order'          => 'ASC',
		);

		$wpLayouts = get_posts( $filterArgs );
		if ( isset( $wpLayouts[0] ) ) {
			return self::postData( Brizy_Editor_Layout::get( $wpLayouts ) );
		}

		return null;
	}

	/**
	 * @param Brizy_Editor_Layout $post
	 * @param array $fields
	 *
	 * @return array
	 */
	public static function postData( Brizy_Editor_Layout $post, $fields = array() ) {

		$p_id = (int) $post->get_id();

		if ( empty( $fields ) ) {
			$fields = array( 'uid', 'id', 'meta', 'data', 'status' );
		}

		$global = array();

		if ( in_array( 'uid', $fields ) ) {
			$global['uid'] = $post->get_uid();
		}
		if ( in_array( 'status', $fields ) ) {
			$global['status'] = get_post_status( $p_id );
		}
		if ( in_array( 'data', $fields ) ) {
			$global['data'] = $post->get_editor_data();
		}
		if ( in_array( 'meta', $fields ) ) {
			$global['meta'] = $post->getMeta();
		}


		return $global;
	}


}