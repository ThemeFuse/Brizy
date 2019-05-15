<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 1/18/19
 * Time: 12:20 PM
 */


class Brizy_Editor_Block extends Brizy_Editor_Post {

	use Brizy_Editor_AutoSaveAware;

	const BRIZY_META = 'brizy-meta';
	const BRIZY_MEDIA = 'brizy-media';
	const BRIZY_CLOUD_CONTAINER = 'brizy-cloud-container';
	const BRIZY_CLOUD_UPDATE_REQUIRED = 'brizy-cloud-update-required';

	/**
	 * @var object
	 */
	protected $position;

	/**
	 * @var string
	 */
	protected $meta;

	/**
	 * @var string
	 */
	protected $media;

	/**
	 * @var array
	 */
	protected $cloudId;

	/**
	 * @var Brizy_Editor_Block
	 */
	static protected $block_instance = null;

	public static function cleanClassCache() {
		self::$instance = array();
	}

	/**
	 * @param $apost
	 * @param null $uid
	 *
	 * @return Brizy_Editor_Block|Brizy_Editor_Post|mixed
	 * @throws Exception
	 */
	public static function get( $apost, $uid = null ) {

		$wp_post_id = $apost;
		if ( $apost instanceof WP_Post ) {
			$wp_post_id = $apost->ID;
		}

		if ( isset( self::$block_instance[ $wp_post_id ] ) ) {
			return self::$block_instance[ $wp_post_id ];
		}

		return self::$block_instance[ $wp_post_id ] = new self( $wp_post_id, $uid );
	}

	public function createResponse( $fields = array() ) {


		if ( empty( $fields ) ) {
			$fields = array(
				'uid',
				'id',
				'meta',
				'data',
				'status',
				'position',
				'rules',
				'dataVersion',
				'synchronized',
				'synchronizable'
			);
		}

		$global = array();

		if ( in_array( 'uid', $fields ) ) {
			$global['uid'] = $this->getUid();
		}

		if ( in_array( 'status', $fields ) ) {
			$global['status'] = get_post_status( $this->getWpPostId() );
		}

		if ( in_array( 'dataVersion', $fields ) ) {
			$global['dataVersion'] = $this->getCurrentDataVersion();
		}

		if ( in_array( 'data', $fields ) ) {
			$global['data'] = $this->get_editor_data();
		}

		if ( in_array( 'meta', $fields ) ) {
			$global['meta'] = $this->getMeta();
		}
		if ( in_array( 'synchronized', $fields ) ) {
			$global['synchronized'] = ! empty( $this->getCloudId() );
		}
		if ( in_array( 'synchronizable', $fields ) ) {
			$global['synchronizable'] = metadata_exists( 'post', $this->getWpPostId(), self::BRIZY_CLOUD_UPDATE_REQUIRED );
		}

		if ( $this->getWpPost()->post_type == Brizy_Admin_Blocks_Main::CP_GLOBAL ) {
			if ( in_array( 'position', $fields ) ) {
				$global['position'] = $this->getPosition();
			}
			if ( in_array( 'rules', $fields ) ) {
				$ruleManager     = new Brizy_Admin_Rules_Manager();
				$global['rules'] = $ruleManager->getRules( $this->getWpPostId() );
			}
		}

		return $global;
	}


	/**
	 * Brizy_Editor_Block constructor.
	 *
	 * @param $wp_post_id
	 * @param null $uid
	 *
	 * @throws Brizy_Editor_Exceptions_NotFound
	 * @throws Brizy_Editor_Exceptions_UnsupportedPostType
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
		$this->uses_editor = true;

		return $this;
	}

	public function setPosition( $position ) {
		$this->position = $position;

		return $this;
	}

	/**
	 * @return object
	 */
	public function getPosition() {
		return $this->position;
	}


	public function isGlobalBlock() {
		return $this->getWpPost() instanceof WP_Post && $this->getWpPost()->post_type == Brizy_Admin_Blocks_Main::CP_GLOBAL;
	}

	public function isSavedBlock() {
		return $this->getWpPost() instanceof WP_Post && $this->getWpPost()->post_type == Brizy_Admin_Blocks_Main::CP_SAVED;
	}

	/**
	 * @return bool
	 */
	public function isCloudUpdateRequired() {

		if ( $this->isGlobalBlock() ) {
			return false;
		}

		return (bool) get_metadata( 'post', $this->getWpPostId(), self::BRIZY_CLOUD_UPDATE_REQUIRED, true );
	}

