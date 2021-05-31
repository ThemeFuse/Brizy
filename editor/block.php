<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 1/18/19
 * Time: 12:20 PM
 */


class Brizy_Editor_Block extends Brizy_Editor_Post {


	use Brizy_Editor_AutoSaveAware, Brizy_Editor_Synchronizable;

	const BRIZY_META = 'brizy-meta';
	const BRIZY_MEDIA = 'brizy-media';
	const BRIZY_POSITION = 'brizy-position';

	/**
	 * @var Brizy_Editor_BlockPosition
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
		self::$block_instance = array();
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
				'synchronizable',
				'isCloudEntity'
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

			if ( in_array( 'isCloudEntity', $fields ) ) {
				$global['isCloudEntity'] = false;
			}

			if ( in_array( 'synchronized', $fields ) ) {
				$global['synchronized'] = $this->isSynchronized( Brizy_Editor_Project::get()->getCloudAccountId() );
			}

			if ( in_array( 'synchronizable', $fields ) ) {
				$global['synchronizable'] = $this->isSynchronizable( Brizy_Editor_Project::get()->getCloudAccountId() );
			}
		}

		if ( $this->getWpPost()->post_type == Brizy_Admin_Blocks_Main::CP_GLOBAL ) {
			if ( in_array( 'position', $fields ) && $this->getPosition() ) {
				$global['position'] = $this->getPosition()->convertToOptionValue();
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
		parent::set_uses_editor(true);
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

	public function jsonSerialize() {
		$data                = get_object_vars( $this );
		$data['editor_data'] = base64_decode( $data['editor_data'] );
		$data['rules']       = [];

		$ruleManager = new Brizy_Admin_Rules_Manager();

		$rules = $ruleManager->getRules( $this->getWpPostId() );
		foreach ( $rules as $rule ) {
			$data['rules'][] = $rule->jsonSerialize();
		}


		$data['position'] = null;

		if ( $this->getPosition() ) {
			$data['position'] = $this->getPosition()->jsonSerialize();
		}

		$data['meta']  = $this->getMeta();
		$data['media'] = $this->getMedia();
		//$data['cloudId']        = $this->getCloudId();
		//$data['cloudAccountId'] = $this->getCloudAccountId();
		unset( $data['wp_post'] );

		return $data;
	}

	public function loadInstanceData() {
		parent::loadInstanceData();
		$storage      = $this->getStorage();
		$storage_post = $storage->get( self::BRIZY_POST, false );

		$this->position = null;

		$ruleManager = new Brizy_Admin_Rules_Manager();
		$this->setRules( $ruleManager->getRules( $this->getWpPostId() ) );

		// load synchronisation data
		$this->loadSynchronizationData();

		// back compatibility with old sync data
		if ( isset( $storage_post['cloudId'] ) && isset( $storage_post['cloudAccountId'] ) ) {
			$this->setSynchronized( $storage_post['cloudAccountId'], $storage_post['cloudId'] );
		}

		$this->setPosition( Brizy_Editor_BlockPosition::createFromSerializedData( get_metadata( 'post', $this->getWpPostId(), self::BRIZY_POSITION, true ) ) );

		$this->meta  = get_metadata( 'post', $this->getWpPostId(), self::BRIZY_META, true );
		$this->media = get_metadata( 'post', $this->getWpPostId(), self::BRIZY_MEDIA, true );
	}

	public function convertToOptionValue() {

		$data = parent::convertToOptionValue();

		$ruleManager = new Brizy_Admin_Rules_Manager();

		$data['position'] = null;
		$data['rules']    = [];

		if ( $this->getPosition() ) {
			$data['position'] = $this->getPosition()->convertToOptionValue();
		}

		$rules = $ruleManager->getRules( $this->getWpPostId() );
		foreach ( $rules as $rule ) {
			$data['rules'][] = $rule->convertToOptionValue();
		}

		//$data['cloudId']        = $this->getCloudId();
		//$data['cloudAccountId'] = $this->getCloudAccountId();
		$data['media'] = $this->getMedia();

		if ( $this->isSavedBlock() ) {
			$data['synchronized']   = $this->isSynchronized( Brizy_Editor_Project::get()->getCloudAccountId() );
			$data['synchronizable'] = $this->isSynchronizable( Brizy_Editor_Project::get()->getCloudAccountId() );
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

		//$autosave->setPosition( $this->getPosition() );
		//$autosave->setRules( $this->getRules() );

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
			$this->savePost( true );

			do_action( 'brizy_global_data_updated' );
		}
	}

	/**
	 * This will take all values from entity and save them to database
	 */
	public function saveStorage() {
		parent::saveStorage();
		// save position
		if ( $this->position instanceof Brizy_Editor_BlockPosition ) {
			update_metadata( 'post', $this->getWpPostId(), self::BRIZY_POSITION, $this->position->convertToOptionValue() );
		}

		update_metadata( 'post', $this->getWpPostId(), self::BRIZY_META, $this->meta );
		update_metadata( 'post', $this->getWpPostId(), self::BRIZY_MEDIA, $this->media );
	}

    /**
     * @return $this|Brizy_Editor_Block
     * @throws Brizy_Editor_Exceptions_DataVersionMismatch
     */
    protected function saveDataVersion()
    {
        // cyheck data version except for global blocks
        // issue: #14271
        if(Brizy_Admin_Blocks_Main::CP_GLOBAL !== $this->getWpPost()->post_type) {
            parent::saveDataVersion();
        }

        return $this;
    }

}
