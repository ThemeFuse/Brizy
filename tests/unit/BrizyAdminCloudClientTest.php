<?php

use \Prophecy\Argument;

class BrizyAdminCloudClientTest extends \Codeception\Test\Unit {


	/**
	 * @return \Prophecy\Prophecy\ObjectProphecy
	 */
	private function getProjectObjserver() {
		$projectObserver = $this->prophesize( Brizy_Editor_Project::class );
		$projectObserver->getMetaValue( 'brizy-cloud-token' )->willReturn( 'brizy-cloud-token-hash' );
		$projectObserver->getMetaValue( 'brizy-cloud-container' )->willReturn( 'brizy-cloud-container' );
		$projectObserver->getCloudContainer()->willReturn( 'container' );

		return $projectObserver;
	}

	/**
	 * @return \Prophecy\Prophecy\ObjectProphecy
	 */
	private function getHttpObjserver() {
		return $httpObserver = $this->prophesize( WP_Http::class );;
	}

	/**
	 * @throws Exception
	 */
	public function testConstructor() {
		$projectObserver = $this->getProjectObjserver();
		$httpObserver    = $this->getHttpObjserver();

		$client = new Brizy_Admin_Cloud_Client( $projectObserver->reveal(), $httpObserver->reveal() );

		$this->assertSame( $client->getBrizyProject(), $projectObserver->reveal(), 'The getBrizyProject should return the valid instance' );
		$this->assertSame( $client->getHttp(), $httpObserver->reveal(), 'The getHttp should return the valid instance' );
	}

	public function testSetters() {
		$projectObserver = $this->getProjectObjserver();
		$httpObserver    = $this->getHttpObjserver();

		$httpObserver = $httpObserver->reveal();
		$client       = new Brizy_Admin_Cloud_Client( $projectObserver->reveal(), $httpObserver );

		$this->assertSame( $client->getHttp(), $httpObserver, 'The getHttp should return the valid instance passed in constructor' );

		$client->setHttp( $http = new WP_Http() );
		$this->assertSame( $client->getHttp(), $http, 'The getHttp should return the valid instance' );

		$project = $this->prophesize( Brizy_Editor_Project::class )->reveal();
		$client->setBrizyProject( $project );
		$this->assertSame( $client->getBrizyProject(), $project, 'The getBrizyProject should return the valid instance' );
	}

	/**
	 * @throws Exception
	 */
	public function testGetLibraries() {

		$projectObserver = $this->getProjectObjserver();
		$httpObserver    = $this->getHttpObjserver();
		$client          = new Brizy_Admin_Cloud_Client( $projectObserver->reveal(), $httpObserver->reveal() );

		$apiEndpointUrl = Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_LIBRARY;
		$httpObserver->get( $apiEndpointUrl, Argument::containing( [
			'X-AUTH-USER-TOKEN' => 'brizy-cloud-token-hash',
			'X-EDITOR-VERSION'  => BRIZY_EDITOR_VERSION
		] ) )->shouldBeCalled();

		$client->getLibraries();
	}

	/**
	 * @throws Exception
	 */
	public function testGetScreenshotByUid() {

		$projectObserver = $this->getProjectObjserver();
		$httpObserver    = $this->getHttpObjserver();
		$client          = new Brizy_Admin_Cloud_Client( $projectObserver->reveal(), $httpObserver->reveal() );

		$uid = 'some-uid';
		$url = $client->getScreenshotUrl( $uid );

		$this->assertEquals( $url, sprintf( Brizy_Config::getEditorBaseUrls() . Brizy_Config::CLOUD_SCREENSHOT, $uid ), 'It should return the correct screenshot url' );
	}

	/**
	 * @throws Exception
	 */
	public function testCreateScreenshot() {

		$projectObserver = $this->getProjectObjserver();
		$httpObserver    = $this->getHttpObjserver();
		$client          = new Brizy_Admin_Cloud_Client( $projectObserver->reveal(), $httpObserver->reveal() );

		$uid            = 'some-uid';
		$apiEndpointUrl = Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_SCREENSHOTS;
		$httpObserver->post( $apiEndpointUrl,
			Argument::exact( [
				'headers' => [
					'X-AUTH-USER-TOKEN' => 'brizy-cloud-token-hash',
					'X-EDITOR-VERSION'  => BRIZY_EDITOR_VERSION,
				],
				'body'    => [
					'uid'        => $uid,
					'attachment' => base64_encode( file_get_contents( codecept_data_dir( 'images/cat.jpeg' ) ) )
				]
			] )
		)->shouldBeCalled();

		$client->createScreenshot( $uid, codecept_data_dir( 'images/cat.jpeg' ) );
	}


