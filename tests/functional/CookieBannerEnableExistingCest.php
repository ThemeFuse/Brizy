<?php

class CookieBannerEnableExistingCest {

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
	 * A banner block the user has customized: own title, editor data, meta, position and rules.
	 *
	 * @param FunctionalTester $I
	 * @param string $status
	 *
	 * @return int
	 */
	private function haveCustomizedBanner( FunctionalTester $I, $status ) {
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

		$pageId = $I->havePostInDatabase( [ 'post_type' => 'page', 'post_title' => 'Page X', 'post_status' => 'publish' ] );
		$this->rulesManager->setRules( $id, [
			new Brizy_Admin_Rule( null, Brizy_Admin_Rule::TYPE_INCLUDE, Brizy_Admin_Rule::POSTS, 'page', [ $pageId ] ),
		] );

		$fields = [ 'post_status' => $status ];
		if ( $status === 'future' ) {
			$fields['post_date']     = date( 'Y-m-d H:i:s', current_time( 'timestamp' ) + DAY_IN_SECONDS );
			$fields['post_date_gmt'] = gmdate( 'Y-m-d H:i:s', time() + DAY_IN_SECONDS );
		}
		$I->updateInDatabase( $I->grabPostsTableName(), $fields, [ 'ID' => $id ] );

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
	private function assertEnableRestoresAndKeepsContent( FunctionalTester $I, $status ) {
		$id     = $this->haveCustomizedBanner( $I, $status );
		$before = $this->snapshot( $id );

		$I->assertSame( $status, get_post_status( $id ), 'The fixture should start in the given status' );

		$result = $this->banner->enable();
		$after  = $this->snapshot( $id );

		$I->assertTrue( $result, 'Enable should report success' );
		$I->assertSame( [ $id ], $this->bannerIds(), 'Enable should create no new block' );
		$I->assertSame( 'publish', get_post_status( $id ), 'The block should be published' );
		$I->assertSame( $before['title'], $after['title'], 'The title should be kept' );
		$I->assertSame( $before['data'], $after['data'], 'The editor data should be kept' );
		$I->assertSame( $before['meta'], $after['meta'], 'The meta should be kept' );
		$I->assertSame( $before['position'], $after['position'], 'The position should be kept' );

		$rules = $this->rulesManager->getRules( $id );
		$I->assertCount( 1, $rules, 'The custom rules should be replaced' );
		$I->assertSame( Brizy_Admin_Rule::TYPE_INCLUDE, $rules[0]->getType() );
		$I->assertNull( $rules[0]->getAppliedFor() );
		$I->assertSame( '', $rules[0]->getEntityType() );
		$I->assertSame( [], $rules[0]->getEntityValues() );

		$manager = new Brizy_Admin_Blocks_Manager( Brizy_Admin_Blocks_Main::CP_GLOBAL );
		$uids    = array_map( function ( $block ) {
			return $block->getUid();
		}, $manager->getEntities( [ 'post_status' => 'any', 'order' => 'DESC', 'orderby' => 'ID' ] ) );
		$I->assertContains( $this->banner->getUid(), $uids, 'The block should be in the editor global block list' );
	}

	/**
	 * A trashed banner counts as existing: it is restored, never duplicated.
	 *
	 * @param FunctionalTester $I
	 */
	public function testEnableRestoresATrashedBlock( FunctionalTester $I ) {
		$this->assertEnableRestoresAndKeepsContent( $I, 'trash' );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testEnableRestoresADraftBlock( FunctionalTester $I ) {
		$this->assertEnableRestoresAndKeepsContent( $I, 'draft' );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testEnableRestoresAPendingBlock( FunctionalTester $I ) {
		$this->assertEnableRestoresAndKeepsContent( $I, 'pending' );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testEnableRestoresAPrivateBlock( FunctionalTester $I ) {
		$this->assertEnableRestoresAndKeepsContent( $I, 'private' );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testEnableRestoresAScheduledBlock( FunctionalTester $I ) {
		$this->assertEnableRestoresAndKeepsContent( $I, 'future' );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testEnableKeepsAPublishedBlockPublished( FunctionalTester $I ) {
		$this->assertEnableRestoresAndKeepsContent( $I, 'publish' );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testEnableOnATrashedBlockRemovesTheTrashMarkers( FunctionalTester $I ) {
		$id = $this->haveCustomizedBanner( $I, 'trash' );

		$I->assertTrue( $this->banner->enable() );
		$this->resetCaches();

		$I->assertSame( '', get_post_meta( $id, '_wp_trash_meta_status', true ) );
		$I->assertSame( [ $id ], $this->bannerIds() );
	}
}
