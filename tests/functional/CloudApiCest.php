<?php


class CloudApiCest {

	/**
	 * @param FunctionalTester $I
	 */
	public function _before( FunctionalTester $I ) {
		wp_cache_flush();

		$I->loginAs( 'admin', 'admin' );
	}

//	/**
//	 * @param FunctionalTester $I
//	 */
//	public function signInTest( FunctionalTester $I ) {
//
//		$I->wantToTest( 'Request with invalid editor version' );
//		$I->setHeader( 'Content-Type', 'application/json' );
//		$I->sendPOST( 'wp-admin/admin-ajax.php?' . build_query(
//				[
//					'action'  => 'brizy-cloud-signin',
//					'version' => BRIZY_EDITOR_VERSION
//				] ),
//
//			json_encode( array(
//				'email'    => 'testbrizy@gmail.com',
//				'password' => '12345'
//			) )
//		);
//	}
//
//	/**
//	 * @param FunctionalTester $I
//	 */
//	public function getContainersTest( FunctionalTester $I ) {
//		$I->wantToTest( 'Get container request' );
//
//		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [ 'action' => 'brizy-cloud-signin' ] ),
//			[
//				'username' => '',
//				'password' => ''
//			] );
//	}

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


	public function syncTriggerUnauthorizedTest( FunctionalTester $I ) {

		$project = Brizy_Editor_Project::get();
		$project->setCloudToken( null );
		$project->saveStorage();

		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'  => 'brizy-cloud-sync',
				'version' => BRIZY_EDITOR_VERSION
			] ) );

		$I->seeResponseCodeIs(400);
	}


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
}