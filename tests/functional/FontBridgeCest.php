<?php

use \Prophecy\Argument;
use Prophecy\Prophet;

class FontBridgeCest {

	protected function _before( FunctionalTester $I ) {
		wp_cache_flush();
		$I->dontHavePostInDatabase( [] );
	}

	/**
	 * @return \Prophecy\Prophecy\ObjectProphecy
	 */
	private function getCloudClientObserver() {
		$prophet             = new Prophet();
		$cloudClientObserver = $prophet->prophesize( Brizy_Admin_Cloud_Client::class );

		return $cloudClientObserver;
	}

	public function testImport( FunctionalTester $I ) {
		$fontUid            = md5( 'font' );
		$family             = 'family';
		$codecept_font_path = codecept_data_dir( 'fonts/pn-regular-webfont.ttf' );
		$fakeFont           = [
			'uid'       => $fontUid,
			'family'    => $family,
			'container' => 'conainer',
			'files'     => [
				'400' => [
					'ttf' => $codecept_font_path
				]
			]
		];
		$client             = $this->getCloudClientObserver();
		$client->getFont( $fontUid )
		       ->willReturn( $fakeFont )
		       ->shouldBeCalled();

		$bridge = new Brizy_Admin_Cloud_FontBridge( $client->reveal() );
		$fontId = $bridge->import( $fontUid );

		$I->seePostInDatabase( [
			'post_type' => Brizy_Admin_Fonts_Main::CP_FONT,
		] );

		$I->seePostMetaInDatabase( [ 'post_id' => $fontId, 'meta_key' => 'brizy_post_uid', 'meta_value' => $fontUid ] );
		$I->seePostMetaInDatabase( [
			'post_id'    => $fontId,
			'meta_key'   => 'brizy-font-type',
			'meta_value' => 'uploaded'
		] );


		$I->seePostInDatabase( [
			'post_type'   => 'attachment',
			'post_parent' => $fontId
		] );

	}

	public function testExport( FunctionalTester $I ) {

		list( $fontPostId, $fontUid ) = $this->createTestFont( $I );

		$fontManager = new Brizy_Admin_Fonts_Manager();

		$fontForExport = $fontManager->getFontForExport( $fontUid );

		$client = $this->getCloudClientObserver();
		$client->createFont( $fontForExport )->shouldBeCalled();

		$bridge = new Brizy_Admin_Cloud_FontBridge( $client->reveal() );

		$bridge->export( $fontUid );
	}

	public function testInvalidExport( FunctionalTester $I ) {

		$client = $this->getCloudClientObserver();

		$bridge = new Brizy_Admin_Cloud_FontBridge( $client->reveal() );

		$I->expectThrowable( 'Exception', function () use ( $bridge ) {
			$bridge->export( md5( time() ) );
		} );
	}

	private function createTestFont( FunctionalTester $I ) {
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

		return [ $fontId, $fontUid ];
	}
}
