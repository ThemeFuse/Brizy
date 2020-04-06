<?php

class BrizyEditorScreenshotManagerTest extends \Codeception\TestCase\WPTestCase {
	/**
	 * @var \UnitTester
	 */
	protected $tester;

	private $uploadDir = null;

	protected function _before() {
		wp_cache_flush();
		global $wpdb;
		$wpdb->db_connect();


		//$this->tester->cleanUploadsDir('brizy');
	}

	/**
	 * BrizyEditorScreenshotManagerTest constructor.
	 *
	 * @param null $name
	 * @param array $data
	 * @param string $dataName
	 */
	public function __construct( $name = null, array $data = [], $dataName = '' ) {
		parent::__construct( $name, $data, $dataName );
		$this->uploadDir = wp_upload_dir();
	}

	public function saveScreenshotParameters() {
		return [
			[
				'screenUid'    => '123',
				'blockType'    => 'normal',
				'imageContent' => file_get_contents( codecept_data_dir( 'images/cat.jpeg' ) ),
				'postId'       => 1,
				'expectedFile' => 'brizy/1/blockThumbnails/123.jpeg'
			],
			[
				'screenUid'    => '789',
				'blockType'    => 'global',
				'imageContent' => file_get_contents( codecept_data_dir( 'images/cat.jpeg' ) ),
				'postId'       => 1,
				'expectedFile' => 'brizy/blockThumbnails/global/789.jpeg'
			],

			[
				'screenUid'    => '346',
				'blockType'    => 'saved',
				'imageContent' => file_get_contents( codecept_data_dir( 'images/cat.jpeg' ) ),
				'postId'       => 1,
				'expectedFile' => 'brizy/blockThumbnails/saved/346.jpeg'
			]
			,
			[
				'screenUid'    => '346',
				'blockType'    => 'layout',
				'imageContent' => file_get_contents( codecept_data_dir( 'images/cat.jpeg' ) ),
				'postId'       => 1,
				'expectedFile' => 'brizy/blockThumbnails/layout/346.jpeg'
			]

		];
	}

	/**
	 * @dataProvider saveScreenshotParameters
	 *
	 * @param $screenUid
	 * @param $blockType
	 * @param $imageContent
	 * @param $postId
	 * @param $expectedFile
	 */
	public function testSaveScreenshot( $screenUid, $blockType, $imageContent, $postId, $expectedFile ) {

		$manager = new Brizy_Editor_Screenshot_Manager( new Brizy_Editor_UrlBuilder() );
		$manager->saveScreenshot( $screenUid, $blockType, $imageContent, $postId );

		$this->tester->assertFileExists( $this->uploadDir['basedir'] . DIRECTORY_SEPARATOR . $expectedFile, 'It should create the correct screenshot file path' );
	}

	/**
	 * @depends      testSaveScreenshot
	 * @dataProvider saveScreenshotParameters
	 *
	 * @param $screenUid
	 * @param $blockType
	 * @param $imageContent
	 * @param $postId
	 * @param $expectedFile
	 */
	public function testGetScreenshot( $screenUid, $blockType, $imageContent, $postId, $expectedFile ) {

		$manager    = new Brizy_Editor_Screenshot_Manager( new Brizy_Editor_UrlBuilder() );
		$screenPath = $manager->getScreenshot( $screenUid, $postId );

		$this->tester->assertStringContainsString( $expectedFile, $screenPath, 'It should return the correct screenshot file path' );
	}


}
