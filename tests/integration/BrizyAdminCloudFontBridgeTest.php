<?php

use \Prophecy\Argument;

class BrizyAdminCloudFontBridgeTest extends \Codeception\TestCase\WPTestCase {

	/**
	 * @var \IntegrationTester
	 */
	protected $tester;


	protected function _before() {
		wp_cache_flush();
		$this->tester->dontHavePostInDatabase( [ 'post_type' => 'any' ] );
	}

	/**
	 * @return \Prophecy\Prophecy\ObjectProphecy
	 */
	private function getCloudClientObserver() {
		$cloudClientObserver = $this->prophesize( Brizy_Admin_Cloud_Client::class );

		return $cloudClientObserver;
	}

	public function testImport() {

	}

	public function testExport() {

		list( $fontPostId, $fontUid ) = $this->createTestFont();

		$fontManager = new Brizy_Admin_Fonts_Manager();

		$fontForExport = $fontManager->getFontForExport( $fontUid );

		$client = $this->getCloudClientObserver();
		$client->createFont( $fontForExport )->shouldBeCalled();

		$bridge = new Brizy_Admin_Cloud_FontBridge( $client->reveal() );

		$bridge->export( $fontUid );
	}


	public function testInvalidExport() {

		$this->expectException( 'Exception' );

		$client = $this->getCloudClientObserver();

		$bridge = new Brizy_Admin_Cloud_FontBridge( $client->reveal() );

		$bridge->export( md5( time() ) );
	}

	private function createTestFont() {
		$fontUid     = md5( time() );
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

		$fontId = $fontManager->createFont( $fontUid, $family, $fontWeights, $fontType );

		return [ $fontId, $fontUid ];
	}
}