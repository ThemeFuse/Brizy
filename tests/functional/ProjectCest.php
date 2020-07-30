<?php

class ProjectCest {
	/**
	 * @var \IntegrationTester
	 */
	protected $tester;

	/**
	 * @param FunctionalTester $I
	 *
	 * @throws \Codeception\Exception\ModuleException
	 */
	public function _before( FunctionalTester $I ) {
		$I->dontHavePostInDatabase( [ 'post_type' => Brizy_Editor_Project::BRIZY_PROJECT ] );
		wp_cache_flush();
	}

	public function getStorageTest( FunctionalTester $I ) {
		$project = Brizy_Editor_Project::get();
		$storage = $project->getStorage();
		$I->assertInstanceOf(
			Brizy_Editor_Storage_Project::class,
			$storage,
			'It should return the correct isntance of storage' );
	}

	public function gettersAndSettersTest( FunctionalTester $I ) {

		$defaultJsonPath = Brizy_Editor_UrlBuilder::editor_build_path( 'defaults.json' );
		$defaultData     = base64_encode( file_get_contents( $defaultJsonPath ) );

		$project = Brizy_Editor_Project::get();

		$I->assertNotEmpty( $project->getId(), 'It should return a non empty value for id' );
		$I->assertNotEmpty( $project->getName(), 'It should return the generated project name' );
		$I->assertEquals( "Brizy Project", $project->getTitle(), 'It should return the generated project title' );
		$I->assertNull( $project->getUser(), 'It should return null' );
		$I->assertNull( $project->getLicenseKey(), 'It should return null' );
		$I->assertNull( $project->getCloudToken(), 'It should return null' );
		$I->assertNull( $project->getCloudProject(), 'It should return null' );
		$I->assertSame( $project->getTemplate(), [ 'slug' => 'brizy' ], 'It should return the default template values' );
		$I->assertSame( $project->getLanguages(), [], 'It should return the default template values' );
		$I->assertSame( $project->getAccounts(), [], 'It should return the default template values' );
		$I->assertSame( $project->getForms(), [], 'It should return the default template values' );
		$I->assertSame( $project->getImageOptimizerSettings(), [], 'It should return the default template values' );
		$I->assertEquals( $project->getData(), $defaultData, 'It should return the default generated data' );
		$I->assertInstanceOf( 'DateTime', $project->getCreated(), 'It should return instance of date time' );
		$I->assertInstanceOf( 'DateTime', $project->getUpdated(), 'It should return instance of date time' );
	}

	public function loadInstanceDataTest( FunctionalTester $I ) {

		$defaultJsonPath = Brizy_Editor_UrlBuilder::editor_build_path( 'defaults.json' );
		$defaultData     = base64_encode( file_get_contents( $defaultJsonPath ) );

		$project = Brizy_Editor_Project::get();

		$I->assertNotEmpty( $project->getId(), 'It should return a non empty value for id' );
		$I->assertNotEmpty( $project->getName(), 'It should return the generated project name' );
		$I->assertEquals( "Brizy Project", $project->getTitle(), 'It should return the generated project title' );
		$I->assertNull( $project->getUser(), 'It should return null' );
		$I->assertNull( $project->getLicenseKey(), 'It should return null' );
		$I->assertNull( $project->getCloudToken(), 'It should return null' );
		$I->assertNull( $project->getCloudProject(), 'It should return null' );
		$I->assertSame( $project->getTemplate(), [ 'slug' => 'brizy' ], 'It should return the default template values' );
		$I->assertSame( $project->getLanguages(), [], 'It should return the default template values' );
		$I->assertSame( $project->getAccounts(), [], 'It should return the default template values' );
		$I->assertSame( $project->getForms(), [], 'It should return the default template values' );
		$I->assertSame( $project->getImageOptimizerSettings(), [], 'It should return the default template values' );
		$I->assertEquals( $project->getData(), $defaultData, 'It should return the default generated data' );
		$I->assertInstanceOf( 'DateTime', $project->getCreated(), 'It should return instance of date time' );
		$I->assertInstanceOf( 'DateTime', $project->getUpdated(), 'It should return instance of date time' );
	}


	public function createdMetaKeysTest( FunctionalTester $I ) {

		$project = Brizy_Editor_Project::get();

		$I->seePostInDatabase( [
			'post_type'      => Brizy_Editor_Project::BRIZY_PROJECT,
			'post_status'    => 'publish',
		] );

		$I->seePostMetaInDatabase( [
			'meta_key' => 'brizy-project',
			'post_id'  => $project->getWpPostId()
		] );

	}

	public function createResponseTest( FunctionalTester $I ) {
		$project = Brizy_Editor_Project::get();
		$data    = $project->createResponse();

		$I->assertArrayHasKey( 'id', $data, "It should contain key 'id'    " );
		$I->assertArrayHasKey( 'data', $data, "It should contain key 'data'  " );
		$I->assertArrayHasKey( 'dataVersion', $data, "It should contain key 'dataVersion'  " );
	}

