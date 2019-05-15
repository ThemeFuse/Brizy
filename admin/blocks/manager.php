<?php

class Brizy_Admin_Blocks_Manager {

	/**
	 * @var \Brizy_Admin_Cloud_Client
	 */
	private $cloud;

	public function __construct( \Brizy_Admin_Cloud_Client $cloudApi = null ) {
		$this->cloud = $cloudApi;
	}

	public function getAllBlocks( $type, $arags, $fields = array() ) {

		$blocks = $this->getLocalBlocks( $type, $arags, $fields );

		if ( $this->cloud && $type == Brizy_Admin_Blocks_Main::CP_SAVED ) {
			$cloudBlocks = $this->cloud->getBlocks( array( 'fields' => $fields ) );

			foreach ( (array) $cloudBlocks as $cblock ) {
				$existingBlock = false;
				foreach ( $blocks as $block ) {
					if ( $cblock['uid'] == $block['uid'] ) {
						$existingBlock = true;
					}
				}

				if ( ! $existingBlock ) {
					$blocks[] = $cblock;
				}
			}
		}

		return $blocks;
	}

	public function getBlockByUid( $type, $uid ) {
		$block = $this->getLocalBlock( $type, $uid );

		if ( ! $block && $this->cloud && $type == Brizy_Admin_Blocks_Main::CP_SAVED ) {
			$blocks = $this->cloud->getBlocks( [ 'filter' => [ 'uid' => $uid ] ] );
			if ( isset( $blocks[0] ) ) {

				$bridge = new Brizy_Admin_Cloud_BlockBridge( $this->cloud );
				$bridge->import( $blocks[0]['uid'] );

				$block = $blocks[0];
			}
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
			$blocks[] = \Brizy_Editor_Block::get( $wpPost )->createResponse( $fields );
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