<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 1/18/19
 * Time: 12:20 PM
 */


class Brizy_Editor_Popup extends Brizy_Editor_Post {

	const BRIZY_META = 'brizy-meta';
	const BRIZY_MEDIA = 'brizy-media';
	const BRIZY_CLOUD_CONTAINER = 'brizy-cloud-container';
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
	 * @var Brizy_Editor_Popup
	 */
	static protected $popup_instance = null;

	/**
	 * @param $apost
	 *
	 * @return Brizy_Editor_Popup
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public static function get( $apost, $uid = null ) {

		$wp_post_id = $apost;
		if ( $apost instanceof WP_Post ) {
			$wp_post_id = $apost->ID;
		}

		if ( isset( self::$popup_instance[ $wp_post_id ] ) ) {
			return self::$popup_instance[ $wp_post_id ];
		}

		return self::$popup_instance[ $wp_post_id ] = new self( $wp_post_id, $uid );

	}

	/**
	 * @return bool
	 * @todo rename this to isGlobal
	 *
	 */
	public function isGlobalPopup() {
		return $this->getWpPost() instanceof WP_Post && $this->getWpPost()->post_type == Brizy_Admin_Popups_Main::CP_GLOBAL_POPUP;
	}

	public function isSavedPopup() {
		return $this->getWpPost() instanceof WP_Post && $this->getWpPost()->post_type == Brizy_Admin_Popups_Main::CP_POPUP;
	}

	/**
	 * @return bool
	 */
	public function isCloudUpdateRequired() {

		if ( $this->isGlobalPopup() ) {
			return false;
		}

		return (bool) get_metadata( 'post', $this->wp_post_id, self::BRIZY_CLOUD_UPDATE_META, true );
	}

	/**
	 * @param bool $cloudUpdateRequired
	 *
	 * @return Brizy_Editor_Popup
	 */
	public function setCloudUpdateRequired( $cloudUpdateRequired ) {

		if ( $this->isSavedPopup() ) {
			update_metadata( 'post', $this->wp_post_id, self::BRIZY_CLOUD_UPDATE_META, (int) $cloudUpdateRequired );
		}

		return $this;
	}

	/**
	 * @param string $meta
	 */
	public function setContainer( $meta ) {
		$this->meta = $meta;
		update_metadata( 'post', $this->wp_post_id, self::BRIZY_CLOUD_CONTAINER, $meta );
	}

	public function getContainer() {
		return get_metadata( 'post', $this->wp_post_id, self::BRIZY_CLOUD_CONTAINER, true );
	}


	/**
	 * @return array
	 */
	public function getMeta() {
		return get_metadata( 'post', $this->wp_post_id, self::BRIZY_META, true );
	}

	/**
	 * @param string $meta
	 *
	 * @return Brizy_Editor_Popup
	 */
	public function setMeta( $meta ) {
		$this->meta = $meta;
		update_metadata( 'post', $this->wp_post_id, self::BRIZY_META, $meta );
	}

	public function getMedia() {
		return get_metadata( 'post', $this->wp_post_id, self::BRIZY_MEDIA, true );
	}

	/**
	 * @param string $media
	 *
	 * @return Brizy_Editor_Popup
	 */
	public function setMedia( $media ) {
		$this->media = $media;
		update_metadata( 'post', $this->wp_post_id, self::BRIZY_MEDIA, $media );
	}


	/**
	 * @return mixed
	 */
	public function get_template() {
		return get_post_meta( $this->getWpPostId(), '_wp_page_template', true );
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
	 * @return Brizy_Editor_Popup
	 */
	public function setCloudId( $cloudId ) {
		$this->cloudId = $cloudId;

		return $this;
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
	public function loadInstanceData() {
		parent::loadInstanceData();

		$storage = $this->getStorage();
		$data    = $storage->get( self::BRIZY_POST, false );

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


	public function createResponse( $fields = array() ) {

		$p_id      = (int) $this->getWpPostId();
		$the_title = get_the_title( $p_id );

		if ( empty( $fields ) ) {
			$fields = array(
				'uid',
				'meta',
				'data',
				'status'
			);
		}

		$global = array(
			'data'        => $this->get_editor_data(),
			'uid'         => $this->getUid(),
			'status'      => get_post_status( $p_id ),
			'dataVersion' => $this->getCurrentDataVersion(),
			'meta'        => $this->getMeta()
		);

		return $global;
	}

//
//	/**
//	 * @param Brizy_Editor_Popup $post
//	 * @param array $fields
//	 *
//	 * @return array
//	 */
//	public static function postData( Brizy_Editor_Popup $post, $fields = array() ) {
//
//		$p_id = (int) $post->getWpPostId();
//
//		if ( empty( $fields ) ) {
//			$fields = array( 'uid', 'id', 'meta', 'data', 'status' );
//		}
//
//		$global = array();
//
//		if ( in_array( 'uid', $fields ) ) {
//			$global['uid'] = $post->getUid();
//		}
//		if ( in_array( 'status', $fields ) ) {
//			$global['status'] = get_post_status( $p_id );
//		}
//		if ( in_array( 'data', $fields ) ) {
//			$global['data'] = $post->get_editor_data();
//		}
//		if ( in_array( 'meta', $fields ) ) {
//			$global['meta'] = $post->getMeta();
//		}
//
//
//		return $global;
//	}


}