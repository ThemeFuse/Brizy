<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 1/18/19
 * Time: 12:20 PM
 */


class Brizy_Editor_Layout extends Brizy_Editor_Post {

	use Brizy_Editor_Synchronizable, Brizy_Editor_PostTagsAware;

	const BRIZY_LAYOUT_META = 'brizy-meta';
	const BRIZY_LAYOUT_MEDIA = 'brizy-media';
	const BRIZY_LAYOUT_GLOBAL_STYLES = 'brizy-global-styles';

	/**
	 * @var string
	 */
	protected $meta = '';

	/**
	 * @var string
	 */
	protected $media;

	/**
	 * @var string
	 */
	protected $globalStyles;

	/**
	 * @var Brizy_Editor_Layout
	 */
	static protected $layout_instance = null;

	/**
	 * @param $apost
	 * @param null $uid
	 *
	 * @return Brizy_Editor_Layout|Brizy_Editor_Post|mixed
	 * @throws Exception
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

	protected function canBeSynchronized() {
		return true;
	}

	public function createResponse( $fields = array(), $context=Brizy_Editor_Editor_Editor::EDITOR_CONTEXT ) {

		if ( empty( $fields ) ) {
			$fields = array(
				'id',
				'uid',
				'title',
				'tags',
				'meta',
				'data',
				'globalStyles',
				'status',
				'dataVersion',
				'synchronized',
				'synchronizable',
				'author',
				'isCloudEntity'
			);
		}

		$global = array();

		if ( in_array( 'uid', $fields ) ) {
			$global['uid'] = $this->getUid();
		}

		if ( in_array( 'title', $fields ) ) {
			$global['title'] = $this->getTitle();
		}

		if ( in_array( 'tags', $fields ) ) {
			$global['tags'] = $this->getTags();
		}
		if ( in_array( 'globalStyles', $fields ) ) {
			$global['globalStyles'] = $this->getGlobalStyles();
		}

		if ( in_array( 'status', $fields ) ) {
			$global['status'] = get_post_status( $this->getWpPostId() );
		}

		if ( in_array( 'dataVersion', $fields ) ) {
			$global['dataVersion'] = $this->getCurrentDataVersion();
		}

		if ( in_array( 'data', $fields ) ) {
			$global['data'] = $this->get_editor_data(true);
		}

		if ( in_array( 'meta', $fields ) ) {
			$global['meta'] = $this->getMeta();
		}

		if ( in_array( 'synchronized', $fields ) ) {
			$global['synchronized'] = $this->isSynchronized( Brizy_Editor_Project::get()->getCloudAccountId() );
		}

		if ( in_array( 'synchronizable', $fields ) ) {
			$global['synchronizable'] = $this->isSynchronizable( Brizy_Editor_Project::get()->getCloudAccountId() );
		}

		if ( in_array( 'isCloudEntity', $fields ) ) {
			$global['isCloudEntity'] = false;
		}

		if ( in_array( 'author', $fields ) ) {
			$global['author'] = $this->getWpPost()->post_author;
		}

		$global['compiler'] = $this->get_compiler();

		return $global;
	}

	/**
	 * Brizy_Editor_Layout constructor.
	 *
	 * @param $wp_post_id
	 * @param null $uid
	 *
	 * @throws Exception
	 */
	public function __construct( $wp_post_id, $uid = null ) {

		if ( $uid ) {
			$this->uid = $uid;
		}

		parent::__construct( $wp_post_id );
	}

	/**
	 * @return bool
	 */
	public function uses_editor() {
		return true;
	}

	/**
	 * This should always return true
	 *
	 * @param $val
	 *
	 * @return $this
	 */
	public function set_uses_editor( $val ) {
		parent::set_uses_editor(true);
		return $this;
	}

	/**
	 * @return array
	 */
	public function getMeta() {
		return $this->meta;
	}

