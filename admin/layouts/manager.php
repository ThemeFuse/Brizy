<?php

class Brizy_Admin_Layouts_Manager extends Brizy_Admin_Entity_AbstractManager {

	/**
	 * @var string
	 */
	private $blockType;

	/**
	 * Brizy_Admin_Layouts_Manager constructor.
	 *
	 * @throws Exception
	 */
	public function __construct() {
		$this->blockType = Brizy_Admin_Layouts_Main::CP_LAYOUT;
	}

	/**
	 * @param $args
	 *
	 * @return Brizy_Editor_Layout[]
	 * @throws Exception
	 */
	public function getEntities( $args ) {
		return $this->getEntitiesByType( $this->blockType, $args );
	}

	/**
	 * @param $uid
	 *
	 * @return Brizy_Editor_Layout
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
	 * @return Brizy_Editor_Layout|Brizy_Editor_Post|mixed$uid
	 * @throws Exception
	 */
	protected function convertWpPostToEntity( $post, $uid = null ) {
		return Brizy_Editor_Layout::get( $post, $uid );
	}

//=====================================================================
//=====================================================================
//=====================================================================
//=====================================================================
//=====================================================================
//=====================================================================


//	/**
//	 * @param $type
//	 * @param $arags
//	 * @param array $fields
//	 *
//	 * @return array
//	 * @throws Brizy_Editor_Exceptions_NotFound
//	 */
//	public function getAllLayouts( $arags, $fields = array() ) {
//		$layouts = [];
//		try {
//			$layouts = $this->getLocalLayouts( $arags, $fields );
//
//			$versions    = $this->cloud->getCloudEditorVersions();
//			$cloudBlocks = $this->cloud->getLayouts( array( 'fields' => array( 'uid', 'meta' ) ) );
//
//			if ( $this->cloud && $versions['sync'] == BRIZY_SYNC_VERSION ) {
//
//				foreach ( (array) $cloudBlocks as $cblock ) {
//					$existingBlock = false;
//					foreach ( $layouts as $block ) {
//						if ( $cblock->uid == $block['uid'] ) {
//							$existingBlock = true;
//						}
//					}
//
//					if ( ! $existingBlock ) {
//						$localLayout = $this->getLayoutByUid( $cblock->uid );
//
//						if ( $localLayout ) {
//							$cblock->synchronized = $localLayout->isSynchronized( $this->cloud->getBrizyProject()->getCloudAccountId() );
//						} else {
//							$cblock->synchronized = false;
//						}
//
//						if ( in_array( 'isCloudEntity', $fields ) ) {
//							$cblock->isCloudEntity = true;
//						}
//
//						if ( in_array( 'synchronizable', $fields ) ) {
//							$cblock->synchronizable = true;
//						}
//
//						$cblock->synchronizable = true;
//						$layouts[]              = (array) $cblock;
//					}
//				}
//			}
//		} catch ( Exception $e ) {
//
//		}
//
//		return $layouts;
//	}

//	/**
//	 * @param $uid
//	 * @param array $fields
//	 *
//	 * @return array|mixed|null
//	 * @throws Exception
//	 */
//	public function getLayoutByUid( $uid, $fields = array() ) {
//
//		$layout   = $this->getLocalLayout( $uid, $fields );
//		$versions = $this->cloud->getCloudEditorVersions();
//
//		if ( ! $layout && $this->cloud && $versions['sync'] == BRIZY_SYNC_VERSION ) {
//			$bridge = new Brizy_Admin_Cloud_LayoutBridge( $this->cloud );
//			$bridge->import( $uid );
//
//			$layout = $this->getLocalLayout( $uid, $fields );
//		}
//
//		return $layout;
//	}
//
//
//	/**
//	 * @param array $arags
//	 * @param array $fields
//	 *
//	 * @return array
//	 * @throws Exception
//	 */
//	public function getLocalLayouts( $arags = array(), $fields = array() ) {
//		$filterArgs = array(
//			'post_type'      => Brizy_Admin_Layouts_Main::CP_LAYOUT,
//			'posts_per_page' => - 1,
//			'post_status'    => 'any',
//			'orderby'        => 'ID',
//			'order'          => 'ASC',
//		);
//		$filterArgs = array_merge( $filterArgs, $arags );
//
//		$wpBlocks = get_posts( $filterArgs );
//		$layouts  = array();
//
//		foreach ( $wpBlocks as $wpPost ) {
//			$layouts[] = \Brizy_Editor_Layout::get( $wpPost )->createResponse( $fields );
//		}
//
//		return $layouts;
//	}

//	/**
//	 * @param $uid
//	 * @param array $fields
//	 *
//	 * @return array|mixed|null
//	 * @throws Exception
//	 */
//	public function getLocalLayout( $uid, $fields = array() ) {
//		$blocks = get_posts( array(
//			'post_type'   => Brizy_Admin_Layouts_Main::CP_LAYOUT,
//			'post_status' => 'publish',
//			'meta_key'    => 'brizy_post_uid',
//			'meta_value'  => $uid,
//			'numberposts' => - 1,
//			'orderby'     => 'ID',
//			'order'       => 'DESC',
//		) );
//
//		if ( isset( $blocks[0] ) ) {
//			$block = \Brizy_Editor_Layout::get( $blocks[0] )->createResponse( $fields );
//		} else {
//			$block = null;
//		}
//
//		return $block;
//	}
}
