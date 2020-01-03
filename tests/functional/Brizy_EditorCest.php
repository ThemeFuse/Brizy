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
		$I->dontHavePostMetaInDatabase([]);
		$I->dontHavePostInDatabase([]);
		$this->userId1 = $I->haveUserInDatabase( 'test-user1', 'administrator' );
		$this->userId2 = $I->haveUserInDatabase( 'test-user1', 'administrator' );
		$I->haveUserInDatabase( 'test-user2', 'administrator' );
		wp_set_current_user( $this->userId1 );
	}

	public function testSetProjectLock( FunctionalTester $I ) {

		$project = Brizy_Editor_Project::get();
		Brizy_Editor::get()->lockProject();
		$I->seePostMetaInDatabase( [
			'post_id'  => $project->getWpPostId(),
			'meta_key' => '_edit_lock',
		] );
	}

	public function testRemoveProjectLock( FunctionalTester $I ) {

		$project = Brizy_Editor_Project::get();
		$I->havePostmetaInDatabase(
			$project->getWpPostId(),
			'_edit_lock',
			time() . ':' . $this->userId1
		);

		Brizy_Editor::get()->removeProjectLock();
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
		$project = Brizy_Editor_Project::get();
		$I->havePostmetaInDatabase(
			$project->getWpPostId(),
			'_edit_lock',
			time() . ':' . $this->userId1
		);

		$check = Brizy_Editor::get()->checkIfProjectIsLocked();
		$I->assertFalse( $check==$this->userId1, 'It should be return false as the project is not locked' );
	}

	public function testProjectLocked( FunctionalTester $I ) {
		$project = Brizy_Editor_Project::get();
		$I->havePostmetaInDatabase(
			$project->getWpPostId(),
			'_edit_lock',
			time() . ':' . $this->userId1
		);
		wp_set_current_user( $this->userId2 );
		$check = Brizy_Editor::get()->checkIfProjectIsLocked();
		$I->assertTrue( $check !== false, 'It should be return true as the project is locked' );
	}
}