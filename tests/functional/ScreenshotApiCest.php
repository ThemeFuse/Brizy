<?php


class ScreenshotApiCest {

	const PIXEL_IMG_PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==';
	const PIXEL_IMG_GIF = 'R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';

	public function _before( FunctionalTester $I ) {
		wp_cache_flush();
		$I->loginAs( 'admin', 'admin' );
		$I->cleanUploadsDir( 'brizy' );
	}


	protected function invalidDataProvider() {
		return [
			[ 'block_type' => 'normal', 'img' => null ],
			[ 'block_type' => 'normal', 'img' => '' ],
			[ 'block_type' => 'normal', ],

			[ 'block_type' => null, 'img' => self::PIXEL_IMG_PNG ],
			[ 'block_type' => '', 'img' => self::PIXEL_IMG_PNG ],
			[ 'img' => self::PIXEL_IMG_PNG ],
			[ 'block_type' => 'global', 'img' => 'asdasdasdasdasd' ],
		];
	}

	protected function validDataProvider( FunctionalTester $I ) {

		$postId = $I->havePostInDatabase( [ 'post_type' => 'post', 'post_status' => 'publish' ] );

		return [
			[
				'block_type' => 'global',
				'img'        => self::PIXEL_IMG_PNG,
				'file_type'  => '.png',
				'post'       => null
			],
			[
				'block_type' => 'global',
				'img'        => self::PIXEL_IMG_GIF,
				'file_type'  => '.gif',
				'post'       => null
			],
			[
				'block_type' => 'saved',
				'img'        => self::PIXEL_IMG_PNG,
				'file_type'  => '.png',
				'post'       => null
			],
			[
				'block_type' => 'normal',
				'img'        => self::PIXEL_IMG_PNG,
				'file_type'  => '.png',
				'post'       => $postId
			],
			[
				'block_type' => 'normal',
				'img'        => self::PIXEL_IMG_GIF,
				'file_type'  => '.gif',
				'post'       => $postId
			],
		];
	}

	/**
	 * @dataProvider invalidDataProvider
	 *
	 * @param FunctionalTester $I
	 * @param $example
	 */
	public function invalidPostScreenShotTest( FunctionalTester $I, $example ) {

		$I->sendAjaxPostRequest( 'wp-admin/admin-ajax.php?' . build_query( [ 'action' => 'brizy_create_block_screenshot' ] ), (array) $example );
		$I->seeResponseCodeIs( 400 );
	}

	/**
	 * @param FunctionalTester $I
	 *
	 * @throws Exception
	 */
	public function postScreenShotTest( FunctionalTester $I ) {
		foreach ( $this->validDataProvider( $I ) as $data ) {
			$this->_postScreenShotTest( $I, $data );
		}
	}

	/**
	 * @dataProvider validDataProvider
	 *
	 * @param FunctionalTester $I
	 *
	 * @throws Exception
	 */
	private function _postScreenShotTest( FunctionalTester $I, $example ) {

		$I->sendAjaxPostRequest( 'wp-admin/admin-ajax.php?' . build_query( [ 'action' => 'brizy_create_block_screenshot' ] ), [
			'block_type' => $example['block_type'],
			'img'        => $example['img'],
			'post'       => $example['post']
		] );
		$I->seeResponseCodeIs( 200 );

		$response = $I->grabResponse();
		$object   = json_decode( $response );

		$this->assertScreenshotReponse( $I, $object );

		$urlBuilder = new Brizy_Editor_UrlBuilder( Brizy_Editor_Project::get(), $example['post'] );
		if ( $example['block_type'] == 'normal' ) {
			$filePath = $urlBuilder->page_upload_path( 'blockThumbnails' . DIRECTORY_SEPARATOR . $object->data->id . $example['file_type'] );
		} else {
			$filePath = $urlBuilder->brizy_upload_path( 'blockThumbnails' . DIRECTORY_SEPARATOR . $example['block_type'] . DIRECTORY_SEPARATOR . $object->data->id . $example['file_type'] );
		}

		$I->assertTrue( file_exists( $filePath ), 'The screenshot file should be present in FS' );
	}

	/**
	 * @param FunctionalTester $I
	 *
	 * @throws Exception
	 */
	public function putScreenShotTest( FunctionalTester $I ) {

		$screen_id  = \Brizy\Utils\UUId::uuid();
		$urlBuilder = new Brizy_Editor_UrlBuilder( Brizy_Editor_Project::get(), null );
		$filePath   = $urlBuilder->brizy_upload_path( 'blockThumbnails' . DIRECTORY_SEPARATOR . 'global' . DIRECTORY_SEPARATOR . "{$screen_id}.png" );
		$path       = dirname( $filePath );
		if ( ! file_exists( $path ) ) {
			! @mkdir( $path, 0777, true );
		}

		file_put_contents( $filePath, "image content" );
		`chmod -R 777 {$path}`;


		$I->sendAjaxPostRequest( 'wp-admin/admin-ajax.php?' . build_query( [ 'action' => 'brizy_update_block_screenshot' ] ), [
			'block_type' => 'global',
			'img'        => self::PIXEL_IMG_PNG,
			'id'         => $screen_id
		] );
		$I->seeResponseCodeIs( 200 );

		$response = $I->grabResponse();
		$object   = json_decode( $response );

		$this->assertScreenshotReponse( $I, $object );

		$I->assertTrue( file_exists( $filePath ), 'The screenshot file should be present in FS' );
	}


	private function assertScreenshotReponse( FunctionalTester $I, $object ) {
		$I->assertArrayHasKey( 'data', (array) $object, 'It should contain key "data"' );
		$I->assertArrayHasKey( 'id', (array) $object->data, 'It should contain screenshot id' );
	}
}