	public function testSignIn() {
		$projectObserver = $this->getProjectObjserver();
		$httpObserver    = $this->getHttpObjserver();

		$client = new Brizy_Admin_Cloud_Client( $projectObserver->reveal(), $httpObserver->reveal() );


		$apiEndpointUrl = Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_SIGNIN;
		$httpObserver->post( $apiEndpointUrl, Argument::exact( [
			'headers' => [
				'X-AUTH-USER-TOKEN' => 'brizy-cloud-token-hash',
				'X-EDITOR-VERSION'  => BRIZY_EDITOR_VERSION,
				'Content-type'      => 'application/x-www-form-urlencoded'
			],
			'body'    => [
				'email'    => 'username@email.com',
				'password' => 'password'
			]
		] ) )->shouldBeCalled();

		$client->signIn( 'username@email.com', 'password' );
	}

	public function testSignUp() {
		$projectObserver = $this->getProjectObjserver();
		$httpObserver    = $this->getHttpObjserver();

		$client = new Brizy_Admin_Cloud_Client( $projectObserver->reveal(), $httpObserver->reveal() );


		$apiEndpointUrl = Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_SIGNUP;
		$httpObserver->post( $apiEndpointUrl, Argument::exact( [
			'headers' => [
				'X-AUTH-USER-TOKEN' => 'brizy-cloud-token-hash',
				'X-EDITOR-VERSION'  => BRIZY_EDITOR_VERSION,
				'Content-type'      => 'application/x-www-form-urlencoded'
			],
			'body'    => [

				'first_name'       => 'first_name',
				'last_name'        => 'last_name',
				'email'            => 'email@email.com',
				'new_password'     => 'password',
				'confirm_password' => 'password'
			]
		] ) )->shouldBeCalled();

		$client->signUp( 'first_name',
			'last_name',
			'email@email.com',
			'password',
			'password' );
	}

	public function testResetPassword() {
		$projectObserver = $this->getProjectObjserver();
		$httpObserver    = $this->getHttpObjserver();

		$client = new Brizy_Admin_Cloud_Client( $projectObserver->reveal(), $httpObserver->reveal() );


		$apiEndpointUrl = Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_RESET_PASSWORD;
		$httpObserver->post( $apiEndpointUrl, Argument::exact( [
			'headers' => [

				'X-AUTH-USER-TOKEN' => 'brizy-cloud-token-hash',
				'X-EDITOR-VERSION'  => BRIZY_EDITOR_VERSION,
				'Content-type'      => 'application/x-www-form-urlencoded'
			],
			'body'    => [
				'email' => 'email@email.com',
			]
		] ) )->shouldBeCalled();

		$client->resetPassword( 'email@email.com' );
	}

	public function testGetContainers() {
		$projectObserver = $this->getProjectObjserver();
		$httpObserver    = $this->getHttpObjserver();

		$client = new Brizy_Admin_Cloud_Client( $projectObserver->reveal(), $httpObserver->reveal() );

		$apiEndpointUrl = Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_CONTAINERS;
		$httpObserver->get( $apiEndpointUrl, Argument::exact( [
			'headers' => [

				'X-AUTH-USER-TOKEN' => 'brizy-cloud-token-hash',
				'X-EDITOR-VERSION'  => BRIZY_EDITOR_VERSION,
			]
		] ) )->shouldBeCalled();

		$client->getContainers();
	}

	public function testGetProjects() {
		$projectObserver = $this->getProjectObjserver();
		$httpObserver    = $this->getHttpObjserver();

		$client = new Brizy_Admin_Cloud_Client( $projectObserver->reveal(), $httpObserver->reveal() );

		$filters        = [ 'key' => 'val' ];
		$apiEndpointUrl = Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_PROJECTS . '?' . http_build_query( $filters );
		$httpObserver->get( Argument::exact( $apiEndpointUrl ), Argument::exact( [
			'headers' => [

				'X-AUTH-USER-TOKEN' => 'brizy-cloud-token-hash',
				'X-EDITOR-VERSION'  => BRIZY_EDITOR_VERSION,
			]
		] ) )->shouldBeCalled();

		$client->getProjects( $filters );
	}

