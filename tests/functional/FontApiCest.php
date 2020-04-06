<?php

class FontApiCest {

	/**
	 * @param FunctionalTester $I
	 */
	public function _before( FunctionalTester $I ) {
		wp_cache_flush();
		@$I->cleanUploadsDir();
		$I->dontHavePostInDatabase( [ 'post_type' => Brizy_Admin_Fonts_Main::CP_FONT ] );
		$I->dontHavePostInDatabase( [ 'post_type' => 'attachment' ] );
		$I->loginAs( 'admin', 'admin' );
	}

	public function requestWithoutVersionKey( FunctionalTester $I ) {
		$I->wantToTest( 'Request with invalid editor version' );
		$I->sendGET( '/wp-admin/admin-ajax.php?' . build_query(
				[
					'action' => 'brizy-get-fonts'
				] ) );
		$I->seeResponseCodeIs( 400 );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function compilerFontParametersTest( FunctionalTester $I ) {

		$compilerParams = apply_filters( 'brizy_compiler_params', [] );
		$I->assertArrayNotHasKey( 'uploaded_fonts', $compilerParams, 'The compiler parameters should not contain fonts' );
	}

	/**
	 * @param FunctionalTester $I
	 *
	 * @throws \Codeception\Exception\ModuleException
	 */
	public function getFontsDataTest( FunctionalTester $I ) {
		$fontFamily = 'proxima_nova_';

		$I->haveManyFontsInDataBase( 1, $fontFamily, [
			'400'       => [ 'ttf' ],
			'500italic' => [ 'ttf' ]
		], 'uploaded', 'trash' );

		$I->haveManyFontsInDataBase( 15, $fontFamily, [ '400' => [ 'ttf' ], '500italic' => [ 'ttf' ] ], 'uploaded' );


		$I->sendGET( '/wp-admin/admin-ajax.php?' . build_query(
				[
					'action'  => 'brizy-get-fonts',
					'version' => BRIZY_EDITOR_VERSION
				] ) );
		$I->seeResponseCodeIsSuccessful();
		$fonts = json_decode( $response = $I->grabResponse() );

		$fonts = $fonts->data;

		$I->assertIsArray( $fonts, "The returned result should be an array" );
		$I->assertCount( 15, $fonts, "The returned result should contain only 15 fonts" );

		foreach ( $fonts as $i => $font ) {
			$I->assertIsObject( $font, "The Font should be an object" );

			// family
			$I->assertTrue( isset( $font->id ), "The property 'id' must be present." );
			$I->assertTrue( isset( $font->family ), "The property 'family' must be present." );
			$I->assertStringContainsString( $fontFamily, $font->family, "The 'family' value should be valid" );

			//weights
			$I->assertTrue( isset( $font->weights ), "The property 'weights' must be present." );
			$I->assertEquals( [ '400', '500italic' ], $font->weights, "The 'weights' array should be valid" );
		}
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function createFontTest( FunctionalTester $I ) {

		$I->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Fonts_Main::CP_FONT,
			'post_title'  => "Test Font",
			'post_status' => 'publish',
			'meta_input'  => [
				'brizy_post_uid' => 'gffbf00297b0b4e9ee27af32a7b79c3330',
			],
		] );


		$fontFamily = 'proxima_nova';
		$uid        = md5( time() );
		$I->sendPost( '/wp-admin/admin-ajax.php?' . build_query(
				[
					'action'  => 'brizy-create-font',
					'version' => BRIZY_EDITOR_VERSION
				] ), [
			'family' => $fontFamily,
			'id'     => $uid
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
		$I->assertIsObject( $font, "The Font should be an object" );

		$font = $font->data;

		// family
		$I->assertTrue( isset( $font->id ), "The property 'id' must be present." );
		$I->assertEquals( $uid, $font->id, "It should return the provided uid" );
		$I->assertTrue( isset( $font->family ), "The property 'family' must be present." );
		$I->assertStringContainsString( $fontFamily, $font->family, "The 'family' value should be valid" );

		//weights
		$I->assertTrue( isset( $font->weights ), "The property 'weights' must be present." );
		$I->assertEquals( [ '400', '500', '700' ], $font->weights, "The 'weights' array should be valid" );


		$I->seePostInDatabase( [
			'post_type'   => Brizy_Admin_Fonts_Main::CP_FONT,
			'post_title'  => $fontFamily,
			'post_status' => 'publish',
		] );

		$postsTable = $I->grabPostsTableName();

		$attachmentCount = $I->countRowsInDatabase( $postsTable, [
			'post_type' => 'attachment',
		] );

		$I->seePostMetaInDatabase( [
			'meta_key'   => 'brizy-font-type',
			'meta_value' => 'uploaded'
		] );

		$I->assertEquals( 10, $attachmentCount, 'Is should create 10 attachments' );


		$I->seePostMetaInDatabase( [
			'meta_key'   => 'brizy_post_uid',
			'meta_value' => $uid
		] );

		$I->seePostMetaInDatabase( [
			'meta_key'   => 'brizy-font-weight',
			'meta_value' => '400'
		] );

		$I->seePostMetaInDatabase( [
			'meta_key'   => 'brizy-font-weight',
			'meta_value' => '500'
		] );

		$I->seePostMetaInDatabase( [
			'meta_key'   => 'brizy-font-weight',
			'meta_value' => '700'
		] );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function createDuplicateFontNameTest( FunctionalTester $I ) {

		$uid        = 'gffbf00297b0b4e9ee27af32a7b79c3330';
		$fontFamily = 'proxima_nova';
		$fontId     = $I->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Fonts_Main::CP_FONT,
			'post_title'  => $fontFamily,
			'post_status' => 'publish',
			'meta_input'  => [
				'brizy_post_uid'  => $uid,
				'brizy-font-type' => 'uploaded',
			],
		] );

		$I->havePostInDatabase( [
			'post_type'   => 'attachment',
			'post_status' => 'publish',
			'post_parent' => $fontId,
			'meta_input'  => [
				'brizy-font-weight'    => '500italic',
				'brizy-font-file-type' => 'ttf'
			],
		] );


		$fontFamily = 'proxima_nova';

		$testData = array(
			array( 'family' => $fontFamily, 'id' => $uid ),
			array( 'family' => $fontFamily, 'id' => md5( 'test' ) ),
			array( 'family' => 'family_name', 'id' => $uid ),
		);
		foreach ( $testData as $data ) {
			$I->sendPOST( '/wp-admin/admin-ajax.php?' . build_query( [ 'action' => 'brizy-create-font' ] ), [
				'family' => $data['family'],
				'id'     => $data['id']
			], [
				'fonts' => [
					'500italic' => [
						'ttf'   => codecept_data_dir( 'fonts/pn-regular-webfont.ttf' ),
						'eot'   => codecept_data_dir( 'fonts/pn-regular-webfont.eot' ),
						'woff'  => codecept_data_dir( 'fonts/pn-regular-webfont.woff' ),
						'woff2' => codecept_data_dir( 'fonts/pn-regular-webfont.woff2' ),
					]
				]
			] );

			$I->seeResponseCodeIs( 400 );
			$response = $I->grabResponse();
			$font     = json_decode( $response );
			$I->assertFalse( $font->success, 'The success status of the request should be false' );
		}
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function getFontCssTest( FunctionalTester $I ) {
		$I->wantToTest( 'The CSS file return for a font family' );
		$fontFamily = 'proxima_nova';
		$I->sendPOST( '/wp-admin/admin-ajax.php?' . build_query( [
				'action'  => 'brizy-create-font',
				'version' => BRIZY_EDITOR_VERSION
			] ), [
			'family' => $fontFamily,
			'id'     => md5( 1 )
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

		$I->seeResponseCodeIsSuccessful();

		$font = json_decode( $I->grabResponse() )->data;

		$ENDPOINT = 'brizy-font';
		$I->sendGET( '/?' . build_query( [ $ENDPOINT => "{$font->id}:400,500,700" ] ) );

		$I->seeResponseCodeIsSuccessful();
		$response = $I->grabResponse();
		$I->seeHttpHeader( 'Content-Type', 'text/css;charset=UTF-8' );

		$I->see( 'font-family: \'' . $font->id . '\'' );
		$I->see( 'pn-regular-webfont.ttf' );
		$I->see( 'pn-regular-webfont.eot' );
		$I->see( 'pn-regular-webfont.woff' );
		$I->see( 'pn-regular-webfont.woff2' );
		$I->see( 'pn-medium-webfont.eot' );
		$I->see( 'pn-medium-webfont.woff' );
		$I->see( 'pn-medium-webfont.woff2' );
		$I->see( 'pn-bold-webfont.eot' );
		$I->see( 'pn-bold-webfont.woff' );
		$I->see( 'pn-bold-webfont.woff2' );
		$I->see( 'format(\'truetype\')' );
	}


	/**
	 * @param FunctionalTester $I
	 *
	 * @throws \Codeception\Exception\ModuleException
	 */
	public function deleteFont( FunctionalTester $I ) {

		$fontFamily     = 'proxima_nova';
		$uploadedFontId = $I->haveFontInDataBase( md5( 1 ), $fontFamily, [ '400' => [ 'ttf' ] ], 'uploaded' );
		$googleFontId   = $I->haveFontInDataBase( md5( 2 ), $fontFamily, [ '400' => [ 'ttf' ] ], 'google' );

		$uploadedFontUId = get_post_meta( $uploadedFontId, 'brizy_post_uid', true );

		$I->sendPOST( '/wp-admin/admin-ajax.php?' . build_query( [
				'action'  => 'brizy-delete-font',
				'version' => BRIZY_EDITOR_VERSION
			] ), [
			'id' => $uploadedFontUId,
		] );

		$I->seeResponseCodeIsSuccessful();

		$I->dontSeePostInDatabase( [ 'ID' => $uploadedFontId ] );
		$I->canSeePostInDatabase( [ 'ID' => $googleFontId ] );

		$I->dontSeeAttachmentInDatabase( [ 'post_parent' => $uploadedFontId ] );
		$I->canSeeAttachmentInDatabase( [ 'post_parent' => $googleFontId ] );

	}

	/**
	 * @param FunctionalTester $I
	 *
	 * @throws \Codeception\Exception\ModuleException
	 */
	public function deleteUnknownFont( FunctionalTester $I ) {

		$uid            = md5( 1 );
		$fontFamily     = 'proxima_nova';
		$uploadedFontId = $I->haveFontInDataBase( $uid, $fontFamily, [ '400' => [ 'ttf' ] ], 'uploaded' );

		$I->sendPOST( '/wp-admin/admin-ajax.php?' . build_query( [
				'action'  => 'brizy-delete-font',
				'version' => BRIZY_EDITOR_VERSION
			] ), [
			'id' => 'unknown',
		] );

		$I->canSeeResponseCodeIs( 404 );

		$I->canSeePostInDatabase( [ 'ID' => $uploadedFontId ] );
		$I->canSeeAttachmentInDatabase( [ 'post_parent' => $uploadedFontId ] );
	}

}
