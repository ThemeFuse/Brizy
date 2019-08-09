<?php


class ProjectApiCest {

	/**
	 * @param FunctionalTester $I
	 */
	public function _before( FunctionalTester $I ) {
		wp_cache_flush();
		$I->loginAs( 'admin', 'admin' );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function getProjectDataTest( FunctionalTester $I ) {
		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action' => Brizy_Editor_API::AJAX_GET_PROJECT,
				'hash'   => wp_create_nonce( Brizy_Editor_API::nonce )
			] ) );
		$jsonResponse = $I->grabResponse();

		$I->seeResponseCodeIsSuccessful();

		$projectObject = json_decode( $jsonResponse );

		$this->assertCorrectProjectDataInResponse( $I, $projectObject );
	}


	/**
	 * @param FunctionalTester $I
	 */
	public function postProjectWithoutAutosaveTest( FunctionalTester $I ) {
		$query = build_query( [
			'action' => Brizy_Editor_API::AJAX_SET_PROJECT,
			'hash'   => wp_create_nonce( Brizy_Editor_API::nonce )
		] );
		$I->sendAjaxRequest( 'POST', 'wp-admin/admin-ajax.php?' . $query, [
			'data' => '{}',
		] );
		$jsonResponse = $I->grabResponse();

		$I->seeResponseCodeIsSuccessful();

		$projectObject = json_decode( $jsonResponse );


		$I->seePostInDatabase( [ 'post_type' => 'revision', 'post_title' => 'Brizy Project' ] );

		$this->assertCorrectProjectDataInResponse( $I, $projectObject );

		$I->assertEquals( '{}', $projectObject->data, 'It should contain the submitted data' );


		// asser the correct data is returned but project class
		Brizy_Editor_Project::cleanClassCache();
		$project = Brizy_Editor_Project::get();

		$I->assertEquals( '{}', $project->getDataAsJson(), 'It should not return submitted project data becausr is an autosave' );


		// also make sure the get project data request is returning the correct values
		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action' => Brizy_Editor_API::AJAX_GET_PROJECT,
				'hash'   => wp_create_nonce( Brizy_Editor_API::nonce )
			] ) );
		$jsonResponse = $I->grabResponse();

		$I->seeResponseCodeIsSuccessful();

		$projectObject = json_decode( $jsonResponse );

		$I->assertEquals( '{}', $projectObject->data, 'It should return submitted project data' );
	}


	/**
	 * @param FunctionalTester $I
	 */
	public function postProjectWithAutosaveTest( FunctionalTester $I ) {
		$query = build_query( [
			'action' => Brizy_Editor_API::AJAX_SET_PROJECT,
			'hash'   => wp_create_nonce( Brizy_Editor_API::nonce )
		] );
		$I->sendAjaxRequest( 'POST', 'wp-admin/admin-ajax.php?' . $query, [
			'data'        => '{}',
			'is_autosave' => 1
		] );
		$jsonResponse = $I->grabResponse();

		$I->seeResponseCodeIsSuccessful();

		$projectObject = json_decode( $jsonResponse );


		$I->seePostInDatabase( [ 'post_type' => 'revision', 'post_title' => 'Brizy Project' ] );

		$this->assertCorrectProjectDataInResponse( $I, $projectObject );

		$I->assertEquals( '{}', $projectObject->data, 'It should contain the submitted data' );


		// asser the correct data is returned but project class
		Brizy_Editor_Project::cleanClassCache();
		$project = Brizy_Editor_Project::get();

		$I->assertNotEquals( '{}', $project->getDataAsJson(), 'It should not return submitted project data because is an autosave' );


		// also make sure the get project data request is returning the correct values
		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action' => Brizy_Editor_API::AJAX_GET_PROJECT,
				'hash'   => wp_create_nonce( Brizy_Editor_API::nonce )
			] ) );
		$jsonResponse = $I->grabResponse();

		$I->seeResponseCodeIsSuccessful();

		$projectObject = json_decode( $jsonResponse );

		$I->assertNotEquals( '{}', $projectObject->data, 'It should return submitted project data' );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function postProjectFailsTest( FunctionalTester $I ) {
		$query = build_query( [
			'action' => Brizy_Editor_API::AJAX_SET_PROJECT,
			'hash'   => wp_create_nonce( Brizy_Editor_API::nonce )
		] );
		$I->sendAjaxRequest( 'POST', 'wp-admin/admin-ajax.php?' . $query, [
		] );

		$I->seeResponseCodeIs( 400 );


		$I->sendAjaxRequest( 'POST', 'wp-admin/admin-ajax.php?' . $query, [
			'fonts'  => '{}',
			'styles' => '{}'
		] );

		$I->seeResponseCodeIs( 400 );

	}

	/**
	 * @param FunctionalTester $I
	 * @param $projectObject
	 */
	private function assertCorrectProjectDataInResponse( FunctionalTester $I, $projectObject ) {
		$projectData = (array) $projectObject;
		$I->assertArrayHasKey( 'id', $projectData, 'Project data should contain property: id' );
		$I->assertArrayHasKey( 'data', $projectData, 'Project data should contain property: data  ' );
		$I->assertNotEmpty( $projectData['data'], 'Project data should not be empty' );
	}
}