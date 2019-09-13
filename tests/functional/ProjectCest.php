<?php

class ProjectCest {

	public static function tearDownAfterClass() {
		global $wpdb;
		@$wpdb->check_connection();
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function _before( FunctionalTester $I ) {
		$I->dontHavePostInDatabase( [ 'post_type' => Brizy_Editor_Project::BRIZY_PROJECT ] );
		wp_cache_flush();
	}

	/**
	 * @param FunctionalTester $I
	 *
	 * @throws Exception
	 */
	public function createdMetaKeysTest( FunctionalTester $I ) {

		$project = Brizy_Editor_Project::get();

		$I->seePostInDatabase( [
			'post_type'   => Brizy_Editor_Project::BRIZY_PROJECT,
			'post_status' => 'publish',
		] );

		$I->seePostMetaInDatabase( [
			'meta_key' => 'brizy-project',
			'post_id'  => $project->get_parent_id()
		] );
	}

	/**
	 * @param FunctionalTester $I
	 *
	 * @throws Exception
	 */
	public function createPostDataTest( FunctionalTester $I ) {
		$project = Brizy_Editor_Project::get();
		$data    = $project->create_post_data();

		$I->assertArrayHasKey( 'id', $data, "It should contain key 'id'    " );
		$I->assertArrayHasKey( 'data', $data, "It should contain key 'data'  " );
	}
}