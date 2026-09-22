<?php

class CookieBannerOutcomeCest {

	/**
	 * @var Brizy_Admin_Blocks_CookieBanner
	 */
	private $banner;

	/**
	 * @var Brizy_Admin_Rules_Manager
	 */
	private $rulesManager;

	/**
	 * @param FunctionalTester $I
	 */
	protected function _before( FunctionalTester $I ) {
		wp_cache_flush();
		wp_set_current_user( 1 );

		$I->dontHavePostInDatabase( [ 'post_type' => Brizy_Admin_Blocks_Main::CP_GLOBAL, ] );
		Brizy_Editor_Block::cleanClassCache();

		$this->banner       = new Brizy_Admin_Blocks_CookieBanner();
		$this->rulesManager = new Brizy_Admin_Rules_Manager();
	}

	/**
	 * @param FunctionalTester $I
	 * @param string $status
	 *
	 * @return int
	 */
	private function haveBanner( FunctionalTester $I, $status ) {
		$post = [
			'post_type'   => Brizy_Admin_Blocks_Main::CP_GLOBAL,
			'post_title'  => 'Cookie Banner',
			'post_status' => $status,
			'meta_input'  => [
				'brizy_post_uid' => $this->banner->getUid(),
			],
		];

		if ( $status === 'trash' ) {
			$post['meta_input']['_wp_trash_meta_status'] = 'publish';
			$post['meta_input']['_wp_trash_meta_time']   = time();
		}

		$id = $I->havePostInDatabase( $post );
		$this->resetCaches();

		return $id;
	}

	private function resetCaches() {
		wp_cache_flush();
		Brizy_Editor_Block::cleanClassCache();
	}

	/**
	 * Banner block ids in any status, trash included.
	 *
	 * @return int[]
	 */
	private function bannerIds() {
		global $wpdb;

		return array_map( 'intval', $wpdb->get_col( $wpdb->prepare(
			"SELECT p.ID FROM {$wpdb->posts} p INNER JOIN {$wpdb->postmeta} m ON m.post_id = p.ID AND m.meta_key = 'brizy_post_uid' WHERE m.meta_value = %s AND p.post_type = %s ORDER BY p.ID",
			$this->banner->getUid(),
			Brizy_Admin_Blocks_Main::CP_GLOBAL
		) ) );
	}

	/**
	 * @param FunctionalTester $I
	 * @param int $id
	 * @param int $type
	 */
	private function assertSingleMatchAllRule( FunctionalTester $I, $id, $type ) {
		$this->resetCaches();
		$rules = $this->rulesManager->getRules( $id );

		$I->assertCount( 1, $rules );
		$I->assertSame( $type, $rules[0]->getType() );
		$I->assertNull( $rules[0]->getAppliedFor() );
		$I->assertSame( '', $rules[0]->getEntityType() );
		$I->assertSame( [], $rules[0]->getEntityValues() );
	}

	/**
	 * Exactly one banner block, published, with the include-all rule set.
	 *
	 * @param FunctionalTester $I
	 */
	private function assertEnabledEndState( FunctionalTester $I ) {
		$ids = $this->bannerIds();

		$I->assertCount( 1, $ids, 'There should be exactly one banner block' );
		$this->resetCaches();
		$I->assertSame( 'publish', get_post_status( $ids[0] ) );
		$this->assertSingleMatchAllRule( $I, $ids[0], Brizy_Admin_Rule::TYPE_INCLUDE );
	}

	/**
	 * @param callable $callback
	 *
	 * @return mixed
	 */
	private function withRuleWritesFailing( $callback ) {
		$shortCircuit = function ( $check, $objectId, $metaKey ) {
			return $metaKey === 'brizy-rules' ? false : $check;
		};

		add_filter( 'update_post_metadata', $shortCircuit, 10, 3 );
		add_filter( 'add_post_metadata', $shortCircuit, 10, 3 );
		try {
			return call_user_func( $callback );
		} finally {
			remove_filter( 'update_post_metadata', $shortCircuit, 10 );
			remove_filter( 'add_post_metadata', $shortCircuit, 10 );
		}
	}

