<?php


class Brizy_Admin_Blocks_Manager extends Brizy_Admin_Entity_AbstractManager {

	/**
	 * @var
	 */
	private $blockType;

	/**
	 * Brizy_Admin_Blocks_Manager constructor.
	 *
	 * @param $type
	 *
	 * @throws Exception
	 */
	public function __construct( $type ) {
		if ( ! in_array( $type, [ Brizy_Admin_Blocks_Main::CP_GLOBAL, Brizy_Admin_Blocks_Main::CP_SAVED ] ) ) {
			throw new Exception();
		}

		$this->blockType = $type;
	}

	/**
	 * @param $args
	 *
	 * @return Brizy_Editor_Block[]
	 * @throws Exception
	 */
	public function getEntities( $args ) {
		return $this->getEntitiesByType( $this->blockType, $args );
	}

	/**
	 * @param $uid
	 *
	 * @return Brizy_Editor_Block|array
	 * @throws Exception
	 */
	public function getEntity( $uid ) {
		return $this->getEntityUidAndType( $uid, $this->blockType );
	}

	/**
	 * @param $uid
	 * @param string $status
	 *
	 * @return mixed|null+
	 */
	public function createEntity( $uid, $status = 'publish' ) {
		return $this->createEntityByType( $uid, $this->blockType, $status );
	}

	/**
	 * @param $post
	 * @param null $uid
	 *
	 * @return Brizy_Editor_Block|Brizy_Editor_Post|mixed$uid
	 * @throws Exception
	 */
	protected function convertWpPostToEntity( $post, $uid = null ) {
		return Brizy_Editor_Block::get( $post, $uid );
	}

//=====================================================================
//=====================================================================
//=====================================================================
//=====================================================================
//=====================================================================
//=====================================================================


	public function getBlockByUid( $type, $uid ) {
		$block    = $this->getLocalBlock( $type, $uid );
		$versions = $this->cloud->getCloudEditorVersions();

		if ( ! $block && $this->cloud && $type == Brizy_Admin_Blocks_Main::CP_SAVED && $versions['sync'] == BRIZY_SYNC_VERSION ) {
			$bridge = new Brizy_Admin_Cloud_BlockBridge( $this->cloud );
			$bridge->import( $uid );

			$block = $this->getLocalBlock( $type, $uid );
		}

		return $block;
	}

	/**
	 * @param $type
	 * @param array $arags
	 * @param array $fields
	 *
	 * @return array
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public function getLocalBlocks( $type, $arags = array(), $fields = array() ) {
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
			$blocks[] = Brizy_Editor_Block::get( $wpPost )->createResponse( $fields );
		}

		return $blocks;
	}

	/**
	 * @param $type
	 * @param $uid
	 *
	 * @return array|null
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public function getLocalBlock( $type, $uid ) {
		$blocks = get_posts( array(
			'post_type'   => $type,
			'post_status' => 'publish',
			'meta_key'    => 'brizy_post_uid',
			'meta_value'  => $uid,
			'numberposts' => - 1,
			'orderby'     => 'ID',
			'order'       => 'DESC',
		) );

		if ( isset( $blocks[0] ) ) {
			$block = \Brizy_Editor_Block::get( $blocks[0] )->createResponse();
		} else {
			$block = null;
		}

		return $block;
	}
}
