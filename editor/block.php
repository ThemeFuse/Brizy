<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 1/18/19
 * Time: 12:20 PM
 */


class Brizy_Editor_Block extends Brizy_Editor_Post {

	/**
	 * @var Brizy_Editor_BlockPosition[]
	 */
	use Brizy_Editor_AutoSaveAware, Brizy_Editor_Synchronizable;

	const BRIZY_META = 'brizy-meta';
	const BRIZY_MEDIA = 'brizy-media';

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
	 * @var Brizy_Admin_Rule[]
	 */
	protected $rules;

	/**
	 * @var self;
	 */
	static protected $block_instance = null;

	public static function cleanClassCache() {
		self::$instance = array();
	}

	protected function canBeSynchronized() {
		return $this->isSavedBlock();
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


		if ( $this->getWpPost()->post_type == Brizy_Admin_Blocks_Main::CP_SAVED ) {

			if ( in_array( 'synchronized', $fields ) ) {
				$global['synchronized'] = $this->isSynchronized( Brizy_Editor_Project::get()->getCloudAccountId() );
			}

			if ( in_array( 'synchronizable', $fields ) ) {
				$global['synchronizable'] = $this->isSynchronizable();
			}
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

	/**
	 * @return Brizy_Admin_Rule[]
	 */
	public function getRules() {
		return $this->rules;
	}

	/**
	 * @param Brizy_Admin_Rule[] $rules
	 *
	 * @return Brizy_Editor_Block
	 */
	public function setRules( $rules ) {
		$this->rules = $rules;

		return $this;
	}


	public function isGlobalBlock() {
		return $this->getWpPost() instanceof WP_Post && $this->getWpPost()->post_type == Brizy_Admin_Blocks_Main::CP_GLOBAL;
	}

	public function isSavedBlock() {
		return $this->getWpPost() instanceof WP_Post && $this->getWpPost()->post_type == Brizy_Admin_Blocks_Main::CP_SAVED;
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

		$data['cloudId']        = $this->getCloudId();
		$data['cloudAccountId'] = $this->getCloudAccountId();
		$data['media']          = $this->getMedia();

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

		$ruleManager = new Brizy_Admin_Rules_Manager();
		$this->setRules( $ruleManager->getRules( $this->getWpPostId() ) );

		if ( isset( $storage_post['cloudId'] ) ) {
			$this->setCloudId( $storage_post['cloudId'] );
		}
		if ( isset( $storage_post['cloudAccountId'] ) ) {
			$this->setCloudAccountId( $storage_post['cloudAccountId'] );
		}

		if ( isset( $storage_post['position'] ) ) {
			$this->position = $storage_post['position'];
		}

	}

	public function convertToOptionValue() {
		$data = parent::convertToOptionValue();

		$ruleManager = new Brizy_Admin_Rules_Manager();

		$data['position']       = $this->getPosition();
		$data['cloudId']        = $this->getCloudId();
		$data['cloudAccountId'] = $this->getCloudAccountId();
		$data['media']          = $this->getMedia();
		$data['rules']          = $ruleManager->getRules( $this->getWpPostId() );

		if ( $this->isSavedBlock() ) {
			$data['synchronized']   = $this->isSynchronized( Brizy_Editor_Project::get()->getCloudAccountId() );
			$data['synchronizable'] = $this->isSynchronizable();
		}

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
		$autosave->setRules( $this->getRules() );

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
