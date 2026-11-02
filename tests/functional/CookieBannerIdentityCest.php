<?php

class CookieBannerIdentityCest {

	/**
	 * @param FunctionalTester $I
	 */
	protected function _before( FunctionalTester $I ) {
		wp_cache_flush();
		wp_set_current_user( 1 );

		$I->dontHavePostInDatabase( [ 'post_type' => Brizy_Admin_Blocks_Main::CP_GLOBAL, ] );

		Brizy_Editor_Block::cleanClassCache();
	}

	/**
	 * @param FunctionalTester $I
	 * @param string $uid
	 * @param string $status
	 *
	 * @return int
	 */
	private function haveGlobalBlock( FunctionalTester $I, $uid, $status = 'publish' ) {
		$post = [
			'post_type'   => Brizy_Admin_Blocks_Main::CP_GLOBAL,
			'post_title'  => 'Cookie Banner',
			'post_name'   => 'cookie-banner-' . $status,
			'post_status' => $status,
			'meta_input'  => [
				'brizy_post_uid' => $uid,
			],
		];

		if ( $status === 'trash' ) {
			$post['meta_input']['_wp_trash_meta_status'] = 'publish';
			$post['meta_input']['_wp_trash_meta_time']   = time();
		}

		if ( $status === 'future' ) {
			$post['post_date']     = date( 'Y-m-d H:i:s', time() + DAY_IN_SECONDS );
			$post['post_date_gmt'] = gmdate( 'Y-m-d H:i:s', time() + DAY_IN_SECONDS );
		}

		$id = $I->havePostInDatabase( $post );

		wp_cache_flush();
		Brizy_Editor_Block::cleanClassCache();

		return $id;
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testUidOnSingleSite( FunctionalTester $I ) {
		$banner = new Brizy_Admin_Blocks_CookieBanner();

		$I->assertSame( 1, get_current_blog_id(), 'The single-site install should run as blog 1' );
		$I->assertSame( 'brz-cookie-banner-1', $banner->getUid(), 'The single-site banner uid should be brz-cookie-banner-1' );
	}

	/**
	 * Simulates a multisite site by overriding the current blog id.
	 *
	 * @param FunctionalTester $I
	 */
	public function testUidUsesTheCurrentSiteId( FunctionalTester $I ) {
		$banner       = new Brizy_Admin_Blocks_CookieBanner();
		$originalBlog = $GLOBALS['blog_id'];

		try {
			$GLOBALS['blog_id'] = 7;
			$I->assertSame( 'brz-cookie-banner-7', $banner->getUid(), 'The banner uid should use the current site id' );

			$GLOBALS['blog_id'] = 12;
			$I->assertSame( 'brz-cookie-banner-12', $banner->getUid(), 'The banner uid should follow a site change' );
		} finally {
			$GLOBALS['blog_id'] = $originalBlog;
		}

		$I->assertSame( 'brz-cookie-banner-' . $originalBlog, $banner->getUid() );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testFindBlockOnlyReturnsTheCurrentSiteBanner( FunctionalTester $I ) {
		$banner       = new Brizy_Admin_Blocks_CookieBanner();
		$originalBlog = $GLOBALS['blog_id'];
		$otherSiteId  = $this->haveGlobalBlock( $I, 'brz-cookie-banner-7' );

		$I->assertNull( $banner->findBlock(), 'The banner of another site should not be returned' );

		try {
			$GLOBALS['blog_id'] = 7;
			$block              = $banner->findBlock();
		} finally {
			$GLOBALS['blog_id'] = $originalBlog;
		}

		$I->assertInstanceOf( Brizy_Editor_Block::class, $block );
		$I->assertEquals( $otherSiteId, $block->getWpPostId(), 'Site 7 should find its own banner' );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testFindBlockReturnsNullWhenNoBannerExists( FunctionalTester $I ) {
		$banner = new Brizy_Admin_Blocks_CookieBanner();
		$this->haveGlobalBlock( $I, 'another-global-block-uid' );

		$I->assertNull( $banner->findBlock(), 'Global blocks with other uids should be ignored' );
	}

	/**
	 * A trashed banner counts as existing, even though the manager's uid lookup skips trash.
	 *
	 * @param FunctionalTester $I
	 */
	public function testFindBlockReturnsTrashedBanner( FunctionalTester $I ) {
		$banner  = new Brizy_Admin_Blocks_CookieBanner();
		$trashed = $this->haveGlobalBlock( $I, $banner->getUid(), 'trash' );

		$I->assertSame( 'trash', get_post_status( $trashed ) );

		$block = $banner->findBlock();
		$I->assertInstanceOf( Brizy_Editor_Block::class, $block, 'findBlock() should return the trashed banner' );
		$I->assertEquals( $trashed, $block->getWpPostId() );

		$manager = new Brizy_Admin_Blocks_Manager( Brizy_Admin_Blocks_Main::CP_GLOBAL );
		$I->assertNull( $manager->getEntity( $banner->getUid() ), 'getEntity() skips trashed blocks' );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testFindBlockReturnsBannerInAnyStatus( FunctionalTester $I ) {
		$banner = new Brizy_Admin_Blocks_CookieBanner();

		foreach ( [ 'publish', 'draft', 'pending', 'private', 'future', 'trash' ] as $status ) {
			$I->dontHavePostInDatabase( [ 'post_type' => Brizy_Admin_Blocks_Main::CP_GLOBAL, ] );
			$id = $this->haveGlobalBlock( $I, $banner->getUid(), $status );

			$block = $banner->findBlock();
			$I->assertInstanceOf( Brizy_Editor_Block::class, $block, "findBlock() should find a banner with status {$status}" );
			$I->assertEquals( $id, $block->getWpPostId() );
		}
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testUsesTheInjectedBlockManager( FunctionalTester $I ) {
		// Anonymous spy: declared at run time, after WordPress and the Brizy autoloader are loaded.
		$manager = new class( Brizy_Admin_Blocks_Main::CP_GLOBAL ) extends Brizy_Admin_Blocks_Manager {
			public $calls = 0;
			public $lastArgs = [];

			public function getEntities( $args ) {
				$this->calls ++;
				$this->lastArgs = $args;

				return parent::getEntities( $args );
			}
		};
		$banner  = new Brizy_Admin_Blocks_CookieBanner( $manager, new Brizy_Admin_Rules_Manager() );

		$banner->findBlock();

		$I->assertSame( 1, $manager->calls, 'findBlock() should query through the injected block manager' );
		$I->assertContains( 'trash', $manager->lastArgs['post_status'] );
		$I->assertSame( 'brizy_post_uid', $manager->lastArgs['meta_key'] );
		$I->assertSame( $banner->getUid(), $manager->lastArgs['meta_value'] );
	}
}