	/**
	 * Every post insert and update fails.
	 *
	 * @param callable $callback
	 *
	 * @return mixed
	 */
	private function withPostWritesFailing( $callback ) {
		add_filter( 'wp_insert_post_empty_content', '__return_true' );
		try {
			return call_user_func( $callback );
		} finally {
			remove_filter( 'wp_insert_post_empty_content', '__return_true' );
		}
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testEnableReportsFailureWhenTheBlockCannotBeCreated( FunctionalTester $I ) {
		$banner = $this->banner;
		$result = $this->withPostWritesFailing( function () use ( $banner ) {
			return $banner->enable();
		} );

		$I->assertTrue( is_bool( $result ) );
		$I->assertFalse( $result );
		$I->assertSame( [], $this->bannerIds(), 'No block should be left behind' );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testEnableReportsFailureWhenADraftBlockCannotBeRestored( FunctionalTester $I ) {
		$id     = $this->haveBanner( $I, 'draft' );
		$banner = $this->banner;
		$result = $this->withPostWritesFailing( function () use ( $banner ) {
			return $banner->enable();
		} );

		$this->resetCaches();
		$I->assertTrue( is_bool( $result ) );
		$I->assertFalse( $result );
		$I->assertSame( 'draft', get_post_status( $id ) );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testEnableReportsFailureWhenATrashedBlockCannotBeRestored( FunctionalTester $I ) {
		$id     = $this->haveBanner( $I, 'trash' );
		$banner = $this->banner;
		$result = $this->withPostWritesFailing( function () use ( $banner ) {
			return $banner->enable();
		} );

		$this->resetCaches();
		$I->assertFalse( $result );
		$I->assertSame( 'trash', get_post_status( $id ) );
		$I->assertSame( [ $id ], $this->bannerIds() );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testEnableReportsFailureWhenTheRulesCannotBeWritten( FunctionalTester $I ) {
		$id = $this->haveBanner( $I, 'publish' );
		$this->rulesManager->setRules( $id, $this->banner->excludeAllRules() );

		$banner = $this->banner;
		$result = $this->withRuleWritesFailing( function () use ( $banner ) {
			return $banner->enable();
		} );

		$I->assertTrue( is_bool( $result ) );
		$I->assertFalse( $result );
		$this->assertSingleMatchAllRule( $I, $id, Brizy_Admin_Rule::TYPE_EXCLUDE );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testDisableReportsFailureWhenTheRulesCannotBeWritten( FunctionalTester $I ) {
		$id = $this->haveBanner( $I, 'publish' );
		$this->rulesManager->setRules( $id, $this->banner->includeAllRules() );

		$banner = $this->banner;
		$result = $this->withRuleWritesFailing( function () use ( $banner ) {
			return $banner->disable();
		} );

		$I->assertTrue( is_bool( $result ) );
		$I->assertFalse( $result );
		$this->assertSingleMatchAllRule( $I, $id, Brizy_Admin_Rule::TYPE_INCLUDE );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testEnableAndDisableNeverThrow( FunctionalTester $I ) {
		foreach ( [ new Exception( 'lookup failed' ), new Error( 'lookup failed' ) ] as $error ) {
			$blocks        = new CookieBannerOutcomeCestThrowingBlocksManager( Brizy_Admin_Blocks_Main::CP_GLOBAL );
			$blocks->error = $error;
			$banner        = new Brizy_Admin_Blocks_CookieBanner( $blocks );

			$I->assertFalse( $banner->enable(), 'Enable should report the ' . get_class( $error ) . ' as failure' );
			$I->assertFalse( $banner->disable(), 'Disable should report the ' . get_class( $error ) . ' as failure' );
		}
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testRepeatedEnableConverges( FunctionalTester $I ) {
		$results = [ $this->banner->enable(), $this->banner->enable(), $this->banner->enable() ];

		$I->assertSame( [ true, true, true ], $results );
		$this->assertEnabledEndState( $I );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testToggleLoopKeepsAtMostOneBlock( FunctionalTester $I ) {
		$steps = [ 'enable', 'disable', 'trash', 'enable', 'disable', 'enable', 'draft', 'enable', 'disable', 'trash', 'disable', 'enable', 'private', 'enable', 'pending', 'disable', 'enable' ];

		foreach ( $steps as $step ) {
			if ( $step === 'enable' || $step === 'disable' ) {
				$result = $this->banner->$step();
				$I->assertTrue( is_bool( $result ) );
				$I->assertTrue( $result, "The {$step} step should succeed" );
			} else {
				$ids = $this->bannerIds();
				if ( $step === 'trash' ) {
					wp_trash_post( $ids[0] );
				} else {
					$I->updateInDatabase( $I->grabPostsTableName(), [ 'post_status' => $step ], [ 'ID' => $ids[0] ] );
				}
				$this->resetCaches();
			}

			$I->assertLessThanOrEqual( 1, count( $this->bannerIds() ), "At most one banner block after the {$step} step" );
		}

		$this->assertEnabledEndState( $I );
	}

	/**
	 * An enable that created the block but failed to write its rules is repaired by the next one.
	 *
	 * @param FunctionalTester $I
	 */
	public function testNextEnableRepairsAHalfCreatedBlock( FunctionalTester $I ) {
		$banner = $this->banner;
		$first  = $this->withRuleWritesFailing( function () use ( $banner ) {
			return $banner->enable();
		} );

		$I->assertFalse( $first, 'The first enable should report the failed rule write' );
		$I->assertCount( 1, $this->bannerIds(), 'The block was created' );

		$I->assertTrue( $this->banner->enable(), 'The next enable should succeed' );
		$this->assertEnabledEndState( $I );
	}
}

class CookieBannerOutcomeCestThrowingBlocksManager extends Brizy_Admin_Blocks_Manager {

	/**
	 * @var Throwable
	 */
	public $error;

	public function getEntities( $args ) {
		throw $this->error;
	}
}
