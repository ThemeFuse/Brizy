<?php

class FontApiCest {
	public function _before( FunctionalTester $I ) {
		$I->loginAs( 'admin', 'admin' );
	}


	public function createFontTest( FunctionalTester $I ) {
		$fontFamily = 'proxima_nova';
		$I->sendPOST( '/wp-admin/admin-ajax.php?' . build_query( [ 'action' => Brizy_Admin_Fonts_Api::AJAX_CREATE_FONT_ACTION ] ), [
			'family' => $fontFamily,
		], [
			'fonts' => [
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
		] );

        $font = json_decode( $response = $I->grabResponse() );

		$I->seeResponseCodeIsSuccessful();

		$I->assertTrue( isset( $font->data ), 'Response should contain property: data' );

		$font = $font->data;

		$I->assertTrue( isset( $font->uid ), 'Response should contain property: uid' );
		$I->assertTrue( isset( $font->postId ), 'Response should contain property: postId' );

		$I->seeResponseCodeIsSuccessful();
		$I->seePostInDatabase( [
			'ID'          => $font->postId,
			'post_type'   => Brizy_Admin_Fonts_Main::CP_FONT,
			'post_title'  => $fontFamily,
			'post_name'   => $fontFamily,
			'post_status' => 'publish',
		] );


		$postsTable = $I->grabPostsTableName();

		$attachmentCount = $I->countRowsInDatabase( $postsTable, [
			'post_type' => 'attachment',
			'post_parent' => $font->postId
		] );

		$I->assertEquals( 10, $attachmentCount, 'Is should create 10 attachments' );

		$I->seePostMetaInDatabase( [ 'post_id' => $font->postId, 'meta_key' => 'brizy_post_uid', 'meta_value' => $font->uid ] );
	}


}
