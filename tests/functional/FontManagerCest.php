<?php

class FontManagerCest {

	public function _before( FunctionalTester $I ) {
		wp_cache_flush();
		$I->dontHavePostInDatabase( [ 'post_type' => Brizy_Admin_Fonts_Main::CP_FONT ] );
		new Brizy_Admin_Fonts_Main();
	}

	/**
	 * @return array
	 */
	public function invalidCreateFontParameters() {
		return [
			[ null, null, null, null ],
			[ null, 'pn', null, null ],
			[ md5( '123' ), 'pn', null, null ],
			[ md5( '123' ), 'pn', [], null ],
			[
				md5( '123' ),
				'pn',
				[
					[
						'400' => [
							'eot' => [
								'name'     => basename( codecept_data_dir( 'fonts/pn-regular-webfont.eot' ) ),
								'type'     => 'application/x-font-ttf',
								'tmp_name' => codecept_data_dir( 'fonts/pn-regular-webfont.eot' ),
								'error'    => 0,
								'size'     => filesize( codecept_data_dir( 'fonts/pn-regular-webfont.eot' ) )
							]
						]
					]
				],
				null
			],
			[
				md5( '123' ),
				'',
				[
					'400' => [
						'eot' => [
							'name'     => basename( codecept_data_dir( 'fonts/pn-regular-webfont.eot' ) ),
							'type'     => 'application/x-font-ttf',
							'tmp_name' => codecept_data_dir( 'fonts/pn-regular-webfont.eot' ),
							'error'    => 0,
							'size'     => filesize( codecept_data_dir( 'fonts/pn-regular-webfont.eot' ) )
						]
					]
				],
				'uploaded'
			],
			[
				md5( '123' ),
				'pn',
				[ '400' => [] ],
				'uploaded'
			],
			[
				md5( '123' ),
				'pn',
				[
					'400' => [
						'eot' => [
							'name'     => basename( codecept_data_dir( 'fonts/pn-regular-webfont.eot' ) ),
							'type'     => 'application/x-font-ttf',
							'tmp_name' => codecept_data_dir( 'fonts/pn-regular-webfont.eot' ),
							'error'    => 1,
							'size'     => filesize( codecept_data_dir( 'fonts/pn-regular-webfont.eot' ) )
						]
					]
				],
				'upload'
			],
			[
				md5( '123' ),
				'pn',
				[
					'400' => [
						'eot' => [
							'name'     => basename( codecept_data_dir( 'fonts/pn-regular-webfont.eot' ) ),
							'type'     => 'application/x-font-ttf',
							'tmp_name' => codecept_data_dir( 'fonts/pn-regular-webfont.eot' ),
							'error'    => 1,
							'size'     => filesize( codecept_data_dir( 'fonts/pn-regular-webfont.eot' ) )
						]
					],
					'500' => [
						'eot' => [
							'name'     => basename( codecept_data_dir( 'fonts/pn-regular-webfont.eot' ) ),
							'type'     => 'application/x-font-ttf',
							'tmp_name' => codecept_data_dir( 'fonts/pn-regular-webfont.eot' ),
							'error'    => 0,
							'size'     => filesize( codecept_data_dir( 'fonts/pn-regular-webfont.eot' ) )
						]
					]
				],
				'upload'
			]
		];
	}