	public function convertToOptionsValueTest( FunctionalTester $I ) {
		$project         = Brizy_Editor_Project::get();
		$defaultJsonPath = Brizy_Editor_UrlBuilder::editor_build_path( 'defaults.json' );
		$defaultData     = base64_encode( file_get_contents( $defaultJsonPath ) );

		$data = $project->convertToOptionValue();


		$I->assertArrayHasKey( 'id', $data, 'It should contain id key' );
		$I->assertArrayHasKey( 'name', $data, 'It should contain name key' );
		$I->assertArrayHasKey( 'title', $data, 'It should contain title key' );
		$I->assertArrayHasKey( 'user', $data, 'It should contain user key' );
		$I->assertArrayHasKey( 'template', $data, 'It should contain template key' );
		$I->assertArrayHasKey( 'accounts', $data, 'It should contain accounts key' );
		$I->assertArrayHasKey( 'forms', $data, 'It should contain forms key' );
		$I->assertArrayHasKey( 'data', $data, 'It should contain data key' );
		$I->assertArrayHasKey( 'brizy-license-key', $data, 'It should contain brizy-license-key key' );
		$I->assertArrayHasKey( 'brizy-cloud-token', $data, 'It should contain brizy-cloud-token key' );
		$I->assertArrayHasKey( 'brizy-cloud-project', $data, 'It should contain brizy-cloud-project key' );
		$I->assertArrayHasKey( 'image-optimizer-settings', $data, 'It should contain image-optimizer-settings key' );
		$I->assertArrayHasKey( 'created', $data, 'It should containt the created key' );
		$I->assertArrayHasKey( 'updated', $data, 'It should containt the updated key' );

		$I->assertNotEmpty( $data['id'], 'It should return a non empty value for id' );
		$I->assertNotEmpty( $data['name'], 'It should return the generated project name' );
		$I->assertEquals( "Brizy Project", $data['title'], 'It should return the generated project title' );
		$I->assertNull( $data['user'], 'It should return null' );
		$I->assertNull( $data['brizy-license-key'], 'It should return null' );
		$I->assertNull( $data['brizy-cloud-token'], 'It should return null' );
		$I->assertNull( $data['brizy-cloud-project'], 'It should return null' );
		$I->assertSame( $data['template'], [ 'slug' => 'brizy' ], 'It should return the default template values' );
		$I->assertSame( $data['accounts'], [], 'It should return the default template values' );
		$I->assertSame( $data['forms'], [], 'It should return the default template values' );
		$I->assertSame( $data['image-optimizer-settings'], [], 'It should return the default template values' );
		$I->assertEquals( $data['data'], $defaultData, 'It should return the default generated data' );
		$I->assertInstanceOf( 'DateTime', $data['created'], 'It should return instance of date time' );
		$I->assertInstanceOf( 'DateTime', $data['updated'], 'It should return instance of date time' );
	}

	public function autoSaveTest( FunctionalTester $I ) {
		$project = Brizy_Editor_Project::get();
		$project->setData( base64_encode( "{}" ) );
		$project->setDataVersion(1);
		$project->save( 1 );

		$I->canSeePostInDatabase( [
			'post_parent' => $project->getWpPostId(),
			'post_type'   => 'revision',
			'post_name'   => $project->getWpPostId() . '-autosave-v1'
		] );

		$I->dontSeePostInDatabase( [
			'post_parent' => $project->getWpPostId(),
			'post_type'   => 'revision',
			'post_name'   => $project->getWpPostId() . '-revision-v1'
		] );
	}

	public function revisionSaveTest( FunctionalTester $I ) {
		$project = Brizy_Editor_Project::get();
		$project->setData( base64_encode( "{}" ) );
		$project->setDataVersion(1);
		$project->save( 0 );
		$project->savePost();

		$I->canSeePostInDatabase( [
			'post_parent' => $project->getWpPostId(),
			'post_type'   => 'revision',
			'post_name'   => $project->getWpPostId() . '-revision-v1'
		] );
	}

	public function revisionSaveNoDataTest( FunctionalTester $I ) {
		$project = Brizy_Editor_Project::get();
		$project->setDataVersion(1);
		$project->save( 0 );
		$project->savePost();

		$I->cantSeePostInDatabase( [
			'post_parent' => $project->getWpPostId(),
			'post_type'   => 'revision',
			'post_name'   => $project->getWpPostId() . '-revision-v1'
		] );
	}

	public function getMetaValueTest( FunctionalTester $I ) {
		$project = Brizy_Editor_Project::get();
		$data    = $project->convertToOptionValue();

		$I->assertEquals( $project->getMetaValue( 'id' ), $data['id'], 'It should return the id value' );
		$I->assertEquals( $project->getMetaValue( 'name' ), $data['name'], 'It should return the name value' );
		$I->assertEquals( $project->getMetaValue( 'title' ), $data['title'], 'It should return the title value' );
		$I->assertEquals( $project->getMetaValue( 'user' ), $data['user'], 'It should return the user value' );
		$I->assertEquals( $project->getMetaValue( 'template' ), $data['template'], 'It should return the template value' );
		$I->assertEquals( $project->getMetaValue( 'accounts' ), $data['accounts'], 'It should return the accounts value' );
		$I->assertEquals( $project->getMetaValue( 'forms' ), $data['forms'], 'It should return the forms value' );
		$I->assertEquals( $project->getMetaValue( 'data' ), $data['data'], 'It should return the data value' );
		$I->assertEquals( $project->getMetaValue( 'created' ), $data['created'], 'It should return the the valueated key' );
		$I->assertEquals( $project->getMetaValue( 'updated' ), $data['updated'], 'It should return the the valueated key' );
		$I->assertEquals( $project->getMetaValue( 'brizy-license-key' ), $data['brizy-license-key'], 'It should return brizy-license-key value' );
		$I->assertEquals( $project->getMetaValue( 'brizy-cloud-token' ), $data['brizy-cloud-token'], 'It should return brizy-cloud-token value' );
		$I->assertEquals( $project->getMetaValue( 'brizy-cloud-project' ), $data['brizy-cloud-project'], 'It should return brizy-cloud-project value' );
		$I->assertEquals( $project->getMetaValue( 'image-optimizer-settings' ), $data['image-optimizer-settings'], 'It should return image-optimizer-settings value' );

	}
}