	public function testGetProject() {
		$projectObserver = $this->getProjectObjserver();
		$httpObserver    = $this->getHttpObjserver();

		$client = new Brizy_Admin_Cloud_Client( $projectObserver->reveal(), $httpObserver->reveal() );

		$apiEndpointUrl = sprintf( Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_PROJECTS . "/%d", 100 );

		$httpObserver->get( Argument::exact( $apiEndpointUrl ), Argument::exact( [
			'headers' => [

				'X-AUTH-USER-TOKEN' => 'brizy-cloud-token-hash',
				'X-EDITOR-VERSION'  => BRIZY_EDITOR_VERSION,
			]
		] ) )->shouldBeCalled();

		$client->getProject( 100 );
	}

	public function testCreateProject() {
		$projectObserver = $this->getProjectObjserver();
		$httpObserver    = $this->getHttpObjserver();

		$client = new Brizy_Admin_Cloud_Client( $projectObserver->reveal(), $httpObserver->reveal() );

		$apiEndpointUrl = Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_PROJECTS;

		$httpObserver->post( Argument::exact( $apiEndpointUrl ), Argument::exact( [
			'headers' => [

				'X-AUTH-USER-TOKEN' => 'brizy-cloud-token-hash',
				'X-EDITOR-VERSION'  => BRIZY_EDITOR_VERSION,
			],
			'body'    => [
				'name'      => 'name',
				'container' => 'container',
				'globals'   => null,
				'site_id'   => null
			]
		] ) )->shouldBeCalled();

		$client->createProject( 'container', 'name' );
	}


	public function testGetBlocks() {
		$projectObserver = $this->getProjectObjserver();
		$httpObserver    = $this->getHttpObjserver();

		$client = new Brizy_Admin_Cloud_Client( $projectObserver->reveal(), $httpObserver->reveal() );

		$filters        = [ 'key' => 'val' ];
		$apiEndpointUrl = Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_SAVEDBLOCKS . '?' . http_build_query( [
				'key'       => 'val',
				'container' => 'container'
			] );
		$httpObserver->get( Argument::exact( $apiEndpointUrl ), Argument::exact( [
			'headers' => [

				'X-AUTH-USER-TOKEN' => 'brizy-cloud-token-hash',
				'X-EDITOR-VERSION'  => BRIZY_EDITOR_VERSION,
			]
		] ) )->shouldBeCalled();

		$client->getBlocks( $filters );
	}


	public function testCreateBlock() {
		$projectObserver = $this->getProjectObjserver();
		$httpObserver    = $this->getHttpObjserver();
		$client          = new Brizy_Admin_Cloud_Client( $projectObserver->reveal(), $httpObserver->reveal() );


		// set up reuqest for library list
		$blockObserver = $this->prophesize( Brizy_Editor_Block::class );
		$blockObserver->get_editor_data()->willReturn( "SOME_ENCODED_JSON" );
		$blockObserver->getUid()->willReturn( "SOME_UID" );
		$blockObserver->getCloudId()->willReturn( null );
		$blockObserver->getMeta()->willReturn( array() );
		$block = $blockObserver->reveal();

		$cloudBlockData = array(
			'container'   => 'container',
			'meta'        => array(),
			'data'        => $block->get_editor_data(),
			'uid'         => $block->getUid(),
			'dataVersion' => 1
		);

		$apiEndpointUrl = Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_SAVEDBLOCKS;
		$httpObserver->post( Argument::exact( $apiEndpointUrl ), Argument::exact( [
			'headers' => [
				'X-AUTH-USER-TOKEN' => 'brizy-cloud-token-hash',
				'X-EDITOR-VERSION'  => BRIZY_EDITOR_VERSION,
			],
			'body'    => $cloudBlockData
		] ) )->shouldBeCalled();


		$client->createOrUpdateBlock( $block );
	}