	/**
	 * @throws Exception
	 */
	public function testCreateFont( FunctionalTester $I ) {
		$I->wantToTest( 'createFont method on a Brizy_Admin_Fonts_Manager instance' );

		$fontUid     = md5( time() );
		$family      = 'proxima nova';
		$fontType    = 'uploaded';
		$fontWeights = [
			'400' => [
				'eot'  => [
					'name'     => basename( codecept_data_dir( 'fonts/pn-regular-webfont.eot' ) ),
					'type'     => 'application/x-font-ttf',
					'tmp_name' => $I->makeTemporaryFile( codecept_data_dir( 'fonts/pn-regular-webfont.eot' ) ),
					'error'    => 0,
					'size'     => filesize( codecept_data_dir( 'fonts/pn-regular-webfont.eot' ) )
				],
				'woff' => [
					'name'     => basename( codecept_data_dir( 'fonts/pn-medium-webfont.woff' ) ),
					'type'     => 'application/font-woff',
					'tmp_name' => $I->makeTemporaryFile( codecept_data_dir( 'fonts/pn-medium-webfont.woff' ) ),
					'error'    => 0,
					'size'     => filesize( codecept_data_dir( 'fonts/pn-medium-webfont.woff' ) )
				]
			],
			'700' => [
				'eot'  => [
					'name'     => basename( codecept_data_dir( 'fonts/pn-regular-webfont.eot' ) ),
					'type'     => 'application/vnd.ms-fontobject',
					'tmp_name' => $I->makeTemporaryFile( codecept_data_dir( 'fonts/pn-regular-webfont.eot' ) ),
					'error'    => 0,
					'size'     => filesize( codecept_data_dir( 'fonts/pn-regular-webfont.eot' ) )
				],
				'woff' => [
					'name'     => basename( codecept_data_dir( 'fonts/pn-bold-webfont.woff' ) ),
					'type'     => 'application/font-woff',
					'tmp_name' => $I->makeTemporaryFile( codecept_data_dir( 'fonts/pn-bold-webfont.woff' ) ),
					'error'    => 0,
					'size'     => filesize( codecept_data_dir( 'fonts/pn-bold-webfont.woff' ) )
				]
			]
		];

		$fontManager = new Brizy_Admin_Fonts_Manager();

		$fontId = $fontManager->createFont( $fontUid, $family, $fontWeights, $fontType );
		$uid    = get_post_meta( $fontId, 'brizy_post_uid', true );

		$I->assertIsInt( $fontId, 'It should return an integer' );
		$I->assertEquals( $fontUid, $uid, 'It should create the provided font uid' );

		$I->seePostInDatabase( [
			'ID'          => $fontId,
			'post_type'   => Brizy_Admin_Fonts_Main::CP_FONT,
			'post_title'  => $family,
			'post_status' => 'publish',
		] );

		$I->seePostMetaInDatabase( [
			'post_id'    => $fontId,
			'meta_key'   => 'brizy-font-type',
			'meta_value' => $fontType
		] );

		$I->seePostMetaInDatabase( [
			'post_id'    => $fontId,
			'meta_key'   => 'brizy_post_uid',
			'meta_value' => $fontUid,
		] );


		$postsTable = $I->grabPostsTableName();

		$attachmentCount = $I->countRowsInDatabase( $postsTable, [
			'post_parent' => $fontId,
			'post_type'   => 'attachment',
		] );


		$I->assertEquals( 4, $attachmentCount, 'Is should create 1 attachments' );

		$I->seePostMetaInDatabase( [
			'meta_key'   => 'brizy-font-file-type',
			'meta_value' => 'eot'
		] );

		$I->seePostMetaInDatabase( [
			'meta_key'   => 'brizy-font-file-type',
			'meta_value' => 'woff'
		] );

		$I->seePostMetaInDatabase( [
			'meta_key'   => 'brizy-font-weight',
			'meta_value' => '400'
		] );

		$I->seePostMetaInDatabase( [
			'meta_key'   => 'brizy-font-weight',
			'meta_value' => '400'
		] );

		$I->seePostMetaInDatabase( [
			'meta_key'   => 'brizy-font-weight',
			'meta_value' => '700'
		] );
	}


