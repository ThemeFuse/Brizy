<?php


class Brizy_EditorCest {
	/**
	 * @param FunctionalTester $I
	 */
	public function _before( FunctionalTester $I ) {
		wp_cache_flush();
		wp_set_current_user( 1 );
	}

	public function testSetProjectLock( FunctionalTester $I ) {

		$project = Brizy_Editor_Project::get();
		Brizy_Editor::get()->lockProject();
		$I->seePostMetaInDatabase( [
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
			time() . ':1'
		);

		$check = Brizy_Editor::get()->checkIfProjectIsLocked();
		$I->assertFalse( $check, 'It should be return false as the project is not locked' );
	}

	public function testProjectLocked( FunctionalTester $I ) {
		$project = Brizy_Editor_Project::get();
		$I->havePostmetaInDatabase(
			$project->getWpPostId(),
			'_edit_lock',
			time() . ':1'
		);
		wp_set_current_user( 2 );
		$check = Brizy_Editor::get()->checkIfProjectIsLocked();
		$I->assertTrue( $check!==false, 'It should be return true as the project is locked' );
	}
}