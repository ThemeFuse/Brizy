<?php


class CloudApiCest {

	/**
	 * @param FunctionalTester $I
	 */
	public function _before( FunctionalTester $I ) {
		wp_cache_flush();

		$I->loginAs( 'admin', 'admin' );
	}

	/**
	 * @param FunctionalTester $I
	 *
	 * @throws Exception
	 */
	public function syncTriggerTest( FunctionalTester $I ) {

		$project = Brizy_Editor_Project::get();
		$project->setCloudToken( 'token' );
		$project->saveStorage();

		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'  => 'brizy-cloud-sync',
				'version' => BRIZY_EDITOR_VERSION
			] ) );

		$I->seeResponseCodeIsSuccessful();

		$response = $I->grabJsonResponse( $I );

		$I->assertTrue( isset( $response->data ), 'It should return data' );
		$I->assertTrue( isset( $response->data->synchronized ), 'It should return synchronized in data' );
		$I->assertIsInt( $response->data->synchronized, 'It should be an integer value' );
	}

	/**
	 * @param FunctionalTester $I
	 *
	 * @throws Exception
	 */
	public function syncTriggerUnauthorizedTest( FunctionalTester $I ) {

		$project = Brizy_Editor_Project::get();
		$project->setCloudToken( null );
		$project->saveStorage();

		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'  => 'brizy-cloud-sync',
				'version' => BRIZY_EDITOR_VERSION
			] ) );

		$I->seeResponseCodeIs( 400 );
	}

	/**
	 * @param FunctionalTester $I
	 *
	 * @throws Exception
	 */
	public function signOutTest( FunctionalTester $I ) {
		$I->wantToTest( 'Could signout' );
		$project = Brizy_Editor_Project::get();
		$project->setCloudToken( 'token' );
		$project->saveStorage();

		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'  => 'brizy-cloud-signout',
				'version' => BRIZY_EDITOR_VERSION
			] ) );


		Brizy_Editor_Project::cleanClassCache();

		$project = Brizy_Editor_Project::get();

		$I->assertNull( $project->getCloudToken(), 'It should have a null token after signout' );
	}

	/***
	 * @param FunctionalTester $I
	 *
	 * @throws Exception
	 */
	public function cloudSyncAllowedTest( FunctionalTester $I ) {

		$I->haveTransientInDatabase( 'brizy_cloud_editor_versions',
			(array) json_decode( '{
			"sync": "unknown",
			"editor": "import-export-2-cloud",
			"free": "import-export-2-cloud",
			"pro": "import-export-2-cloud"
			}' ) );

		$project = Brizy_Editor_Project::get();
		$project->setCloudToken( 'token' );
		$project->saveStorage();

		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'  => 'brizy-cloud-sync-allowed',
				'version' => BRIZY_EDITOR_VERSION
			] ) );

		$I->seeResponseCodeIsSuccessful();

		$response = $I->grabJsonResponse( $I );

		$I->assertTrue( isset( $response->data->isSyncAllowed ), 'It should return free version' );
		$I->assertFalse(  $response->data->isSyncAllowed , 'It should return free version' );
	}

}