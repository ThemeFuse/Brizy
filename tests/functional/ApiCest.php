<?php


class ApiCest {

	public function _before( FunctionalTester $I ) {
		wp_cache_flush();
		$I->loginAs( 'admin', 'admin' );
	}

	/**
	 * @param AcceptanceTester $I
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
			$I->assertArrayHasKey( 'post_title', $postAsArray, 'It should return the post title' );
			$I->assertArrayHasKey( 'post_type_label', $postAsArray, 'It should return the post type label' );
		}

	}
}