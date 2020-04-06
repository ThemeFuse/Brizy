<?php


class ProjectApiCest {

	/**
	 * @param FunctionalTester $I
	 */
	public function _before( FunctionalTester $I ) {
		wp_cache_flush();
		$I->loginAs( 'admin', 'admin' );
		$I->dontHavePostInDatabase( [ 'post_type' => 'brizy-project' ] );
	}

	public function requestWithoutVersionKey( FunctionalTester $I ) {
		$I->wantToTest( 'Request with invalid editor version' );
		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action' => 'brizy_get_project',
				'hash'   => wp_create_nonce( Brizy_Editor_API::nonce ),
			] ) );
		$I->seeResponseCodeIs( 400 );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function getProjectDataTest( FunctionalTester $I ) {
		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'  => 'brizy_get_project',
				'hash'    => wp_create_nonce( Brizy_Editor_API::nonce ),
				'version' => BRIZY_EDITOR_VERSION
			] ) );
		$jsonResponse = $I->grabResponse();
		$I->seeResponseCodeIsSuccessful();

		$projectObject = json_decode( $jsonResponse );

		$this->assertCorrectProjectDataInResponse( $I, $projectObject->data );
	}


	public function postProjectWithoutAutosaveParameters() {
		return [
			[ 'data' => '{}' ],
			[ 'data' => '{}', 'is_autosave' => 0 ],
		];
	}

	/**
	 * @dataProvider postProjectWithoutAutosaveParameters
	 *
	 * @param FunctionalTester $I
	 * @param \Codeception\Example $example
	 *
	 * @throws Exception
	 */
	public function postProjectWithoutAutosaveTest( FunctionalTester $I, \Codeception\Example $example ) {
		$query = build_query( [
			'action'      => 'brizy_set_project',
			'hash'        => wp_create_nonce( Brizy_Editor_API::nonce ),
			'version'     => BRIZY_EDITOR_VERSION,
			'dataVersion' => 1

		] );
		$I->sendAjaxRequest( 'POST', 'wp-admin/admin-ajax.php?' . $query, $example->getIterator()->getArrayCopy() );
		$I->seeResponseCodeIsSuccessful();

		$jsonResponse  = $I->grabResponse();
		$projectObject = json_decode( $jsonResponse )->data;

		$I->seePostInDatabase( [ 'post_type' => 'revision', 'post_title' => 'Brizy Project' ] );

		$this->assertCorrectProjectDataInResponse( $I, $projectObject );

		$I->assertEquals( '{}', $projectObject->data, 'It should contain the submitted data' );


		// asser the correct data is returned but project class
		Brizy_Editor_Project::cleanClassCache();
		$project = Brizy_Editor_Project::get();

		$I->assertEquals( '{}', $project->getDataAsJson(), 'It should not return submitted project data because is an autosave' );
		$I->assertEquals( 1, $project->getCurrentDataVersion(), 'The dataVersion should be 1' );

		// also make sure the get project data request is returning the correct values
		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'  => 'brizy_get_project',
				'hash'    => wp_create_nonce( Brizy_Editor_API::nonce ),
				'version' => BRIZY_EDITOR_VERSION
			] ) );
		$jsonResponse = $I->grabResponse();

		$I->seeResponseCodeIsSuccessful();

		$projectObject = json_decode( $jsonResponse )->data;

		$I->assertEquals( '{}', $projectObject->data, 'It should return submitted project data' );
		$I->assertEquals( 1, $project->getCurrentDataVersion(), 'The dataVersion should be 2' );
	}


	/**
	 * @param FunctionalTester $I
	 *
	 * @throws Exception
	 */
	public function postProjectWithAutosaveTest( FunctionalTester $I ) {
		$query = build_query( [
			'action'      => 'brizy_set_project',
			'hash'        => wp_create_nonce( Brizy_Editor_API::nonce ),
			'version'     => BRIZY_EDITOR_VERSION,
			'dataVersion' => 1
		] );
		$I->sendAjaxRequest( 'POST', 'wp-admin/admin-ajax.php?' . $query, [
			'data'        => '{}',
			'is_autosave' => 1,
		] );
		$jsonResponse = $I->grabResponse();

		$I->seeResponseCodeIsSuccessful();

		$projectObject = json_decode( $jsonResponse );

		$I->seePostInDatabase( [ 'post_type' => 'revision', 'post_title' => 'Brizy Project' ] );

		$this->assertCorrectProjectDataInResponse( $I, $projectObject->data );

		$I->assertEquals( '{}', $projectObject->data->data, 'It should contain the submitted data' );


		// assert the correct data is returned but project class
		Brizy_Editor_Project::cleanClassCache();
		$project = Brizy_Editor_Project::get();

		$data_as_json = $project->getDataAsJson();
		$I->assertNotEquals( '{}', $data_as_json, 'It should not return submitted project data because is an autosave' );


		// also make sure the get project data request is returning the correct values
		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'  => 'brizy_get_project',
				'hash'    => wp_create_nonce( Brizy_Editor_API::nonce ),
				'version' => BRIZY_EDITOR_VERSION
			] ) );
		$jsonResponse = $I->grabResponse();

		$I->seeResponseCodeIsSuccessful();

		$projectObject = json_decode( $jsonResponse );

		$I->assertNotEquals( '{}', $projectObject->data->data, 'It should return submitted project data' );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function postProjectFailsTest( FunctionalTester $I ) {
		$query = build_query( [
			'action'      => 'brizy_set_project',
			'hash'        => wp_create_nonce( Brizy_Editor_API::nonce ),
			'version'     => BRIZY_EDITOR_VERSION,
			'dataVersion' => 1,
		] );
		$I->sendAjaxRequest( 'POST', 'wp-admin/admin-ajax.php?' . $query, [] );

		$I->seeResponseCodeIs( 400 );


		$I->sendAjaxRequest( 'POST', 'wp-admin/admin-ajax.php?' . $query, [
			'fonts'       => '{}',
			'styles'      => '{}',
			'version'     => BRIZY_EDITOR_VERSION,
			'dataVersion' => 1,
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
		$I->assertArrayHasKey( 'dataVersion', $projectData, 'Project data should contain property: dataVersion  ' );
		$I->assertNotEmpty( $projectData['data'], 'Project data should not be empty' );
	}
}