	public function testUpdateBlock() {
		$projectObserver = $this->getProjectObjserver();
		$httpObserver    = $this->getHttpObjserver();
		$client          = new Brizy_Admin_Cloud_Client( $projectObserver->reveal(), $httpObserver->reveal() );


		// set up reuqest for library list
		$this->observerGetLibraryRequest( $httpObserver );


		$blockObserver = $this->prophesize( Brizy_Editor_Block::class );
		$blockObserver->get_editor_data()->willReturn( "SOME_ENCODED_JSON" );
		$blockObserver->getUid()->willReturn( "SOME_UID" );
		$blockObserver->getCloudId()->willReturn( "CLOUD_UID" );
		$blockObserver->getMeta()->willReturn( array() );
		$block = $blockObserver->reveal();

		$cloudBlockData = array(
			'container'   => 'container',
			'meta'        => array(),
			'data'        => $block->get_editor_data(),
			'uid'         => $block->getUid(),
			'dataVersion' => 1
		);

		$httpObserver->request( Argument::exact( Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_SAVEDBLOCKS ), Argument::exact( [
			'method'  => 'PUT',
			'headers' => [
				'X-AUTH-USER-TOKEN' => 'brizy-cloud-token-hash',
				'X-EDITOR-VERSION'  => BRIZY_EDITOR_VERSION,
			],
			'body'    => $cloudBlockData
		] ) )->shouldBeCalled();


		$client->createOrUpdateBlock( $block );
	}

	public function testDeleteBlock() {
		$projectObserver = $this->getProjectObjserver();
		$httpObserver    = $this->getHttpObjserver();

		$client = new Brizy_Admin_Cloud_Client( $projectObserver->reveal(), $httpObserver->reveal() );

		$apiEndpointUrl = Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_SAVEDBLOCKS . "/100" . '?' . http_build_query( [ 'container' => 'container' ] );

		$httpObserver->request( Argument::exact( $apiEndpointUrl ), Argument::exact( [
			'headers' => [
				'X-AUTH-USER-TOKEN' => 'brizy-cloud-token-hash',
				'X-EDITOR-VERSION'  => BRIZY_EDITOR_VERSION,
			],
			'method'  => 'DELETE'
		] ) )->shouldBeCalled();

		$client->deleteBlock( 100 );
	}


	public function testIsMediaUploaded() {
		$projectObserver = $this->getProjectObjserver();
		$httpObserver    = $this->getHttpObjserver();

		$client = new Brizy_Admin_Cloud_Client( $projectObserver->reveal(), $httpObserver->reveal() );

		$apiEndpointUrl = Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_MEDIA . '?name=MEDIA_UID&container=container';

		$httpObserver->get( Argument::exact( $apiEndpointUrl ), Argument::exact( [
			'headers' => [
				'X-AUTH-USER-TOKEN' => 'brizy-cloud-token-hash',
				'X-EDITOR-VERSION'  => BRIZY_EDITOR_VERSION,
			],
		] ) )->shouldBeCalled();

		$client->isMediaUploaded( 'MEDIA_UID' );
	}

	public function testUploadMedia() {

		$projectObserver = $this->getProjectObjserver();
		$httpObserver    = $this->getHttpObjserver();
		$uid             = md5( time() );

		$filePath = tempnam( '/tmp', 'test' );
		file_put_contents( $filePath, 'content' );


		$client = new Brizy_Admin_Cloud_Client( $projectObserver->reveal(), $httpObserver->reveal() );

		$apiEndpointUrl = Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_MEDIA;

		$httpObserver->post( Argument::exact( $apiEndpointUrl ), Argument::exact( [
			'headers' => [

				'X-AUTH-USER-TOKEN' => 'brizy-cloud-token-hash',
				'X-EDITOR-VERSION'  => BRIZY_EDITOR_VERSION,
			],
			'body'    => array(
				'container'  => 'container',
				'attachment' => base64_encode( 'content' ),
				'name'       => $uid,
				'filename'   => basename( $filePath )
			),
		] ) )->shouldBeCalled();

		$client->uploadMedia( $uid, $filePath );
	}

