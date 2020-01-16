<?php

class BrizyAdminSvgMainTest extends \Codeception\TestCase\Test {
	/**
	 * @var \UnitTester
	 */
	protected $tester;

	public function testAddSvgMimeType() {

		$instance  = Brizy_Admin_Svg_Main::_init();
		$fontTypes = $instance->addSvgMimeType( [] );
		$this->tester->assertArrayHasKey( 'svg', $fontTypes, 'It should add svg types' );
		$this->tester->assertEquals( $fontTypes['svg'], 'image/svg+xml', 'It should contain the correct svg mime type' );
	}

	public function testCheckFileTypeExt() {

		$ext             = 'svg';
		$type            = 'image/svg+xml';
		$proper_filename = false;
		$file            = codecept_data_dir( 'catrina.svg' );

		$data     = [ 'ext' => null ];
		$instance = Brizy_Admin_Svg_Main::_init();
		$result   = $instance->wp_check_filetype_and_ext( $data, null, $file, $instance->addSvgMimeType( [] ), '' );

		$this->tester->assertArrayHasKey( 'ext', $result, 'It should return ext key' );
		$this->tester->assertArrayHasKey( 'type', $result, 'It should return type key' );
		$this->tester->assertEquals( $result['ext'], $ext, 'It should contain the correct ' . $ext . ' mime type' );
		$this->tester->assertEquals( $result['type'], $type, 'It should contain the correct ' . $type . ' mime type' );
		$this->tester->assertFalse( $proper_filename, 'It should return  proper_filename false' );
	}

	public function testHandleUploadPreFilter() {
		$file     = array(
			'type'     => 'image/svg+xml',
			'tmp_name' => codecept_data_dir( 'catrina.svg' )
		);
		$instance = Brizy_Admin_Svg_Main::_init();
		$result   = $instance->wp_handle_upload_prefilter( $file );

		$this->tester->assertSame( $file, $result, 'It should return the same data' );
	}
}