	/**
	 * @throws Exception
	 */
	public function testCreateDuplicateFont( FunctionalTester $I ) {
		$I->wantToTest( 'createFont method on a Brizy_Admin_Fonts_Manager with duplicate font' );
		$I->expectThrowable( \Exception::class, function() use ($I){
			$fontUid     = md5( time() );
			$fontFamily  = 'proxima_nova';
			$fontType    = 'uploaded';
			$fontWeights = [
				'400' => [
					'ttf' => [
						'name'     => basename( codecept_data_dir( 'fonts/pn-regular-webfont.ttf' ) ),
						'type'     => 'application/x-font-ttf',
						'tmp_name' => $I->makeTemporaryFile( codecept_data_dir( 'fonts/pn-regular-webfont.ttf' ) ),
						'error'    => 0,
						'size'     => filesize( codecept_data_dir( 'fonts/pn-regular-webfont.ttf' ) )
					],
				]
			];
			$I->haveFontInDataBase( $fontUid, $fontFamily, [ '400' => [ 'ttf' ] ], $fontType );

			$fontManager = new Brizy_Admin_Fonts_Manager();

			$fontManager->createFont( $fontUid, $fontFamily, $fontWeights, $fontType );
		} );
	}

	/**
	 * @dataProvider invalidCreateFontParameters
	 *
	 * @param $uid
	 * @param $fontFamily
	 * @param $weight
	 * @param $type
	 *
	 * @throws Exception
	 */
	public function testCreateFontFails( FunctionalTester $I, $example ) {

		$I->expectThrowable( \Exception::class, function() use ($example){
			$fontManager = new Brizy_Admin_Fonts_Manager();
			$fontManager->createFont( $example->uid, $example->fontFamily, $example->weight, $example->type );
		});

	}

	public function testDeleteFont( FunctionalTester $I ) {

		$I->wantToTest( 'deleteFont method on a Brizy_Admin_Fonts_Manager instance' );
		$fontFamily     = 'proxima_nova';
		$uploadedFontId = $I->haveFontInDataBase( md5( 1 ), $fontFamily, [ '400' => [ 'ttf' ] ], 'uploaded' );
		$googleFontId   = $I->haveFontInDataBase( md5( 2 ), $fontFamily, [ '400' => [ 'ttf' ] ], 'google' );

		$uploadedFontUId = get_post_meta( $uploadedFontId, 'brizy_post_uid', true );

		$fontManager = new Brizy_Admin_Fonts_Manager();
		$fontManager->deleteFont( $uploadedFontUId );

		$I->dontSeePostInDatabase( [
			'ID' => $uploadedFontId
		] );

		$I->dontSeePostMetaInDatabase( [
			'post_id'    => $uploadedFontId,
			'meta_key'   => 'brizy-font-type',
			'meta_value' => 'upload'
		] );

		$I->seePostInDatabase( [
			'post_type'   => Brizy_Admin_Fonts_Main::CP_FONT,
			'post_title'  => $fontFamily,
			'post_status' => 'publish',
		] );

		$I->seePostMetaInDatabase( [
			'post_id'    => $googleFontId,
			'meta_key'   => 'brizy-font-type',
			'meta_value' => 'google'
		] );
	}

	public function testDeleteUnknownFont( FunctionalTester $I ) {
		$I->expectThrowable( \Exception::class, function () {
			$fontManager = new Brizy_Admin_Fonts_Manager();
			$fontManager->deleteFont( 'UNKNOWN UID' );
		} );

	}

	public function testGetFontList( FunctionalTester $I ) {

		$I->wantToTest( 'get all fonts method' );

		$fontFamily = 'proxyma_nova';

		$I->haveManyFontsInDataBase( 5, "deleted_{$fontFamily}", [
			'400'       => [ 'ttf' ],
			'500italic' => [ 'ttf' ]
		], 'uploaded', 'trash' );

		$I->haveManyFontsInDataBase( 5, $fontFamily, [
			'400'       => [ 'ttf' ],
			'500italic' => [ 'ttf' ]
		], 'uploaded' );

		$I->haveManyFontsInDataBase( 5, $fontFamily, [
			'400'       => [ 'ttf' ],
			'500italic' => [ 'ttf' ]
		], 'google' );

		$fontManager = new Brizy_Admin_Fonts_Manager();
		$fonts       = $fontManager->getAllFonts();

		$I->assertCount( 10, $fonts, 'It should return 10 fonts' );

		foreach ( $fonts as $font ) {
			$I->assertArrayHasKey( 'id', $font, 'Font should contain "id" key' );
			$I->assertArrayHasKey( 'family', $font, 'Font should contain "family" key' );
			$I->assertArrayHasKey( 'type', $font, 'Font should contain "type" key' );
			$I->assertArrayHasKey( 'weights', $font, 'Font should contain "weight" key' );
			$I->assertContains( '400', $font['weights'], 'Font weights should contain "400" key' );
			$I->assertContains( '500italic', $font['weights'], 'Font weights should contain "500italic" key' );
		}
	}

