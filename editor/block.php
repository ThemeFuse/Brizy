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

	public function createResponse() {

		$data = array(
			'uid'    => $this->getUid(),
			'status' => get_post_status( $this->getWpPostId() ),
			'data'   => $this->get_editor_data(),
			'dataVersion'   => $this->getCurrentDataVersion(),
		);


		if ( $this->getWpPost()->post_type === Brizy_Admin_Blocks_Main::CP_GLOBAL ) {
			$ruleManager      = new Brizy_Admin_Rules_Manager();
			$data['position'] = $this->getPosition();
			$data['rules']    = $ruleManager->getRules( $this->getWpPostId() );
		}

		return $data;
	}


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

	/**
	 * @return mixed|string
	 */
	protected function createUid() {

		$post_parent_id = $this->getWpPostParentId();
		$uid            = get_post_meta( $post_parent_id, 'brizy_post_uid', true );

		if ( ! $uid && $this->uid ) {
			update_post_meta( $post_parent_id, 'brizy_post_uid', $this->uid );
		}

		if ( ! $this->uid && $uid ) {
			$this->uid = $uid;
		}

		return $this->uid;
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

		$data['rules']    = $ruleManager->getRules( $this->getWpPostId() );
		$data['position'] = $this->getPosition();

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
	}

	public function convertToOptionValue() {
		$data = parent::convertToOptionValue();

		$data['position'] = $this->getPosition();

		$ruleManager   = new Brizy_Admin_Rules_Manager();
		$data['rules'] = $ruleManager->getRules( $this->getWpPostId() );

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