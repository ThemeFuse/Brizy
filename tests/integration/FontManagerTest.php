<?php

class FontManagerTest extends \Codeception\Test\Unit {
	/**
	 * @var \WpunitTester
	 */
	protected $tester;

	protected function _before() {
		wp_cache_flush();
		global $wpdb;
		@$wpdb->check_connection();
		$this->tester->dontHavePostInDatabase( [ 'post_type' => Brizy_Admin_Fonts_Main::CP_FONT ] );
		new Brizy_Admin_Fonts_Main();
	}

	/**
	 * @return array
	 */
	public function invalidCreateFontParameters() {
		return [
			[ null, null, null ],
			[ 'pn', null, null ],
			[ 'pn', [], null ],
			[
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
				'pn',
				[ '400' => [] ],
				'uploaded'
			],
			[
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
	public function testCreateFont() {
		$this->tester->wantToTest( 'createFont method on a Brizy_Admin_Fonts_Manager instance' );

		$family      = 'proxima nova';
		$fontType    = 'uploaded';
		$fontWeights = [
			'400' => [
				'eot'  => [
					'name'     => basename( codecept_data_dir( 'fonts/pn-regular-webfont.eot' ) ),
					'type'     => 'application/x-font-ttf',
					'tmp_name' => $this->tester->makeTemporaryFile( codecept_data_dir( 'fonts/pn-regular-webfont.eot' ) ),
					'error'    => 0,
					'size'     => filesize( codecept_data_dir( 'fonts/pn-regular-webfont.eot' ) )
				],
				'woff' => [
					'name'     => basename( codecept_data_dir( 'fonts/pn-medium-webfont.woff' ) ),
					'type'     => 'application/font-woff',
					'tmp_name' => $this->tester->makeTemporaryFile( codecept_data_dir( 'fonts/pn-medium-webfont.woff' ) ),
					'error'    => 0,
					'size'     => filesize( codecept_data_dir( 'fonts/pn-medium-webfont.woff' ) )
				]
			],
			'700' => [
				'eot'  => [
					'name'     => basename( codecept_data_dir( 'fonts/pn-regular-webfont.eot' ) ),
					'type'     => 'application/vnd.ms-fontobject',
					'tmp_name' => $this->tester->makeTemporaryFile( codecept_data_dir( 'fonts/pn-regular-webfont.eot' ) ),
					'error'    => 0,
					'size'     => filesize( codecept_data_dir( 'fonts/pn-regular-webfont.eot' ) )
				],
				'woff' => [
					'name'     => basename( codecept_data_dir( 'fonts/pn-bold-webfont.woff' ) ),
					'type'     => 'application/font-woff',
					'tmp_name' => $this->tester->makeTemporaryFile( codecept_data_dir( 'fonts/pn-bold-webfont.woff' ) ),
					'error'    => 0,
					'size'     => filesize( codecept_data_dir( 'fonts/pn-bold-webfont.woff' ) )
				]
			]
		];

		$fontManager = new Brizy_Admin_Fonts_Manager();

		$fontId = $fontManager->createFont( $family, $fontWeights, $fontType );
		$uid    = get_post_meta( $fontId, 'brizy_post_uid', true );

		$this->tester->assertIsInt( $fontId, 'It should return an integer' );

		$this->tester->seePostInDatabase( [
			'ID'          => $fontId,
			'post_type'   => Brizy_Admin_Fonts_Main::CP_FONT,
			'post_title'  => $family,
			'post_status' => 'publish',
		] );

		$this->tester->seePostMetaInDatabase( [
			'post_id'    => $fontId,
			'meta_key'   => 'brizy-font-type',
			'meta_value' => $fontType
		] );

		$this->tester->seePostMetaInDatabase( [
			'post_id'  => $fontId,
			'meta_key' => 'brizy_post_uid',
		] );


		$postsTable = $this->tester->grabPostsTableName();

		$attachmentCount = $this->tester->countRowsInDatabase( $postsTable, [
			'post_parent' => $fontId,
			'post_type'   => 'attachment',
		] );


		$this->tester->assertEquals( 4, $attachmentCount, 'Is should create 1 attachments' );

		$this->tester->seePostMetaInDatabase( [
			'meta_key'   => 'brizy-font-file-type',
			'meta_value' => 'eot'
		] );

		$this->tester->seePostMetaInDatabase( [
			'meta_key'   => 'brizy-font-file-type',
			'meta_value' => 'woff'
		] );

		$this->tester->seePostMetaInDatabase( [
			'meta_key'   => 'brizy-font-weight',
			'meta_value' => '400'
		] );

		$this->tester->seePostMetaInDatabase( [
			'meta_key'   => 'brizy-font-weight',
			'meta_value' => '400'
		] );

		$this->tester->seePostMetaInDatabase( [
			'meta_key'   => 'brizy-font-weight',
			'meta_value' => '700'
		] );
	}


	/**
	 * @throws Exception
	 */
	public function testCreateDuplicateFont() {
		$this->tester->wantToTest( 'createFont method on a Brizy_Admin_Fonts_Manager with duplicate font' );
		$this->expectException( \Exception::class );

		$fontFamily  = 'proxima_nova';
		$fontType    = 'uploaded';
		$fontWeights = [
			'400' => [
				'ttf' => [
					'name'     => basename( codecept_data_dir( 'fonts/pn-regular-webfont.ttf' ) ),
					'type'     => 'application/x-font-ttf',
					'tmp_name' => $this->tester->makeTemporaryFile( codecept_data_dir( 'fonts/pn-regular-webfont.ttf' ) ),
					'error'    => 0,
					'size'     => filesize( codecept_data_dir( 'fonts/pn-regular-webfont.ttf' ) )
				],
			]
		];
		$this->tester->haveFontInDataBase( $fontFamily, [ '400' => [ 'ttf' ] ], $fontType );

		$fontManager = new Brizy_Admin_Fonts_Manager();

		$fontManager->createFont( $fontFamily, $fontWeights, $fontType );
	}

	/**
	 * @dataProvider invalidCreateFontParameters
	 *
	 * @param $fontFamily
	 * @param $weight
	 * @param $type
	 *
	 * @throws Exception
	 */
	public function testCreateFontFails( $fontFamily, $weight, $type ) {
		$this->expectException( \Exception::class );
		$fontManager = new Brizy_Admin_Fonts_Manager();
		$fontManager->createFont( $fontFamily, $weight, $type );
	}

	public function testDeleteFont() {

		$this->tester->wantToTest( 'deleteFont method on a Brizy_Admin_Fonts_Manager instance' );
		$fontFamily     = 'proxima_nova';
		$uploadedFontId = $this->tester->haveFontInDataBase( $fontFamily, [ '400' => [ 'ttf' ] ], 'uploaded' );
		$googleFontId   = $this->tester->haveFontInDataBase( $fontFamily, [ '400' => [ 'ttf' ] ], 'google' );

		$uploadedFontUId = get_post_meta( $uploadedFontId, 'brizy_post_uid', true );

		$fontManager = new Brizy_Admin_Fonts_Manager();
		$fontManager->deleteFont( $uploadedFontUId );

		$this->tester->dontSeePostInDatabase( [
			'ID' => $uploadedFontId
		] );

		$this->tester->dontSeePostMetaInDatabase( [
			'post_id'    => $uploadedFontId,
			'meta_key'   => 'brizy-font-type',
			'meta_value' => 'upload'
		] );

		$this->tester->seePostInDatabase( [
			'post_type'   => Brizy_Admin_Fonts_Main::CP_FONT,
			'post_title'  => $fontFamily,
			'post_status' => 'publish',
		] );

		$this->tester->seePostMetaInDatabase( [
			'post_id'    => $googleFontId,
			'meta_key'   => 'brizy-font-type',
			'meta_value' => 'google'
		] );
	}

	public function testDeleteUnknownFont() {
		$this->expectException( \Exception::class );
		$fontManager = new Brizy_Admin_Fonts_Manager();
		$fontManager->deleteFont( 'UNKNOWN UID' );
	}

	public function testGetFontList() {

		$this->tester->wantToTest( 'get all fonts method' );

		$fontFamily = 'proxyma_nova';

		$this->tester->haveManyFontsInDataBase( 5, "deleted_{$fontFamily}", [
			'400'       => [ 'ttf' ],
			'500italic' => [ 'ttf' ]
		], 'uploaded', 'trash' );

		$this->tester->haveManyFontsInDataBase( 5, $fontFamily, [
			'400'       => [ 'ttf' ],
			'500italic' => [ 'ttf' ]
		], 'uploaded' );

		$this->tester->haveManyFontsInDataBase( 5, $fontFamily, [
			'400'       => [ 'ttf' ],
			'500italic' => [ 'ttf' ]
		], 'google' );

		$fontManager = new Brizy_Admin_Fonts_Manager();
		$fonts       = $fontManager->getAllFonts();

		$this->tester->assertCount( 10, $fonts, 'It should return 10 fonts' );

		foreach ( $fonts as $font ) {
			$this->assertArrayHasKey( 'id', $font, 'Font should contain "id" key' );
			$this->assertArrayHasKey( 'family', $font, 'Font should contain "family" key' );
			$this->assertArrayHasKey( 'type', $font, 'Font should contain "type" key' );
			$this->assertArrayHasKey( 'weights', $font, 'Font should contain "weight" key' );
			$this->assertContains( '400', $font['weights'], 'Font weights should contain "400" key' );
			$this->assertContains( '500italic', $font['weights'], 'Font weights should contain "500italic" key' );
		}
	}

	public function testGetFont() {

		$this->tester->wantToTest( 'get font method' );

		$fontFamily     = 'proxima_nova';
		$uploadedFontId = $this->tester->haveFontInDataBase( $fontFamily, [ '400' => [ 'ttf' ] ], 'uploaded' );

		$uploadedFontUId = get_post_meta( $uploadedFontId, 'brizy_post_uid', true );

		$fontManager = new Brizy_Admin_Fonts_Manager();
		$font        = $fontManager->getFont( $uploadedFontUId );

		$this->assertArrayHasKey( 'id', $font, 'Font should contain "id" key' );
		$this->assertArrayHasKey( 'family', $font, 'Font should contain "family" key' );
		$this->assertArrayHasKey( 'type', $font, 'Font should contain "type" key' );
		$this->assertArrayHasKey( 'weights', $font, 'Font should contain "weight" key' );
		$this->assertContains( '400', $font['weights'], 'Font weights should contain "400" key' );
	}

	public function testGetUnknownFont() {

		$this->tester->wantToTest( 'get font method' );

		$fontFamily = 'proxima_nova';
		$this->tester->haveFontInDataBase( $fontFamily, [ '400' => [ 'ttf' ] ], 'uploaded' );

		$fontManager = new Brizy_Admin_Fonts_Manager();
		$font        = $fontManager->getFont( 'UNKNOWN ID' );

		$this->assertNull( $font, 'It should return null' );
	}


	public function testGetFontByFamily() {

		$this->tester->wantToTest( 'get font method' );

		$fontFamily = 'proxima_nova';
		$this->tester->haveFontInDataBase( $fontFamily, [ '400' => [ 'ttf' ] ], 'uploaded' );

		$fontManager = new Brizy_Admin_Fonts_Manager();
		$font        = $fontManager->getFontByFamily( $fontFamily, 'uploaded' );

		$this->assertArrayHasKey( 'id', $font, 'Font should contain "id" key' );
		$this->assertArrayHasKey( 'family', $font, 'Font should contain "family" key' );
		$this->assertArrayHasKey( 'type', $font, 'Font should contain "type" key' );
		$this->assertArrayHasKey( 'weights', $font, 'Font should contain "weight" key' );
		$this->assertContains( '400', $font['weights'], 'Font weights should contain "400" key' );
	}

	public function testGetFontByUnknownFamily() {

		$this->tester->wantToTest( 'get font method' );

		$fontFamily = 'proxima_nova';
		$this->tester->haveFontInDataBase( $fontFamily, [ '400' => [ 'ttf' ] ], 'uploaded' );

		$fontManager = new Brizy_Admin_Fonts_Manager();
		$font        = $fontManager->getFontByFamily( 'UNKNOWN', 'uploaded' );
		
		$this->assertNull( $font, 'It should return null' );
	}
}