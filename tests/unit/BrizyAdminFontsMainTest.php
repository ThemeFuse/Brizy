<?php

class BrizyAdminFontsMainTest extends \Codeception\TestCase\Test {
	/**
	 * @var \UnitTester
	 */
	protected $tester;

	public function testAddFontTypes() {

		$instance = Brizy_Admin_Fonts_Main::_init();

		$fontTypes = $instance->addFontTypes( [] );


		$this->tester->assertArrayHasKey( 'ttf', $fontTypes, 'It should add ttf font types' );
		$this->tester->assertEquals( $fontTypes['ttf'], 'application/x-font-ttf', 'It should contain the correct ttf font mime type' );

		$this->tester->assertArrayHasKey( 'eot', $fontTypes, 'It should add eot font types' );
		$this->tester->assertEquals( $fontTypes['eot'], 'application/vnd.ms-fontobject', 'It should contain the correct eot font mime type' );

		$this->tester->assertArrayHasKey( 'woff', $fontTypes, 'It should add woff font types' );
		$this->tester->assertEquals( $fontTypes['woff'], 'application/x-font-woff', 'It should contain the correct woff font mime type' );

		$this->tester->assertArrayHasKey( 'woff2', $fontTypes, 'It should add woff2 font types' );
		$this->tester->assertEquals( $fontTypes['woff2'], 'application/x-font-woff2', 'It should contain the correct woff2 font mime type' );
	}

	function handleFontUplaodData() {
		return [
			[
				'ext'             => 'ttf',
				'type'            => 'application/x-font-ttf',
				'proper_filename' => false,
				'file'            => codecept_data_dir( 'fonts/pn-regular-webfont.ttf' )
			],
			[
				'ext'             => 'eot',
				'type'            => 'application/vnd.ms-fontobject',
				'proper_filename' => false,
				'file'            => codecept_data_dir( 'fonts/pn-bold-webfont.eot' )
			],
			[
				'ext'             => 'woff',
				'type'            => 'application/x-font-woff',
				'proper_filename' => false,
				'file'            => codecept_data_dir( 'fonts/pn-bold-webfont.woff' )
			],
			[
				'ext'             => 'woff2',
				'type'            => 'application/x-font-woff2',
				'proper_filename' => false,
				'file'            => codecept_data_dir( 'fonts/pn-bold-webfont.woff2' )
			],
		];
	}

	/**
	 * @dataProvider handleFontUplaodData
	 */
	public function testHandleUploadPreFilter( $ext, $type, $proper_filename, $file ) {

		$data     = [ 'ext' => null ];
		$instance = Brizy_Admin_Fonts_Main::_init();
		$result   = $instance->wp_check_filetype_and_ext( $data, null, $file, $instance->addFontTypes( [] ), '' );

		$this->tester->assertArrayHasKey( 'ext', $result, 'It should return ext key' );
		$this->tester->assertArrayHasKey( 'type', $result, 'It should return type key' );
		$this->tester->assertEquals( $result['ext'], $ext, 'It should contain the correct ' . $ext . ' mime type' );
		$this->tester->assertEquals( $result['type'], $type, 'It should contain the correct ' . $type . ' mime type' );
		$this->tester->assertFalse( $proper_filename, 'It should return  proper_filename false' );
	}
}