	/**
	 * @param bool $cloudUpdateRequired
	 *
	 * @return Brizy_Editor_Block
	 */
	public function setCloudUpdateRequired( $cloudUpdateRequired ) {

		if ( $this->isSavedBlock() ) {
			update_metadata( 'post', $this->getWpPostId(), self::BRIZY_CLOUD_UPDATE_REQUIRED, (int) $cloudUpdateRequired );
		}

		return $this;
	}

	/**
	 * @return array
	 */
	public function getMeta() {
		return get_metadata( 'post', $this->getWpPostId(), self::BRIZY_META, true );
	}

	/**
	 * @param string $meta
	 *
	 * @return Brizy_Editor_Block
	 */
	public function setMeta( $meta ) {
		$this->meta = $meta;
		update_metadata( 'post', $this->getWpPostId(), self::BRIZY_META, $meta );
	}

	public function getMedia() {
		return get_metadata( 'post', $this->getWpPostId(), self::BRIZY_MEDIA, true );
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

	/**
	 * @param string $meta
	 *
	 * @return Brizy_Editor_Block
	 */
	public function setContainer( $meta ) {
		$this->meta = $meta;
		update_metadata( 'post', $this->getWpPostId(), self::BRIZY_CLOUD_CONTAINER, $meta );
	}

	public function getContainer() {
		return get_metadata( 'post', $this->getWpPostId(), self::BRIZY_CLOUD_CONTAINER, true );
	}

	/**
	 * @param string $media
	 *
	 * @return Brizy_Editor_Block
	 */
	public function setMedia( $media ) {
		$this->media = $media;
		update_metadata( 'post', $this->getWpPostId(), self::BRIZY_MEDIA, $media );
	}

	public function jsonSerialize() {
		$data                = get_object_vars( $this );
		$data['editor_data'] = base64_decode( $data['editor_data'] );

		$ruleManager = new Brizy_Admin_Rules_Manager();

		$data['rules']    = $ruleManager->getRules( $this->getWpPostId() );
		$data['position'] = $this->getPosition();
		$data['meta']     = $this->getMeta();
		$data['cloudId']  = $this->getCloudId();
		$data['media']    = $this->getMedia();

		unset( $data['wp_post'] );

		return $data;
	}

	public function loadInstanceData() {
		parent::loadInstanceData();
		$storage      = $this->getStorage();
		$storage_post = $storage->get( self::BRIZY_POST, false );
		if ( isset( $storage_post['position'] ) ) {
			$this->position = $storage_post['position'];
		}

		if ( isset( $storage_post['cloudId'] ) ) {
			$this->cloudId = $storage_post['cloudId'];
		}
	}

	public function convertToOptionValue() {
		$data = parent::convertToOptionValue();

		$ruleManager            = new Brizy_Admin_Rules_Manager();

		$data['position']       = $this->getPosition();
		$data['cloudId']        = $this->getCloudId();
		$data['synchronized']   = ! empty( $this->getCloudId() );
		$data['synchronizable'] = metadata_exists( 'post', $this->getWpPostId(), self::BRIZY_CLOUD_UPDATE_REQUIRED );
		$data['media']          = $this->getMedia();
		$data['rules']          = $ruleManager->getRules( $this->getWpPostId() );

		return $data;
	}

	/**
	 * @param $autosave
	 *
	 * @return Brizy_Editor_Block
	 */
	protected function populateAutoSavedData( $autosave ) {
		/**
		 * @var Brizy_Editor_Block $autosave ;
		 */
		$autosave = parent::populateAutoSavedData( $autosave );
		$autosave->setPosition( $this->getPosition() );

		return $autosave;
	}

	/**
	 * @param $type
	 * @param array $arags
	 *
	 * @return array
	 * @throws Exception
	 */
	public static function getBlocksByType( $type, $arags = array() ) {

		$filterArgs = array(
			'post_type'      => $type,
			'posts_per_page' => - 1,
			'post_status'    => 'any',
			'orderby'        => 'ID',
			'order'          => 'ASC',
		);
		$filterArgs = array_merge( $filterArgs, $arags );

		$wpBlocks = get_posts( $filterArgs );
		$blocks   = array();

		foreach ( $wpBlocks as $wpPost ) {
			$blocks[] = Brizy_Editor_Block::get( $wpPost )->createResponse();
		}

		return $blocks;
	}

	public function save( $autosave = 0 ) {

		parent::save( $autosave );

		if ( $autosave !== 1 ) {
			$this->savePost();
			do_action( 'brizy_global_data_updated' );
		}
	}


}
