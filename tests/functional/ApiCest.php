<?php

class ApiCest {

	public function _before( FunctionalTester $I ) {
		wp_cache_flush();
		$I->loginAs( 'admin', 'admin' );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function getServerTimestampTest( FunctionalTester $I ) {

		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'  => 'brizy_timestamp',
				'version' => BRIZY_EDITOR_VERSION
			] ) );
		$I->seeResponseCodeIs( 200 );

		$response = $I->grabResponse();
		$object   = json_decode( $response );

		$I->assertTrue( isset( $object->data->timestamp ), 'It should contain timestamp property' );

	}

	/**
	 * @param FunctionalTester $I
	 *
	 * @throws \Gumlet\ImageResizeException
	 */
	public function getAttachmentUid( FunctionalTester $I ) {

		$attachmentId = $I->haveAttachmentInDatabase( codecept_data_dir( 'dump.sql' ), null, [] );

		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'        => 'brizy_create_attachment_uid',
				'attachment_id' => $attachmentId,
				'version'       => BRIZY_EDITOR_VERSION
			] ) );
		$response = $I->grabResponse();
		$I->seeResponseCodeIs( 200 );

		$response = $I->grabResponse();
		$object   = json_decode( $response );

		$I->assertTrue( isset( $object->data->uid ), 'It should contain timestamp property' );

		$I->seePostMetaInDatabase( [
			'post_id'    => $attachmentId,
			'meta_key'   => 'brizy_post_uid',
			'meta_value' => $object->data->uid
		] );

		// test with invalid attachment
		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'  => 'brizy_create_attachment_uid',
				'version' => BRIZY_EDITOR_VERSION
			] ) );
		$I->seeResponseCodeIs( 400 );

		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'        => 'brizy_create_attachment_uid',
				'attachment_id' => 123354354,
				'version'       => BRIZY_EDITOR_VERSION
			] ) );
		$I->seeResponseCodeIs( 400 );
	}


	/**
	 * @param FunctionalTester $I
	 *
	 * @throws \Gumlet\ImageResizeException
	 */
	public function downloadAttachmentUid( FunctionalTester $I ) {
		$attachmentId = $I->haveAttachmentInDatabase( codecept_data_dir( 'dump.sql' ), null, [] );
		$meta_value   = md5( $attachmentId );
		$I->havePostmetaInDatabase( $attachmentId, 'brizy_post_uid', $meta_value );

		$I->amOnPage( '/?' . http_build_query( [ 'brizy_attachment' => $meta_value ] ) );
		$I->seeResponseCodeIs( 200 );


		$I->sendAjaxGetRequest( '/?' . build_query( [ 'brizy_attachment' => 'unknown uid' ] ) );
		$I->seeResponseCodeIs( 404 );
	}

	public function getPostList( FunctionalTester $I ) {
		$I->haveManyPostsInDatabase( 5, [
			'post_type'  => 'page',
			'post_title' => 'Title {{n}}'
		] );

		// test with invalid attachment
		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'filterTerm' => 'Title',
				'action'     => 'brizy_get_posts',
				'version'    => BRIZY_EDITOR_VERSION
			] ) );

		$response = $I->grabResponse();
		$response = json_decode( $response );

		foreach ( $response->data->posts as $apost ) {
			$postAsArray = (array) $apost;
			$I->assertArrayHasKey( 'ID', $postAsArray, 'It should return the post id' );
			$I->assertArrayHasKey( 'uid', $postAsArray, 'It should create and return the post uid' );
			$I->assertArrayHasKey( 'post_type', $postAsArray, 'It should return the post type' );
			$I->assertArrayHasKey( 'title', $postAsArray, 'It should return the post title' );
			$I->assertArrayHasKey( 'post_type_label', $postAsArray, 'It should return the post type label' );
		}
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function getProjectTest( FunctionalTester $I ) {
		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'  => 'brizy_get_project',
				'version' => BRIZY_EDITOR_VERSION
			] ) );
		$I->seeResponseCodeIs( 200 );
		$response = $I->grabResponse();
		$response = json_decode( $response );
		$project  = (array) $response->data;
		$I->assertArrayHasKey( 'id', $project, 'It should return the project id' );
		$I->assertArrayHasKey( 'data', $project, 'It should return the project data' );
		$I->assertArrayHasKey( 'dataVersion', $project, 'It should return the project dataVersion' );

		$check = Brizy_Editor::get()->checkIfProjectIsLocked();
		$I->assertFalse( $check !== false, 'It should be return false as the project is not locked' );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function getPageTest( FunctionalTester $I ) {

		$data   = 'eyJ0eXBlIjoiU2VjdGlvbiIsImJsb2NrSWQiOiJCbGFuazAwMExpZ2h0IiwidmFsdWUiOnsiX3N0eWxlcyI6WyJzZWN0aW9uIl0sIml0ZW1zIjpbeyJ0eXBlIjoiU2VjdGlvbkl0ZW0iLCJ2YWx1ZSI6eyJfc3R5bGVzIjpbInNlY3Rpb24taXRlbSJdLCJpdGVtcyI6W10sIl9pZCI6ImFsYWF5c3dlcnNxa3d0cmhxdGJxdmxjY2lqY3BzYXByaGxtcyJ9fV0sIl9pZCI6InljZ3dsd295d3l1bnRlb2NscWRkdGNyY3FxenVjeGpydWNnZSIsIl90aHVtYm5haWxTcmMiOiJxd2N2d2xzanRmdGR2cHh5Y2xkdXhqbnRkd25pcXR1aGZmaHkiLCJfdGh1bWJuYWlsV2lkdGgiOjYwMCwiX3RodW1ibmFpbEhlaWdodCI6NzAsIl90aHVtYm5haWxUaW1lIjoxNTU5ODkxMDY0OTQzfX0=';
		$postId = $I->havePostInDatabase( [
			'post_type'   => 'page',
			'post_title'  => 'Page',
			'post_name'   => 'Page',
			'post_status' => 'publish',
			'meta_input'  => [
				'brizy'                       => serialize( [
						"brizy-post" => [
							'compiled_html'      => '',
							'compiled_html_body' => null,
							'compiled_html_head' => null,
							'editor_version'     => null,
							'compiler_version'   => null,
							'plugin_version'     => null,
							'editor_data'        => $data,
							'brizy-use-brizy'    => true,
						],
					]
				),
				'brizy_post_uid'              => md5( time() ),
				'brizy-post-editor-version'   => BRIZY_EDITOR_VERSION,
				'brizy-post-compiler-version' => BRIZY_EDITOR_VERSION,
				'brizy-need-compile'          => 0
			],
		] );

		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'  => 'brizy_editor_get_items',
				'post'    => $postId,
				'version' => BRIZY_EDITOR_VERSION
			] ) );
		$I->seeResponseCodeIs( 200 );
		$response = json_decode( $I->grabResponse() );
		$page     = (array) $response->data[0];
		$I->assertArrayHasKey( 'id', $page, 'It should return the page id' );
		$I->assertArrayHasKey( 'data', $page, 'It should return the page data' );
		$I->assertArrayHasKey( 'dataVersion', $page, 'It should return the page dataVersion' );
		$I->assertArrayHasKey( 'status', $page, 'It should return the page status' );
		$I->assertArrayHasKey( 'template', $page, 'It should return the page template' );
		$I->assertArrayHasKey( 'title', $page, 'It should return the page title' );
		$I->assertArrayHasKey( 'url', $page, 'It should return the page url' );
		$I->assertArrayHasKey( 'slug', $page, 'It should return the page slug' );
		$I->assertArrayHasKey( 'is_index', $page, 'It should return the page is_index' );

		$I->assertEquals( $postId, $page['id'], 'It should return the correct id' );
		$I->assertEquals( 'publish', $page['status'], 'It should return the correct status' );
		$I->assertEquals( 0, $page['dataVersion'], 'It should return the correct dataVersion' );
		$I->assertEquals( base64_decode( $data ), $page['data'], 'It should return the correct editor data' );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function postProjectTest( FunctionalTester $I ) {

		// get project
		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'  => 'brizy_get_project',
				'version' => BRIZY_EDITOR_VERSION
			] ) );

		$response = $I->grabResponse();
		$response = json_decode( $response );

		$data              = $response->data;
		$data->dataVersion += 1;

		$I->sendAjaxPostRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'  => 'brizy_set_project',
				'version' => BRIZY_EDITOR_VERSION
			] ), (array) $data );
		$I->seeResponseCodeIs( 200 );


		// autosave
		$I->sendAjaxPostRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'      => 'brizy_set_project',
				'version'     => BRIZY_EDITOR_VERSION,
				'is_autosave' => 1
			] ), (array) $data );
		$I->seeResponseCodeIs( 200 );


		// the save should work with the latest version saved
		$data              = $response->data;
		$data->dataVersion += 1;

		$I->sendAjaxPostRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'  => 'brizy_set_project',
				'version' => BRIZY_EDITOR_VERSION
			] ), (array) $data );
		$I->seeResponseCodeIs( 200 );
	}

	public function saveProjectWithWrongVersion( FunctionalTester $I ) {
		// get project
		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'  => 'brizy_get_project',
				'version' => BRIZY_EDITOR_VERSION
			] ) );

		$response = $I->grabResponse();
		$response = json_decode( $response );

		$data              = $response->data;
		$data->dataVersion = 10;

		$I->sendAjaxPostRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'  => 'brizy_set_project',
				'version' => BRIZY_EDITOR_VERSION
			] ), (array) $data );
		$I->seeResponseCodeIs( 400 );
	}

	public function heartBeatTest( FunctionalTester $I ) {

		// get project
		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'  => 'brizy_heartbeat',
				'version' => BRIZY_EDITOR_VERSION
			] ) );

		$I->seeResponseCodeIs( 200 );
		$response = $I->grabResponse();
		$response = json_decode( $response );

		$data = $response->data;

		$I->assertFalse( $data->locked, 'Locked should be false' );
		$I->assertFalse( $data->lockedBy, 'LockedBy should be false' );
	}

	public function lockProjectTest( FunctionalTester $I ) {
		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'  => 'brizy_lock_project',
				'hash'    => wp_create_nonce( Brizy_Editor_API::nonce ),
				'version' => BRIZY_EDITOR_VERSION
			] ) );

		$I->seeResponseCodeIs( 200 );


		$check = Brizy_Editor::get()->checkIfProjectIsLocked();
		$I->assertTrue( $check !== false, 'It should be return true as the project is locked' );
	}

	public function removeLockTest( FunctionalTester $I ) {

		$project = Brizy_Editor_Project::get();
		$I->havePostmetaInDatabase(
			$project->getWpPostId(),
			'_edit_lock',
			time() . ':1'
		);

		// get project
		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'  => 'brizy_remove_lock',
				'version' => BRIZY_EDITOR_VERSION
			] ) );

		$I->seeResponseCodeIs( 200 );
		$response = $I->grabResponse();
		$response = json_decode( $response );

		$data = $response->data;

		$I->assertFalse( $data->locked, 'Locked should be false' );
		$I->assertFalse( $data->lockedBy, 'LockedBy should be false' );

		$I->dontSeePostMetaInDatabase( [
			'post_id'  => $project->getWpPostId(),
			'meta_key' => '_edit_lock',
		] );
	}

	public function takeOverTest( FunctionalTester $I ) {

		$project = Brizy_Editor_Project::get();
		$I->havePostmetaInDatabase(
			$project->getWpPostId(),
			'_edit_lock',
			time() . ':2'
		);

		// get project
		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'  => 'brizy_take_over',
				'version' => BRIZY_EDITOR_VERSION
			] ) );

		$I->seeResponseCodeIs( 200 );
		$response = $I->grabResponse();
		$response = json_decode( $response );

		$data = $response->data;

		$I->assertFalse( $data->locked, 'Locked should be false' );
		$I->assertFalse( $data->lockedBy, 'LockedBy should be false' );
	}

	public function getPostInfoTest( FunctionalTester $I ) {
		$postId = $I->havePostInDatabase( [
			'post_type'    => 'page',
			'post_title'   => 'Title {{n}}',
			'post_content' => 'Page content'
		] );

		// test with invalid attachment
		$fields = [ 'ID', 'post_title', 'post_content' ];
		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'post_id' => $postId,
				'fields'  => $fields,
				'action'  => 'brizy_get_post_info',
				'version' => BRIZY_EDITOR_VERSION
			] ) );

		$I->seeResponseCodeIsSuccessful();

		$response = $I->grabResponse();
		$response = json_decode( $response );

		$returnedKeys = array_keys( (array) $response->data );

		$I->assertEmpty( array_diff( $returnedKeys, $fields ), 'It should not return unknown keys' );
		$I->assertEqualsCanonicalizing( array_intersect( $returnedKeys, $fields ), $fields, 'It should return the requested fields' );


		// test with invalid attachment
		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'post_id' => $postId,
				'action'  => 'brizy_get_post_info',
				'version' => BRIZY_EDITOR_VERSION
			] ) );

		$I->seeResponseCodeIsSuccessful();

		$response = $I->grabResponse();
		$response = json_decode( $response );

		$returnedKeys = array_keys( (array) $response->data );

		$I->assertEmpty( array_diff( $returnedKeys, $fields ), 'It should not return unknown keys' );
		$I->assertEqualsCanonicalizing( array_intersect( $returnedKeys, $fields ), $fields, 'It should return the requested fields' );
	}

	public function getInvalidPostInfoTest( FunctionalTester $I ) {

		// test with invalid attachment
		$fields = [ 'ID', 'post_title', 'post_content' ];
		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'post_id' => 12333333333,
				'fields'  => $fields,
				'action'  => 'brizy_get_post_info',
				'version' => BRIZY_EDITOR_VERSION
			] ) );

		$I->seeResponseCodeIs( 404 );
	}

	public function getPlaceholderContentTest( FunctionalTester $I ) {

		$postId = $I->havePostInDatabase( [
			'post_type'    => 'page',
			'post_title'   => 'Title 1',
			'post_content' => 'Page content'
		] );

		$permalink = get_permalink( $postId );

		// test with invalid attachment
		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'post_id'      => $postId,
				'action'       => 'brizy_placeholder_content',
				'version'      => BRIZY_EDITOR_VERSION,
				'placeholders' => [
					'{{brizy_dc_permalink post_id=\'' . $postId . '\'}}',
					'{{brizy_dc_post_title post_id=\'' . $postId . '\'}}',
					'{{brizy_dc_post_title post_id="' . $postId . '"}}'
				]
			] ) );
		$I->seeResponseCodeIsSuccessful();

		$response = $I->grabResponse();
		$response = json_decode( $response );

		$I->assertTrue( isset( $response->data->placeholders ), 'The response should have the property placeholders' );

		$I->assertCount( 3, $response->data->placeholders, 'It should return two responses' );

		$I->assertStringNotContainsString( '{{brizy_dc_permalink post_id=\'' . $postId . '\'}}', $response->data->placeholders[0], 'Is should replace the place holder with the post permalink' );
		$I->assertStringNotContainsString( '{{brizy_dc_post_title post_id=\'' . $postId . '\'}}', $response->data->placeholders[1], 'Is should replace the place holder with the post title' );
		$I->assertStringNotContainsString( '{{brizy_dc_post_title post_id="' . $postId . '"}}', $response->data->placeholders[2], 'Is should replace the place holder with the post title' );
	}

	public function setTemplateTypeTest( FunctionalTester $I ) {
		$postId = $I->havePostInDatabase( [
			'post_type'   => 'brizy_template',
			'post_title'  => 'Template',
			'post_name'   => 'Template',
			'post_status' => 'publish',
		] );

		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'template_id'   => $postId,
				'template_type' => 'single',
				'action'        => 'brizy_set_template_type',
				'version'       => BRIZY_EDITOR_VERSION
			] ) );

		$I->seeResponseCodeIsSuccessful();
		$I->seePostMetaInDatabase( [
			'post_id'    => $postId,
			'meta_key'   => Brizy_Admin_Templates::TEMPLATE_TYPE_KEY,
			'meta_value' => 'single'
		] );

		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'template_id'   => $postId,
				'template_type' => 'archive',
				'action'        => 'brizy_set_template_type',
				'version'       => BRIZY_EDITOR_VERSION
			] ) );

		$I->seeResponseCodeIsSuccessful();
		$I->seePostMetaInDatabase( [
			'post_id'    => $postId,
			'meta_key'   => Brizy_Admin_Templates::TEMPLATE_TYPE_KEY,
			'meta_value' => 'archive'
		] );
	}

	public function setTemplateTypeFailsTest( FunctionalTester $I ) {
		$postId = $I->havePostInDatabase( [
			'post_type'   => 'brizy_template',
			'post_title'  => 'Template',
			'post_name'   => 'Template',
			'post_status' => 'publish',

		] );

		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'template_id'   => 54645,
				'template_type' => 'single',
				'action'        => 'brizy_set_template_type',
				'version'       => BRIZY_EDITOR_VERSION
			] ) );

		$I->seeResponseCodeIs( 400 );

		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'template_id'   => $postId,
				'template_type' => 'unknown_type',
				'action'        => 'brizy_set_template_type',
				'version'       => BRIZY_EDITOR_VERSION
			] ) );

		$I->seeResponseCodeIs( 400 );
	}
}