	public function testGetFont( FunctionalTester $I ) {

		$I->wantToTest( 'get font method' );

		$uploadedFontUId = md5( time() );
		$fontFamily      = 'proxima_nova';
		$uploadedFontId  = $I->haveFontInDataBase( $uploadedFontUId, $fontFamily, [ '400' => [ 'ttf' ] ], 'uploaded' );

		$fontManager = new Brizy_Admin_Fonts_Manager();
		$font        = $fontManager->getFont( $uploadedFontUId );

		$I->assertArrayHasKey( 'id', $font, 'Font should contain "id" key' );
		$I->assertArrayHasKey( 'family', $font, 'Font should contain "family" key' );
		$I->assertArrayHasKey( 'type', $font, 'Font should contain "type" key' );
		$I->assertArrayHasKey( 'weights', $font, 'Font should contain "weight" key' );
		$I->assertContains( '400', $font['weights'], 'Font weights should contain "400" key' );
	}

	public function testGetUnknownFont( FunctionalTester $I ) {

		$I->wantToTest( 'get font method' );

		$uid        = md5( time() );
		$fontFamily = 'proxima_nova';
		$I->haveFontInDataBase( $uid, $fontFamily, [ '400' => [ 'ttf' ] ], 'uploaded' );

		$fontManager = new Brizy_Admin_Fonts_Manager();
		$font        = $fontManager->getFont( 'UNKNOWN ID' );

		$I->assertNull( $font, 'It should return null' );
	}


	public function testGetFontByFamily( FunctionalTester $I ) {

		$I->wantToTest( 'get font method' );

		$uid        = md5( time() );
		$fontFamily = 'proxima_nova';
		$I->haveFontInDataBase( $uid, $fontFamily, [ '400' => [ 'ttf' ] ], 'uploaded' );

		$fontManager = new Brizy_Admin_Fonts_Manager();
		$font        = $fontManager->getFontByFamily( $uid, $fontFamily, 'uploaded' );

		$I->assertArrayHasKey( 'id', $font, 'Font should contain "id" key' );
		$I->assertArrayHasKey( 'family', $font, 'Font should contain "family" key' );
		$I->assertArrayHasKey( 'type', $font, 'Font should contain "type" key' );
		$I->assertArrayHasKey( 'weights', $font, 'Font should contain "weight" key' );
		$I->assertContains( '400', $font['weights'], 'Font weights should contain "400" key' );
	}

	public function testGetFontByUnknownFamily( FunctionalTester $I ) {

		$I->wantToTest( 'get font method' );

		$uid        = md5( time() );
		$fontFamily = 'proxima_nova';
		$I->haveFontInDataBase( $uid, $fontFamily, [ '400' => [ 'ttf' ] ], 'uploaded' );

		$fontManager = new Brizy_Admin_Fonts_Manager();
		$font        = $fontManager->getFontByFamily( $uid, 'UNKNOWN', 'uploaded' );

		$I->assertNull( $font, 'It should return null' );
	}

	public function testGetFontByUnknownUid( FunctionalTester $I ) {

		$I->wantToTest( 'get font method' );

		$uid        = md5( time() );
		$fontFamily = 'proxima_nova';
		$I->haveFontInDataBase( $uid, $fontFamily, [ '400' => [ 'ttf' ] ], 'uploaded' );

		$fontManager = new Brizy_Admin_Fonts_Manager();
		$font        = $fontManager->getFontByFamily( 123, $fontFamily, 'uploaded' );

		$I->assertNull( $font, 'It should return null' );
	}
}