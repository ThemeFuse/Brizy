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

	protected function syncLayouts( $limit = 0, $throwException = false ) {
		$layoutIds    = $this->getLayoutsForSync( $limit );
		$synchronized = [];
		foreach ( $layoutIds as $lId ) {
			try {
				if ( $this->syncLayout( $lId->ID ) ) {
					$synchronized[] = $lId->ID;
				}
			} catch ( Exception $e ) {
				Brizy_Logger::instance()->critical( 'Failed to sync layout',
					[
						'blockId' => $lId->ID,
						$e
					] );

				if ( $throwException ) {
					throw $e;
				}
			}
		}

		return $synchronized;
	}

	protected function syncBlocks( $limit = 0, $throwException = false ) {
		$postIds      = $this->getBlocksForSync( $limit );
		$synchronized = [];
		foreach ( $postIds as $block ) {
			try {
				if ( $this->syncBlock( $block->ID ) ) {
					$synchronized[] = $block->ID;
				}
			} catch ( Exception $e ) {
				Brizy_Logger::instance()->critical( 'Failed to sync block',
					[
						'blockId' => $block->ID
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

		$cloud_account_id = $this->getClient()->getBrizyProject()->getCloudAccountId();
		if ( $brizyBlock &&
		     $brizyBlock->isSynchronizable( $cloud_account_id ) &&
		     !$brizyBlock->isSynchronized( $cloud_account_id ) ) {
			$updater = new Brizy_Admin_Cloud_BlockBridge( $this->client );
			$updater->export( $brizyBlock );

			return true;
		}

	}

	protected function syncLayout( $layoutId ) {

		$brizyLayout = Brizy_Editor_Layout::get( $layoutId );
		$cloud_account_id = $this->getClient()->getBrizyProject()->getCloudAccountId();
		if ( $brizyLayout &&
		     $brizyLayout->isSynchronizable( $cloud_account_id ) &&
		     !$brizyLayout->isSynchronized( $cloud_account_id ) ) {
			$updater = new Brizy_Admin_Cloud_LayoutBridge( $this->client );
			$updater->export( $brizyLayout );

			return true;
		}
	}

	protected function getLayoutsForSync( $limit = 0 ) {
		global $wpdb;

		$savedBlockType = Brizy_Admin_Layouts_Main::CP_LAYOUT;

		$limitQuery = "";
		if ( $limit !== 0 ) {
			$limitQuery = " LIMIT " . ( (int) $limit );
		}

		$postIds = $wpdb->get_results(
			"SELECT ID FROM {$wpdb->posts} p 
					WHERE p.post_type='{$savedBlockType}'
					{$limitQuery}" );

		return $postIds;
	}


	protected function getBlocksForSync( $limit = 0 ) {
		global $wpdb;

		$savedBlockType = Brizy_Admin_Blocks_Main::CP_SAVED;

		$limitQuery = "";
		if ( $limit !== 0 ) {
			$limitQuery = " LIMIT " . ( (int) $limit );
		}

		$postIds = $wpdb->get_results(
			"SELECT ID FROM {$wpdb->posts} p 
					WHERE p.post_type='{$savedBlockType}'
					{$limitQuery}
					"
		);

		return $postIds;
	}
}
