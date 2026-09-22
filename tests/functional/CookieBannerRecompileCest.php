<?php

class CookieBannerRecompileCest {

	const RESET_VERSION = '0.0.0';

	/**
	 * @var Brizy_Admin_Blocks_CookieBanner
	 */
	private $banner;

	/**
	 * @param FunctionalTester $I
	 */
	protected function _before( FunctionalTester $I ) {
		wp_cache_flush();
		wp_set_current_user( 1 );

		$I->dontHavePostInDatabase( [ 'post_type' => Brizy_Admin_Blocks_Main::CP_GLOBAL, ] );
		Brizy_Editor_Block::cleanClassCache();

		$this->banner = new Brizy_Admin_Blocks_CookieBanner();
	}

	/**
	 * A Brizy post compiled with the current editor. Seed it after any banner creation,
	 * because creating the banner resets every compiled version.
	 *
	 * @param FunctionalTester $I
	 *
	 * @return int
	 */
	private function haveCompiledBrizyPost( FunctionalTester $I ) {
		$id = $I->havePostInDatabase( [
			'post_type'   => 'page',
			'post_title'  => 'Compiled Brizy page',
			'post_status' => 'publish',
			'meta_input'  => [
				Brizy_Editor_Post::BRIZY_POST_COMPILER_VERSION => BRIZY_EDITOR_VERSION,
			],
		] );
		wp_cache_flush();

		$I->assertSame( BRIZY_EDITOR_VERSION, $this->compilerVersion( $I, $id ) );

		return $id;
	}

	/**
	 * Read from the database: the reset is a direct query that bypasses the object cache.
	 *
	 * @param FunctionalTester $I
	 * @param int $postId
	 *
	 * @return string
	 */
	private function compilerVersion( FunctionalTester $I, $postId ) {
		return $I->grabPostMetaFromDatabase( $postId, Brizy_Editor_Post::BRIZY_POST_COMPILER_VERSION, true );
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

		wp_cache_flush();
		Brizy_Editor_Block::cleanClassCache();

		return $id;
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
	 * @param FunctionalTester $I
	 */
	public function testCreatingEnableFlagsAllContentForRecompilation( FunctionalTester $I ) {
		$postId = $this->haveCompiledBrizyPost( $I );

		$I->assertTrue( $this->banner->enable() );
		$I->assertSame( self::RESET_VERSION, $this->compilerVersion( $I, $postId ) );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testFlagIsSetEvenWhenTheRuleWriteFails( FunctionalTester $I ) {
		$postId = $this->haveCompiledBrizyPost( $I );
		$banner = $this->banner;

		$result = $this->withRuleWritesFailing( function () use ( $banner ) {
			return $banner->enable();
		} );

		$I->assertFalse( $result, 'Enable should report the failed rule write' );
		$I->assertNotNull( $this->banner->findBlock(), 'The block was created before the rule write' );
		$I->assertSame( self::RESET_VERSION, $this->compilerVersion( $I, $postId ) );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testRestoringADraftBlockDoesNotRecompile( FunctionalTester $I ) {
		$this->haveBanner( $I, 'draft' );
		$postId = $this->haveCompiledBrizyPost( $I );

		$I->assertTrue( $this->banner->enable() );
		$I->assertSame( BRIZY_EDITOR_VERSION, $this->compilerVersion( $I, $postId ) );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testRestoringATrashedBlockDoesNotRecompile( FunctionalTester $I ) {
		$this->haveBanner( $I, 'trash' );
		$postId = $this->haveCompiledBrizyPost( $I );

		$I->assertTrue( $this->banner->enable() );
		$I->assertSame( BRIZY_EDITOR_VERSION, $this->compilerVersion( $I, $postId ) );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testEnableOnAPublishedBlockDoesNotRecompile( FunctionalTester $I ) {
		$I->assertTrue( $this->banner->enable(), 'The first enable creates the block' );
		$postId = $this->haveCompiledBrizyPost( $I );

		$I->assertTrue( $this->banner->enable() );
		$I->assertSame( BRIZY_EDITOR_VERSION, $this->compilerVersion( $I, $postId ) );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testDisableDoesNotRecompile( FunctionalTester $I ) {
		$I->assertTrue( $this->banner->enable(), 'The first enable creates the block' );
		$postId = $this->haveCompiledBrizyPost( $I );

		$I->assertTrue( $this->banner->disable() );
		$I->assertSame( BRIZY_EDITOR_VERSION, $this->compilerVersion( $I, $postId ) );
	}
}
