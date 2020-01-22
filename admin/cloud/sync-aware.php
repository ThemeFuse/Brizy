<?php


trait Brizy_Admin_Cloud_SyncAware {

	/**
	 * @var Brizy_Admin_Cloud_Client
	 */
	protected $client;

	/**
	 * @return Brizy_Admin_Cloud_Client
	 */
	public function getClient() {
		return $this->client;
	}

	/**
	 * @param Brizy_Admin_Cloud_Client $client
	 *
	 * @return Brizy_Admin_Cloud_SyncAware
	 */
	public function setClient( $client ) {
		$this->client = $client;

		return $this;
	}

	protected function syncLayouts( $throwException = false ) {
		$layoutIds    = $this->getLayoutsForSync();
		$synchronized = [];
		foreach ( $layoutIds as $lId ) {
			try {
				if ( $this->syncLayout( $lId->ID ) ) {
					$synchronized[] = $lId->ID;
				}
			} catch ( Exception $e ) {
				Brizy_Logger::instance()->critical( 'Failed to sync layout',
					[
						'blockId' => $lId->ID
					] );

				if ( $throwException ) {
					throw $e;
				}
			}
		}

		return $synchronized;
	}

	protected function syncBlocks( $throwException = false ) {
		$postIds      = $this->getBlocksForSync();
		$synchronized = [];
		foreach ( $postIds as $blockId ) {
			try {
				if ( $this->syncBlock( $blockId->ID ) ) {
					$synchronized[] = $blockId->ID;
				}
			} catch ( Exception $e ) {
				Brizy_Logger::instance()->critical( 'Failed to sync block',
					[
						'blockId' => $blockId->ID
					] );

				if ( $throwException ) {
					throw $e;
				}
			}
		}

		return $synchronized;
	}

	protected function syncBlock( $blockId ) {

		$brizyBlock = Brizy_Editor_Block::get( $blockId );

		if ( $brizyBlock && $brizyBlock->isSavedBlock() ) {
			$updater = new Brizy_Admin_Cloud_BlockBridge( $this->client );
			$updater->export( $brizyBlock );
			return true;
		}

	}

	protected function syncLayout( $layoutId ) {

		$brizyLayout = Brizy_Editor_Layout::get( $layoutId );

		if ( $brizyLayout ) {
			$updater = new Brizy_Admin_Cloud_LayoutBridge( $this->client );
			$updater->export( $brizyLayout );
			return true;
		}
	}

	protected function getLayoutsForSync() {
		global $wpdb;

		$meta_key       = 'brizy-cloud-update-required';
		$savedBlockType = Brizy_Admin_Layouts_Main::CP_LAYOUT;

		$postIds = $wpdb->get_results(
			"SELECT ID FROM {$wpdb->posts} p 
					JOIN {$wpdb->postmeta} pm ON pm.post_id=p.ID and pm.meta_key='{$meta_key}' and pm.meta_value=1
					WHERE p.post_type='{$savedBlockType}'
					LIMIT 1" );

		return $postIds;
	}


	protected function getBlocksForSync() {
		global $wpdb;

		$meta_key       = 'brizy-cloud-update-required';
		$savedBlockType = Brizy_Admin_Blocks_Main::CP_SAVED;

		$postIds = $wpdb->get_results(
			"SELECT ID FROM {$wpdb->posts} p 
					JOIN {$wpdb->postmeta} pm ON pm.post_id=p.ID and pm.meta_key='{$meta_key}' and pm.meta_value=1
					WHERE p.post_type='{$savedBlockType}'
					LIMIT 1
					"
		);

		return $postIds;
	}
}
