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
		return $this->getPostsForSync( Brizy_Admin_Layouts_Main::CP_LAYOUT, $limit );
	}

	protected function getBlocksForSync( $limit = 0 ) {
		return $this->getPostsForSync( Brizy_Admin_Blocks_Main::CP_SAVED, $limit );
	}

	/**
	 * Returns the posts that still have to be exported to the current cloud account.
	 *
	 * Posts that are not synchronizable or are already synchronized are left out, otherwise a
	 * limited run would look at the same rows forever. A limited run picks random candidates
	 * so that a post that keeps failing does not block the rest.
	 *
	 * @param string $postType
	 * @param int $limit
	 *
	 * @return object[] Objects with the ID property.
	 */
	private function getPostsForSync( $postType, $limit = 0 ) {
		global $wpdb;

		$ids = $wpdb->get_col(
			$wpdb->prepare(
				"SELECT DISTINCT p.ID FROM {$wpdb->posts} p
					JOIN {$wpdb->postmeta} pm ON pm.post_id = p.ID AND pm.meta_key = 'brizy-media'
					WHERE p.post_type = %s
					ORDER BY p.ID",
				$postType
			)
		);

		$cloudAccountId = $this->getClient()->getBrizyProject()->getCloudAccountId();
		$posts          = array();
		foreach ( $ids as $id ) {
			$synchronizedWith = get_post_meta( $id, 'brizy-cloud-synchronised-with', true );
			if ( ! is_array( $synchronizedWith ) || ! isset( $synchronizedWith[ $cloudAccountId ] ) ) {
				$posts[] = (object) array( 'ID' => (int) $id );
			}
		}

		if ( $limit !== 0 ) {
			shuffle( $posts );
			$posts = array_slice( $posts, 0, (int) $limit );
		}

		return $posts;
	}
}
