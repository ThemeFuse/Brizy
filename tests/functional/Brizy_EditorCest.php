<?php


class Brizy_EditorCest {

	/**
	 * @var int
	 */
	private $userId1;

	/**
	 * @var int
	 */
	private $userId2;

	/**
	 * @param FunctionalTester $I
	 */
	public function _before( FunctionalTester $I ) {
		wp_cache_flush();
		$I->dontHavePostMetaInDatabase( [] );
		$I->dontHavePostInDatabase( [] );
		$this->userId1 = $I->haveUserInDatabase( 'test-user1', 'administrator' );
		$this->userId2 = $I->haveUserInDatabase( 'test-user2', 'administrator' );
		$I->haveUserInDatabase( 'test-user2', 'administrator' );
		wp_set_current_user( $this->userId1 );


	}

	public function testSetProjectLock( FunctionalTester $I ) {

		$project = Brizy_Editor_Project::get();
		wp_cache_flush();
		Brizy_Editor::get()->lockProject();
		wp_cache_flush();
		$I->seePostMetaInDatabase( [
			'post_id'  => $project->getWpPostId(),
			'meta_key' => '_edit_lock',
		] );
	}

	public function testRemoveProjectLock( FunctionalTester $I ) {
		global $wpdb;
		$project = Brizy_Editor_Project::get();
		$I->havePostmetaInDatabase(
			$project->getWpPostId(),
			'_edit_lock',
			time() . ':' . $this->userId1
		);

		$wpdb->flush();
		wp_cache_flush();
		Brizy_Editor::get()->removeProjectLock();
		wp_cache_flush();
		$I->dontSeePostMetaInDatabase( [
			'post_id'  => $project->getWpPostId(),
			'meta_key' => '_edit_lock',
		] );
	}

	public function testNoProjectLock( FunctionalTester $I ) {
		$check = Brizy_Editor::get()->checkIfProjectIsLocked();
		$I->assertFalse( $check, 'It should be return false as the project is not locked' );
	}

	public function testProjectLock( FunctionalTester $I ) {
		global $wpdb;
		$project = Brizy_Editor_Project::get();
		$I->havePostmetaInDatabase(
			$project->getWpPostId(),
			'_edit_lock',
			time() . ':' . $this->userId1
		);
		wp_cache_flush();
		$check = Brizy_Editor::get()->checkIfProjectIsLocked();
		$I->assertFalse( $check == $this->userId1, 'It should be return false as the project is not locked' );
	}

	public function testProjectLocked( FunctionalTester $I ) {
		global $wpdb;

		$project = Brizy_Editor_Project::get();
		$I->havePostmetaInDatabase(
			$project->getWpPostId(),
			'_edit_lock',
			time() . ':' . $this->userId1
		);

		wp_cache_flush();

		wp_set_current_user( $this->userId2 );
		wp_cache_flush();
		$check = Brizy_Editor::get()->checkIfProjectIsLocked();
		$I->assertTrue( $check!==false, 'It should be return true as the project is locked' );
	}


	public function testPrefix( FunctionalTester $I ) {
		// test the default prefix
		$I->assertEquals( 'brizy-action', Brizy_Editor::prefix( '-action' ), 'It should add the correct prefix' );
		$I->seeOptionInDatabase( [ 'option_name' => 'brizy_prefix', 'option_value' => 'brizy' ] );

		// set a new prefix
		Brizy_Editor::setPrefix( 'test' );

		$I->assertEquals( 'test-action', Brizy_Editor::prefix( '-action' ), 'It should add the correct prefix' );
		$I->seeOptionInDatabase( [ 'option_name' => 'brizy_prefix', 'option_value' => 'test' ] );
	}
}