<?php

class CookieBannerDisableCest {

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
	 * A customized banner block with the include-all rule set.
	 *
	 * @param FunctionalTester $I
	 * @param string $status
	 *
	 * @return int
	 */
	private function haveEnabledBanner( FunctionalTester $I, $status ) {
		$id = $I->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Blocks_Main::CP_GLOBAL,
			'post_title'  => 'My Cookie Banner',
			'post_status' => 'draft',
			'meta_input'  => [
				'brizy_post_uid' => $this->banner->getUid(),
			],
		] );
		$this->resetCaches();

		$block = Brizy_Editor_Block::get( $id );
		$block->setEditorData( '{"type":"CookieBanner","blockId":"CookieBanner","value":{"_id":"my-banner","items":[]}}' );
		$block->setMeta( '{"type":"overlay","subtype":"cookieBanner","extraFontStyles":[],"custom":true}' );
		$block->setPosition( Brizy_Editor_BlockPosition::createFromSerializedData( [ 'align' => 'top', 'top' => 10, 'bottom' => 20 ] ) );
		$block->setDependencies( [] );
		$block->save();

		$this->rulesManager->setRules( $id, $this->banner->includeAllRules() );

		$I->updateInDatabase( $I->grabPostsTableName(), [ 'post_status' => $status ], [ 'ID' => $id ] );
		if ( $status === 'trash' ) {
			$I->havePostmetaInDatabase( $id, '_wp_trash_meta_status', 'publish' );
			$I->havePostmetaInDatabase( $id, '_wp_trash_meta_time', time() );
		}

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
	 * @param int $id
	 *
	 * @return array
	 */
	private function snapshot( $id ) {
		$this->resetCaches();
		$block = Brizy_Editor_Block::get( $id );

		return [
			'status'   => get_post_status( $id ),
			'title'    => get_post_field( 'post_title', $id, 'raw' ),
			'data'     => $block->getEditorData( true ),
			'meta'     => $block->getMeta(),
			'position' => $block->getPosition()->convertToOptionValue(),
		];
	}

	/**
	 * @param FunctionalTester $I
	 * @param string $status
	 */
	private function assertDisableAppliesExcludeAllOnly( FunctionalTester $I, $status ) {
		$id     = $this->haveEnabledBanner( $I, $status );
		$before = $this->snapshot( $id );

		$I->assertSame( $status, $before['status'] );

		$result = $this->banner->disable();
		$after  = $this->snapshot( $id );

		$I->assertTrue( $result, 'Disable should report success' );

		$rules = $this->rulesManager->getRules( $id );
		$I->assertCount( 1, $rules );
		$I->assertSame( Brizy_Admin_Rule::TYPE_EXCLUDE, $rules[0]->getType() );
		$I->assertNull( $rules[0]->getAppliedFor() );
		$I->assertSame( '', $rules[0]->getEntityType() );
		$I->assertSame( [], $rules[0]->getEntityValues() );

		$I->assertSame( [ $id ], $this->bannerIds(), 'The block should not be deleted' );
		$I->assertSame( $before, $after, 'Status, title, editor data, meta and position should be unchanged' );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testDisableAPublishedBlock( FunctionalTester $I ) {
		$this->assertDisableAppliesExcludeAllOnly( $I, 'publish' );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testDisableADraftBlock( FunctionalTester $I ) {
		$this->assertDisableAppliesExcludeAllOnly( $I, 'draft' );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testDisableATrashedBlock( FunctionalTester $I ) {
		$this->assertDisableAppliesExcludeAllOnly( $I, 'trash' );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testDisableWithoutABlockCreatesNothingAndSucceeds( FunctionalTester $I ) {
		$I->assertSame( [], $this->bannerIds() );

		$inserted = 0;
		$counter  = function () use ( &$inserted ) {
			$inserted ++;
		};

		add_action( 'wp_insert_post', $counter );
		try {
			$result = $this->banner->disable();
		} finally {
			remove_action( 'wp_insert_post', $counter );
		}

		$I->assertTrue( $result, 'Disable with no block should report success' );
		$I->assertSame( [], $this->bannerIds(), 'Disable should not create a block' );
		$I->assertSame( 0, $inserted, 'Disable should not insert any post' );
	}
}