	public function testUploadFonts() {
		$projectObserver = $this->getProjectObjserver();
		$httpObserver    = $this->getHttpObjserver();

		$client = new Brizy_Admin_Cloud_Client( $projectObserver->reveal(), $httpObserver->reveal() );

		$apiEndpointUrl = Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_FONTS;

		$fontToCreate = [
			'id'        => 'askdalskdlaksd',
			'container' => 'container',
			'family'    => 'proxima-nova',
			'type'      => 'uploaded',
			'weights'   => [
				'400' => [
					'ttf'   => codecept_data_dir( 'fonts/pn-regular-webfont.ttf' ),
					'eot'   => codecept_data_dir( 'fonts/pn-regular-webfont.eot' ),
					'woff'  => codecept_data_dir( 'fonts/pn-regular-webfont.woff' ),
					'woff2' => codecept_data_dir( 'fonts/pn-regular-webfont.woff2' ),
				],
				'500' => [
					'eot'   => codecept_data_dir( 'fonts/pn-medium-webfont.eot' ),
					'woff'  => codecept_data_dir( 'fonts/pn-medium-webfont.woff' ),
					'woff2' => codecept_data_dir( 'fonts/pn-medium-webfont.woff2' ),
				],
				'700' => [
					'eot'   => codecept_data_dir( 'fonts/pn-bold-webfont.eot' ),
					'woff'  => codecept_data_dir( 'fonts/pn-bold-webfont.woff' ),
					'woff2' => codecept_data_dir( 'fonts/pn-bold-webfont.woff2' ),
				],
			]
		];

		$httpObserver->post( Argument::exact( $apiEndpointUrl ), Argument::exact( [
			'headers' => [

				'X-AUTH-USER-TOKEN' => 'brizy-cloud-token-hash',
				'X-EDITOR-VERSION'  => BRIZY_EDITOR_VERSION,
			],
			'body'    => array(
				'container' => 'container',
				'uid'       => $fontToCreate['id'],
				'family'    => $fontToCreate['family'],
				'files'     => $fontToCreate['weights'],
			),
		] ) )->shouldBeCalled();


		$client->createFont( $fontToCreate );

	}

	public function testGetFont() {
		$projectObserver = $this->getProjectObjserver();
		$httpObserver    = $this->getHttpObjserver();

		$uid = md5( time() );

		$client = new Brizy_Admin_Cloud_Client( $projectObserver->reveal(), $httpObserver->reveal() );

		$apiEndpointUrl = Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_FONTS . '?' . http_build_query( [
				'uid'       => $uid,
				'container' => 'container'
			] );
		$httpObserver->get( Argument::exact( $apiEndpointUrl ), Argument::exact( [
			'headers' => [

				'X-AUTH-USER-TOKEN' => 'brizy-cloud-token-hash',
				'X-EDITOR-VERSION'  => BRIZY_EDITOR_VERSION,
			]
		] ) )->shouldBeCalled();


		$client->getFont( $uid );
	}

	//=================================================================================================================

	public function testGetPopups() {
		$projectObserver = $this->getProjectObjserver();
		$httpObserver    = $this->getHttpObjserver();

		$client = new Brizy_Admin_Cloud_Client( $projectObserver->reveal(), $httpObserver->reveal() );

		$filters        = [ 'key' => 'val' ];
		$apiEndpointUrl = Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_POPUPS . '?' . http_build_query( [
				'key'       => 'val',
				'container' => 'container'
			] );
		$httpObserver->get( Argument::exact( $apiEndpointUrl ), Argument::exact( [
			'headers' => [

				'X-AUTH-USER-TOKEN' => 'brizy-cloud-token-hash',
				'X-EDITOR-VERSION'  => BRIZY_EDITOR_VERSION,
			]
		] ) )->shouldBeCalled();

		$client->getPopups( $filters );
	}


