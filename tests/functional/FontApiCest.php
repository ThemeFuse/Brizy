<?php

class FontApiCest {
	public function _before( FunctionalTester $I ) {
		$I->loginAs( 'admin', 'admin' );
		@$I->cleanUploadsDir();
	}

	public function compilerFontParametersTest(FunctionalTester $I) {

		$compilerParams = apply_filters( 'brizy_compiler_params', [] );
		$I->assertArrayHasKey( 'uploaded_fonts', $compilerParams ,'The compiler parameters should contain fonts');
	}

	public function getFontsDataTest( FunctionalTester $I ) {
		$fontFamily = 'proxima_nova_';

		$I->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Fonts_Main::CP_FONT,
			'post_title'  => $fontFamily . '0',
			'post_name'   => $fontFamily . '0',
			'post_status' => 'trash',
			'meta_input'  => [
				'brizy_post_uid' => 'gffbf00297b0b4e9ee27af32a7b79c3330',
			],
		] );

		for ( $i = 1; $i <= 15; $i ++ ) {
			$fontId = $I->havePostInDatabase( [
				'post_type'   => Brizy_Admin_Fonts_Main::CP_FONT,
				'post_title'  => $fontFamily . $i,
				'post_name'   => $fontFamily . $i,
				'post_status' => 'publish',
				'meta_input'  => [
					'brizy_post_uid' => 'gffbf00297b0b4e9ee27af32a7b79c333' . $i,
				],
			] );

			$I->havePostInDatabase( [
				'post_type'   => 'attachment',
				'post_status' => 'publish',
				'post_parent' => $fontId,
				'meta_input'  => [
					'brizy-font-weight'    => 400,
					'brizy-font-file-type' => 'ttf'
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
		}

		$I->sendGET( '/wp-admin/admin-ajax.php?' . build_query( [ 'action' => Brizy_Admin_Fonts_Api::AJAX_GET_FONTS_ACTION ] ) );
		$I->seeResponseCodeIsSuccessful();
		$fonts = json_decode( $response = $I->grabResponse() );

		$fonts = $fonts->data;

		$I->assertIsArray( $fonts, "The returned result should be an array" );
		$I->assertCount( 15, $fonts, "The returned result should contain only 15 fonts" );

		foreach ( $fonts as $i => $font ) {
			$I->assertIsObject( $font, "The Font should be an object" );

			// family
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
			'post_name'   => "Test Font",
			'post_status' => 'publish',
			'meta_input'  => [
				'brizy_post_uid' => 'gffbf00297b0b4e9ee27af32a7b79c3330',
			],
		] );


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


		echo $response = $I->grabResponse();

		$I->seeResponseCodeIsSuccessful();

		$font = json_decode( $response = $I->grabResponse() );

		$I->assertTrue( isset( $font->data ), 'Response should contain property: data' );
		$I->assertIsObject( $font, "The Font should be an object" );


		$font = $font->data;

		// family
		$I->assertTrue( isset( $font->family ), "The property 'family' must be present." );
		$I->assertStringContainsString( $fontFamily, $font->family, "The 'family' value should be valid" );

		//weights
		$I->assertTrue( isset( $font->weights ), "The property 'weights' must be present." );
		$I->assertEquals( [ '400', '500', '700' ], $font->weights, "The 'weights' array should be valid" );


		$I->seePostInDatabase( [
			'post_type'   => Brizy_Admin_Fonts_Main::CP_FONT,
			'post_title'  => $fontFamily,
			'post_name'   => $fontFamily,
			'post_status' => 'publish',
		] );

		$postsTable = $I->grabPostsTableName();

		$attachmentCount = $I->countRowsInDatabase( $postsTable, [
			'post_type' => 'attachment',
		] );

		$I->assertEquals( 10, $attachmentCount, 'Is should create 10 attachments' );


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
	public function createDuplicateFontTest( FunctionalTester $I ) {

		$fontFamily = 'proxima_nova';
		$fontId     = $I->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Fonts_Main::CP_FONT,
			'post_title'  => $fontFamily,
			'post_name'   => $fontFamily,
			'post_status' => 'publish',
			'meta_input'  => [
				'brizy_post_uid' => 'gffbf00297b0b4e9ee27af32a7b79c3330',
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
		$I->sendPOST( '/wp-admin/admin-ajax.php?' . build_query( [ 'action' => Brizy_Admin_Fonts_Api::AJAX_CREATE_FONT_ACTION ] ), [
			'family' => $fontFamily,
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

		$font = json_decode( $response = $I->grabResponse() );

		$I->assertFalse( $font->success, 'The sucess status of the request should be false' );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function getFontCssTest( FunctionalTester $I ) {
		$I->wantToTest( 'The CSS file return for a font family' );
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

		$I->seeResponseCodeIsSuccessful();


		$I->sendGET( '/?' . build_query( [ Brizy_Admin_Fonts_Handler::ENDPOINT => "proxima_nova:400,500,700" ] ) );

		$I->seeResponseCodeIsSuccessful();
		$I->seeHttpHeader( 'Content-Type', 'text/css;charset=UTF-8' );

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
	}


	/**
	 * @param FunctionalTester $I
	 */
	public function deleteFont( FunctionalTester $I ) {

		$fontFamily = 'proxima_nova';
		$fontId     = $I->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Fonts_Main::CP_FONT,
			'post_title'  => $fontFamily,
			'post_name'   => $fontFamily,
			'post_status' => 'publish',
			'meta_input'  => [
				'brizy_post_uid' => 'gffbf00297b0b4e9ee27af32a7b79c333',
			],
		] );

		$I->havePostInDatabase( [
			'post_type'   => 'attachment',
			'post_parent' => $fontId,
			'meta_input'  => [
				'brizy-font-weight'    => 400,
				'brizy-font-file-type' => 'ttf'
			],
		] );

		$fontFamily = 'proxima_nova';
		$I->sendPOST( '/wp-admin/admin-ajax.php?' . build_query( [ 'action' => Brizy_Admin_Fonts_Api::AJAX_DELETE_FONT_ACTION ] ), [
			'family' => $fontFamily,
		] );

		$I->seeResponseCodeIsSuccessful();

		$I->dontSeePostInDatabase( [
			'post_type'   => Brizy_Admin_Fonts_Main::CP_FONT,
			'post_title'  => $fontFamily,
			'post_name'   => $fontFamily,
			'post_status' => 'publish',
		] );

		$I->dontSeeAttachmentInDatabase( [ 'post_parent' => $fontId ] );

		$I->cantSeePostMetaInDatabase( [
			'post_id'  => $fontId,
			'meta_key' => 'brizy-font-weight',
		] );

		$I->cantSeePostMetaInDatabase( [
			'post_id'  => $fontId,
			'meta_key' => 'brizy-font-file-type',
		] );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function deleteUnknownFont( FunctionalTester $I ) {

		$I->sendPOST( '/wp-admin/admin-ajax.php?' . build_query( [ 'action' => Brizy_Admin_Fonts_Api::AJAX_DELETE_FONT_ACTION ] ), [
			'family' => 'unknown',
		] );

		$I->canSeeResponseCodeIs( 404 );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function deleteInvalidFontRequest( FunctionalTester $I ) {

		$fontFamily = 'proxima_nova';
		$fontId     = $I->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Fonts_Main::CP_FONT,
			'post_title'  => $fontFamily,
			'post_name'   => $fontFamily,
			'post_status' => 'publish',
			'meta_input'  => [
				'brizy_post_uid' => 'gffbf00297b0b4e9ee27af32a7b79c333',
			],
		] );

		$I->havePostInDatabase( [
			'post_type'   => 'attachment',
			'post_parent' => $fontId,
			'meta_input'  => [
				'brizy-font-weight'    => 400,
				'brizy-font-file-type' => 'ttf'
			],
		] );

		$I->sendPOST( '/wp-admin/admin-ajax.php?' . build_query( [ 'action' => Brizy_Admin_Fonts_Api::AJAX_DELETE_FONT_ACTION ] ), [
			'bad_family' => 'unknown',
		] );


		$I->seePostInDatabase( [
			'post_type'   => Brizy_Admin_Fonts_Main::CP_FONT,
			'post_title'  => $fontFamily,
			'post_name'   => $fontFamily,
			'post_status' => 'publish',
		] );

		$I->canSeeResponseCodeIs( 400 );
	}
}
