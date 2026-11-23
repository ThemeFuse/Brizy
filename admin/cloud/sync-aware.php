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

	/**
	 * @param int $limit
	 * @param bool $throwException
	 * @param bool $retryWaiting True for a sync requested by the user: the uploads that wait for
	 *                           a retry are attempted now. Rejected ones are skipped either way.
	 *
	 * @return int[]
	 * @throws Exception
	 */
	protected function syncLayouts( $limit = 0, $throwException = false, $retryWaiting = false ) {
		$layoutIds    = $this->getLayoutsForSync( $limit, $retryWaiting );
		$synchronized = [];
		foreach ( $layoutIds as $lId ) {
			try {
				if ( $this->syncLayout( $lId->ID ) ) {
					$synchronized[] = $lId->ID;
				}
			} catch ( \Throwable $e ) {
				// Throwable, not Exception: a PHP error must be recorded too, or the same post is picked forever
				Brizy_Logger::instance()->critical( 'Failed to sync layout',
					[
						'blockId' => $lId->ID,
						$e
					] );
				$this->recordSyncFailure( $lId->ID, $e );

				if ( $throwException ) {
					throw $e;
				}
			}
		}

		return $synchronized;
	}

	/**
	 * @see syncLayouts()
	 */
	protected function syncBlocks( $limit = 0, $throwException = false, $retryWaiting = false ) {
		$postIds      = $this->getBlocksForSync( $limit, $retryWaiting );
		$synchronized = [];
		foreach ( $postIds as $block ) {
			try {
				if ( $this->syncBlock( $block->ID ) ) {
					$synchronized[] = $block->ID;
				}
			} catch ( \Throwable $e ) {
				Brizy_Logger::instance()->critical( 'Failed to sync block',
					[
						'blockId' => $block->ID,
						$e
					] );
				$this->recordSyncFailure( $block->ID, $e );

				if ( $throwException ) {
					throw $e;
				}
			}
		}

		return $synchronized;
	}

	protected function syncBlock( $blockId ) {
		return $this->syncEntity( Brizy_Editor_Block::get( $blockId ), new Brizy_Admin_Cloud_BlockBridge( $this->client ) );
	}

	protected function syncLayout( $layoutId ) {
		return $this->syncEntity( Brizy_Editor_Layout::get( $layoutId ), new Brizy_Admin_Cloud_LayoutBridge( $this->client ) );
	}

	/**
	 * Exports the entity to the cloud. A failure is recorded by the caller, so it is not
	 * repeated on every run (see Brizy_Admin_Cloud_SyncState).
	 *
	 * @param Brizy_Editor_Block|Brizy_Editor_Layout $entity
	 * @param Brizy_Admin_Cloud_AbstractBridge $bridge
	 *
	 * @return bool|null
	 * @throws Exception
	 */
	private function syncEntity( $entity, $bridge ) {
		$cloudAccountId = $this->getClient()->getBrizyProject()->getCloudAccountId();

		if ( ! $entity ||
		     ! $entity->isSynchronizable( $cloudAccountId ) ||
		     $entity->isSynchronized( $cloudAccountId ) ) {
			return null;
		}

		// Recorded before the export: a run that dies in it (timeout, out of memory) cannot report
		// the failure, and the post would be picked again by every run.
		Brizy_Admin_Cloud_SyncState::recordAttempt( $entity->getWpPostId(), $cloudAccountId );

		$bridge->export( $entity );

		if ( ! $entity->isSynchronized( $cloudAccountId ) ) {
			throw new Brizy_Admin_Cloud_UploadException( 'The cloud did not confirm the upload' );
		}

		Brizy_Admin_Cloud_SyncState::clear( $entity->getWpPostId(), $cloudAccountId );

		return true;
	}

	/**
	 * Any failure is recorded, including one raised while loading the entity, so the post is
	 * skipped by the next runs instead of blocking the ones after it.
	 *
	 * @param int $postId
	 * @param \Throwable $exception
	 */
	private function recordSyncFailure( $postId, $exception ) {
		Brizy_Admin_Cloud_SyncState::recordFailure(
			$postId,
			$this->getClient()->getBrizyProject()->getCloudAccountId(),
			$exception
		);
	}

	protected function getLayoutsForSync( $limit = 0, $retryWaiting = false ) {
		return $this->getPostsForSync( Brizy_Admin_Layouts_Main::CP_LAYOUT, $limit, $retryWaiting );
	}

	protected function getBlocksForSync( $limit = 0, $retryWaiting = false ) {
		return $this->getPostsForSync( Brizy_Admin_Blocks_Main::CP_SAVED, $limit, $retryWaiting );
	}

	/**
	 * Counts the layouts and blocks that are still not in the cloud account after a sync.
	 *
	 * @return array rejected: refused by the cloud, not uploaded again until they change;
	 *               failed: the upload failed and will be retried.
	 */
	protected function getUnsynchronizedSummary() {
		$summary = array( 'rejected' => 0, 'failed' => 0 );
		foreach ( array( Brizy_Admin_Layouts_Main::CP_LAYOUT, Brizy_Admin_Blocks_Main::CP_SAVED ) as $postType ) {
			foreach ( $this->getUnsynchronizedPosts( $postType ) as $post ) {
				$summary[ $post->rejected ? 'rejected' : 'failed' ] ++;
			}
		}

		return $summary;
	}

	/**
	 * Returns the posts that still have to be exported to the current cloud account.
	 *
	 * Posts whose upload was rejected, or failed and is not due for a retry, are left out,
	 * otherwise a limited run would look at the same rows forever.
	 *
	 * @param string $postType
	 * @param int $limit
	 * @param bool $retryWaiting Include the posts that wait for a retry.
	 *
	 * @return object[] Objects with the ID property.
	 */
	private function getPostsForSync( $postType, $limit = 0, $retryWaiting = false ) {
		$posts = array();
		foreach ( $this->getUnsynchronizedPosts( $postType ) as $post ) {
			if ( $post->rejected || ( $post->waiting && ! $retryWaiting ) ) {
				continue;
			}

			$posts[] = $post;

			if ( $limit !== 0 && count( $posts ) >= (int) $limit ) {
				break;
			}
		}

		return $posts;
	}

	/**
	 * Returns the synchronizable posts that are not in the current cloud account yet, trashed
	 * ones excluded, with the outcome of their last upload.
	 *
	 * @param string $postType
	 *
	 * @return object[] Objects with the ID, rejected and waiting properties.
	 */
	private function getUnsynchronizedPosts( $postType ) {
		global $wpdb;

		// One query for everything the selection needs: reading the meta through get_post_meta()
		// would load all the meta of every block or layout, the editor data included.
		$rows = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT p.ID,
						MAX(s.meta_value) AS synchronized_with,
						MAX(f.meta_value) AS failure,
						MAX(v.meta_value) AS data_version
					FROM {$wpdb->posts} p
					JOIN {$wpdb->postmeta} pm ON pm.post_id = p.ID AND pm.meta_key = 'brizy-media'
					LEFT JOIN {$wpdb->postmeta} s ON s.post_id = p.ID AND s.meta_key = 'brizy-cloud-synchronised-with'
					LEFT JOIN {$wpdb->postmeta} f ON f.post_id = p.ID AND f.meta_key = %s
					LEFT JOIN {$wpdb->postmeta} v ON v.post_id = p.ID AND v.meta_key = %s
					WHERE p.post_type = %s AND p.post_status <> 'trash'
					GROUP BY p.ID
					ORDER BY p.ID",
				Brizy_Admin_Cloud_SyncState::META_KEY,
				Brizy_Editor_Entity::BRIZY_DATA_VERSION_KEY,
				$postType
			)
		);

		$cloudAccountId = $this->getClient()->getBrizyProject()->getCloudAccountId();
		$posts          = array();
		foreach ( $rows as $row ) {
			$synchronizedWith = maybe_unserialize( $row->synchronized_with );
			if ( is_array( $synchronizedWith ) && isset( $synchronizedWith[ $cloudAccountId ] ) ) {
				continue;
			}

			$failure     = maybe_unserialize( $row->failure );
			$dataVersion = (int) $row->data_version;
			$rejected    = Brizy_Admin_Cloud_SyncState::isStateFinal( $failure, $cloudAccountId, $dataVersion );

			$posts[] = (object) array(
				'ID'       => (int) $row->ID,
				'rejected' => $rejected,
				'waiting'  => ! $rejected && Brizy_Admin_Cloud_SyncState::isStateBlocked( $failure, $cloudAccountId, $dataVersion ),
			);
		}

		return $posts;
	}
}