	public function testCreatePopup() {
		$projectObserver = $this->getProjectObjserver();
		$httpObserver    = $this->getHttpObjserver();
		$client          = new Brizy_Admin_Cloud_Client( $projectObserver->reveal(), $httpObserver->reveal() );


		// set up reuqest for library list
		$this->observerGetLibraryRequest( $httpObserver );

		$popupObserver = $this->prophesize( Brizy_Editor_Popup::class );
		$popupObserver->get_editor_data()->willReturn( "SOME_ENCODED_JSON" );
		$popupObserver->getUid()->willReturn( "SOME_UID" );
		$popupObserver->getCloudId()->willReturn( null );
		$popupObserver->getMeta()->willReturn( array() );
		$popup = $popupObserver->reveal();

		$cloudBlockData = array(
			'container'   => 'container',
			'meta'        => array(),
			'data'        => $popup->get_editor_data(),
			'is_autosave' => 0,
			'uid'         => $popup->getUid(),
			'dataVersion' => 1
		);


		$httpObserver->post( Argument::exact( Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_POPUPS ), Argument::exact( [
			'headers' => [
				'X-AUTH-USER-TOKEN' => 'brizy-cloud-token-hash',
				'X-EDITOR-VERSION'  => BRIZY_EDITOR_VERSION,
			],
			'body'    => $cloudBlockData
		] ) )->shouldBeCalled();


		$client->createOrUpdatePopup( $popup );
	}

	public function testUpdatePopup() {
		$projectObserver = $this->getProjectObjserver();
		$httpObserver    = $this->getHttpObjserver();
		$client          = new Brizy_Admin_Cloud_Client( $projectObserver->reveal(), $httpObserver->reveal() );

		// set up reuqest for library list
		$this->observerGetLibraryRequest( $httpObserver );

		$blockObserver = $this->prophesize( Brizy_Editor_Popup::class );
		$blockObserver->get_editor_data()->willReturn( "SOME_ENCODED_JSON" );
		$blockObserver->getUid()->willReturn( "SOME_UID" );
		$blockObserver->getCloudId()->willReturn( "CLOUD_UID" );
		$blockObserver->getMeta()->willReturn( "{}" );
		$popup = $blockObserver->reveal();

		$cloudBlockData = array(
			'container'   => 'container',
			'meta'        => '{}',
			'data'        => $popup->get_editor_data(),
			'is_autosave' => 0,
			'uid'         => $popup->getUid(),
			'dataVersion' => 1

		);

		$httpObserver->request( Argument::exact( Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_POPUPS ), Argument::exact( [
			'method'  => 'PUT',
			'headers' => [
				'X-AUTH-USER-TOKEN' => 'brizy-cloud-token-hash',
				'X-EDITOR-VERSION'  => BRIZY_EDITOR_VERSION,
			],
			'body'    => $cloudBlockData
		] ) )->shouldBeCalled();


		$client->createOrUpdatePopup( $popup );
	}

	public function testDeletePopup() {
		$projectObserver = $this->getProjectObjserver();
		$httpObserver    = $this->getHttpObjserver();

		$client = new Brizy_Admin_Cloud_Client( $projectObserver->reveal(), $httpObserver->reveal() );

		$apiEndpointUrl = Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_POPUPS . "/100" . '?' . http_build_query( [
				'container' => 'container'
			] );

		$httpObserver->request( Argument::exact( $apiEndpointUrl ), Argument::exact( [
			'headers' => [
				'X-AUTH-USER-TOKEN' => 'brizy-cloud-token-hash',
				'X-EDITOR-VERSION'  => BRIZY_EDITOR_VERSION,
			],
			'method'  => 'DELETE'
		] ) )->shouldBeCalled();

		$client->deletePopup( 100 );
	}

	//=================================================================================================================

	public function testGetLayouts() {
		$projectObserver = $this->getProjectObjserver();
		$httpObserver    = $this->getHttpObjserver();

		$client = new Brizy_Admin_Cloud_Client( $projectObserver->reveal(), $httpObserver->reveal() );

		$filters        = [ 'key' => 'val' ];
		$apiEndpointUrl = Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_LAYOUTS . '?' . http_build_query( [
				'key'       => 'val',
				'container' => 'container',
			] );
		$httpObserver->get( Argument::exact( $apiEndpointUrl ), Argument::exact( [
			'headers' => [

				'X-AUTH-USER-TOKEN' => 'brizy-cloud-token-hash',
				'X-EDITOR-VERSION'  => BRIZY_EDITOR_VERSION,
			]
		] ) )->shouldBeCalled();

		$client->getLayouts( $filters );
	}

