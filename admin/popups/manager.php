<?php

class Brizy_Admin_Popups_Manager {

	/**
	 * @var \Brizy_Admin_Cloud_Client
	 */
	private $cloud;

	public function __construct( \Brizy_Admin_Cloud_Client $cloudApi = null ) {
		$this->cloud = $cloudApi;
	}

	/**
	 * @param $type
	 * @param $arags
	 * @param array $fields
	 *
	 * @return array
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public function getAllPopups( $type, $arags, $fields = array() ) {

		$blocks = $this->getLocalPopups( $type, $arags, $fields );

		if ( $this->cloud && $type == Brizy_Admin_Popups_Main::CP_SAVED_POPUP ) {
			$cloudBlocks = $this->cloud->getPopups( array( 'fields' => array( 'uid', 'meta' ) ) );

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

	/**
	 * @param $type
	 * @param array $arags
	 * @param array $fields
	 *
	 * @return array
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public function getLocalPopups( $type, $arags = array(), $fields = array() ) {
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
			$blocks[] = Brizy_Editor_Block::postData( \Brizy_Editor_Block::get( $wpPost ), $fields );
		}

		return $blocks;
	}

}