	/**
	 * @param string $meta
	 *
	 * @return Brizy_Editor_Block
	 */
	public function setMeta( $meta ) {
		$this->meta = $meta;

		return $this;
	}

	/**
	 * @return string
	 */
	public function getGlobalStyles() {
		return $this->globalStyles;
	}

	/**
	 * @param string $globalStyles
	 */
	public function setGlobalStyles( $globalStyles ) {
		$this->globalStyles = $globalStyles;
	}

	public function getMedia() {
		return $this->media;
	}

	/**
	 * @param string $media
	 *
	 * @return Brizy_Editor_Block
	 */
	public function setMedia( $media ) {
		$this->media = $media;

		return $this;
	}

	/**
	 * @return mixed
	 */
	public function get_template() {
		return get_post_meta( $this->getWpPostId(), '_wp_page_template', true );
	}

	/**
	 * @param string $editor_version
	 */
	public function set_editor_version( $editor_version ) {
		$this->editor_version = $editor_version;
		update_metadata( 'post', $this->wp_post_id, self::BRIZY_POST_EDITOR_VERSION, $editor_version );
	}


	public function jsonSerialize() {
		$data                = get_object_vars( $this );
		$data['editor_data'] = base64_decode( $data['editor_data'] );
		$data['meta']        = $this->getMeta();
		//$data['cloudId']     = $this->getCloudId();
		//$data['cloudAccountId'] = $this->getCloudAccountId();
		$data['media'] = $this->getMedia();
		$data['title'] = $this->getTitle();
		$data['tags'] = $this->getTags();
		$data['globalStyles'] = $this->getGlobalStyles();

		unset( $data['wp_post'] );

		return $data;
	}

	public function loadInstanceData() {
		parent::loadInstanceData();
		$storage      = $this->getStorage();
		$storage_post = $storage->get( self::BRIZY_POST, false );

		// load synchronisation data
		$this->loadSynchronizationData();

		// back compatibility with old sync data
		if ( isset( $storage_post['cloudId'] ) && isset( $storage_post['cloudAccountId'] ) ) {
			$this->setSynchronized( $storage_post['cloudAccountId'], $storage_post['cloudId'] );
		}

		$this->meta  = get_metadata( 'post', $this->getWpPostId(), self::BRIZY_LAYOUT_META, true );
		$this->media = get_metadata( 'post', $this->getWpPostId(), self::BRIZY_LAYOUT_MEDIA, true );
		$this->globalStyles = base64_decode(get_metadata( 'post', $this->getWpPostId(), self::BRIZY_LAYOUT_GLOBAL_STYLES, true ));

		$this->loadInstanceTags();
	}

	public function convertToOptionValue() {
		$data = parent::convertToOptionValue();

		$data['media'] = $this->getMedia();
		$data['globalStyles'] = $this->getGlobalStyles();
		//$data['cloudId']        = $this->getCloudId();
		//$data['cloudAccountId'] = $this->getCloudAccountId();
		$data['synchronized']   = $this->isSynchronized( Brizy_Editor_Project::get()->getCloudAccountId() );
		$data['synchronizable'] = $this->isSynchronizable( Brizy_Editor_Project::get()->getCloudAccountId() );

		return $data;
	}

	/**
	 * This will take all values from entity and save them to database
	 */
	public function saveStorage() {
		parent::saveStorage();

		update_metadata( 'post', $this->getWpPostId(), self::BRIZY_LAYOUT_META, $this->meta );
		update_metadata( 'post', $this->getWpPostId(), self::BRIZY_LAYOUT_MEDIA, $this->media );
		update_metadata( 'post', $this->getWpPostId(), self::BRIZY_LAYOUT_GLOBAL_STYLES, base64_encode($this->globalStyles) );

		$this->saveInstanceTags();
	}

	public function save( $autosave = 0 ) {

		parent::save( $autosave );

		if ( $autosave !== 1 ) {
			$this->savePost( true );
		}
	}


}


