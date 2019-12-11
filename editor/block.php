<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 1/18/19
 * Time: 12:20 PM
 */


class Brizy_Editor_Block extends Brizy_Editor_Post {

	use Brizy_Editor_AutoSaveAware;

	protected $position;

	static protected $block_instance = null;

	public static function cleanClassCache() {
		self::$instance = array();
	}

	/**
	 * @param $apost
	 *
	 * @return Brizy_Editor_Block|null
	 * @throws Brizy_Editor_Exceptions_NotFound
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

	public function setPosition( $position ) {
		$this->position = $position;

		return $this;
	}

	public function getPosition() {
		return $this->position;
	}

	public function jsonSerialize() {
		$data                = get_object_vars( $this );
		$data['editor_data'] = base64_decode( $data['editor_data'] );

		$ruleManager = new Brizy_Admin_Rules_Manager();

		$data['rules']    = $ruleManager->getRules( $this->get_id() );
		$data['position'] = $this->getPosition();

		unset( $data['wp_post'] );

		return $data;
	}

	public function loadStorageData( $data ) {
		parent::loadStorageData( $data );

		if ( isset( $data['position'] ) ) {
			$this->position = $data['position'];
		}
	}

	public function convertToOptionValue() {
		$data = parent::convertToOptionValue();

		$data['position'] = $this->getPosition();

		$ruleManager   = new Brizy_Admin_Rules_Manager();
		$data['rules'] = $ruleManager->getRules( $this->get_id() );

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
	 * @throws Brizy_Editor_Exceptions_NotFound
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
			$blocks[] = self::postData( Brizy_Editor_Block::get( $wpPost ) );
		}

		return $blocks;
	}


	/**
	 * @param Brizy_Editor_Block $post
	 *
	 * @return array
	 */
	public static function postData( Brizy_Editor_Block $post ) {

		$p_id        = (int) $post->get_id();
		$ruleManager = new Brizy_Admin_Rules_Manager();
		$global      = array(
			'uid'    => $post->get_uid(),
			'status' => get_post_status( $p_id ),
			'data'   => $post->get_editor_data(),
		);

		if ( $post->get_wp_post()->post_type == Brizy_Admin_Blocks_Main::CP_GLOBAL ) {
			$global['position'] = $post->getPosition();
			$global['rules']    = $ruleManager->getRules( $p_id );
		}

		return $global;
	}


}