	public function testCreateLayout() {
		$projectObserver = $this->getProjectObjserver();
		$httpObserver    = $this->getHttpObjserver();
		$client          = new Brizy_Admin_Cloud_Client( $projectObserver->reveal(), $httpObserver->reveal() );


		// set up reuqest for library list
		$this->observerGetLibraryRequest( $httpObserver );


		$blockObserver = $this->prophesize( Brizy_Editor_Layout::class );
		$blockObserver->get_editor_data()->willReturn( "SOME_ENCODED_JSON" );
		$blockObserver->getUid()->willReturn( "SOME_UID" );
		$blockObserver->getCloudId()->willReturn( null );
		$blockObserver->getMeta()->willReturn( "{}" );
		$layout = $blockObserver->reveal();

		$cloudBlockData = array(
			'container'   => 'container',
			'meta'        => '{}',
			'data'        => $layout->get_editor_data(),
			'uid'         => $layout->getUid(),
			'dataVersion' => 1
		);


		$httpObserver->post( Argument::exact( Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_LAYOUTS ), Argument::exact( [
			'headers' => [
				'X-AUTH-USER-TOKEN' => 'brizy-cloud-token-hash',
				'X-EDITOR-VERSION'  => BRIZY_EDITOR_VERSION,
			],
			'body'    => $cloudBlockData
		] ) )->shouldBeCalled();


		$client->createOrUpdateLayout( $layout );
	}


	public function testUpdateLayout() {
		$projectObserver = $this->getProjectObjserver();
		$httpObserver    = $this->getHttpObjserver();
		$client          = new Brizy_Admin_Cloud_Client( $projectObserver->reveal(), $httpObserver->reveal() );


		// set up reuqest for library list
		$this->observerGetLibraryRequest( $httpObserver );


		$blockObserver = $this->prophesize( Brizy_Editor_Layout::class );
		$blockObserver->get_editor_data()->willReturn( "SOME_ENCODED_JSON" );
		$blockObserver->getUid()->willReturn( "SOME_UID" );
		$blockObserver->getCloudId()->willReturn( "CLOUD_UID" );
		$blockObserver->getMeta()->willReturn( "{}" );
		$layout = $blockObserver->reveal();

		$cloudBlockData = array(
			'container'   => 'container',
			'meta'        => '{}',
			'data'        => $layout->get_editor_data(),
			'uid'         => $layout->getUid(),
			'dataVersion' => 1
		);


		$httpObserver->request( Argument::exact( Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_LAYOUTS ), Argument::exact( [
			'headers' => [
				'X-AUTH-USER-TOKEN' => 'brizy-cloud-token-hash',
				'X-EDITOR-VERSION'  => BRIZY_EDITOR_VERSION,
			],
			'method'  => 'PUT',
			'body'    => $cloudBlockData
		] ) )->shouldBeCalled();


		$client->createOrUpdateLayout( $layout );
	}

	public function testDeleteLayout() {
		$projectObserver = $this->getProjectObjserver();
		$httpObserver    = $this->getHttpObjserver();

		$client = new Brizy_Admin_Cloud_Client( $projectObserver->reveal(), $httpObserver->reveal() );

		$apiEndpointUrl = Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_LAYOUTS . "/100" . '?' . http_build_query( [
				'container' => 'container'
			] );;

		$httpObserver->request( Argument::exact( $apiEndpointUrl ), Argument::exact( [
			'headers' => [

				'X-AUTH-USER-TOKEN' => 'brizy-cloud-token-hash',
				'X-EDITOR-VERSION'  => BRIZY_EDITOR_VERSION,
			],
			'method'  => 'DELETE'
		] ) )->shouldBeCalled();

		$client->deleteLayout( 100 );
	}


	private function observerGetLibraryRequest( $httpObserver ) {
		$apiEndpointUrl = Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_LIBRARY;
		$httpObserver->get( $apiEndpointUrl, Argument::containing( [

			'X-AUTH-USER-TOKEN' => 'brizy-cloud-token-hash',
			'X-EDITOR-VERSION'  => BRIZY_EDITOR_VERSION,
		] ) )->willReturn(
			[
				'body'     => '[{"id":4,"name":"My Personal Projects"},{"id":58930,"name":"fsfaf"}]',
				'response' =>
					array(
						'code'    => 200,
						'message' => 'OK',
					),
				'cookies'  =>
					array(),
				'filename' => null,
			]
		);
	}

}
