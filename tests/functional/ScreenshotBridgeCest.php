<?php

use \Prophecy\Argument;
use Prophecy\Prophet;

class ScreenshotBridgeCest {

	/**
	 * @param FunctionalTester $I
	 */
	protected function _before( FunctionalTester $I ) {
		wp_cache_flush();
		$I->dontHavePostInDatabase( [] );
	}

	/**
	 * @return \Prophecy\Prophecy\ObjectProphecy
	 */
	private function getCloudClientObserver() {
		$prophet = new Prophet();

		return $prophet->prophesize( Brizy_Admin_Cloud_Client::class );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testImport( FunctionalTester $I ) {
		$fontUid = 'some_fonr_uid';
		$client  = $this->getCloudClientObserver();

		$bridge = new Brizy_Admin_Cloud_ScreenshotBridge( $client->reveal() );

		$fontId = $bridge->import( $fontUid, 'some uid' );
	}

	/**
	 * @param FunctionalTester $I
	 *
	 * @throws Exception
	 */
	public function testExport( FunctionalTester $I ) {
		$postID = $I->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Blocks_Main::CP_SAVED,
			'post_title'  => 'Save',
			'post_name'   => 'Save',
			'post_status' => 'publish',
			'meta_input'  => [
				'brizy'                       => serialize( [
						"brizy-post" => [
							'compiled_html'      => '',
							'compiled_html_body' => null,
							'compiled_html_head' => null,
							'editor_version'     => null,
							'compiler_version'   => null,
							'plugin_version'     => null,
							'editor_data'        => 'eyJ0eXBlIjoiU2VjdGlvbiIsImJsb2NrSWQiOiJCbGFuazAwMExpZ2h0IiwidmFsdWUiOnsiX3N0eWxlcyI6WyJzZWN0aW9uIl0sIml0ZW1zIjpbeyJ0eXBlIjoiU2VjdGlvbkl0ZW0iLCJ2YWx1ZSI6eyJfc3R5bGVzIjpbInNlY3Rpb24taXRlbSJdLCJpdGVtcyI6W10sIl9pZCI6ImFsYWF5c3dlcnNxa3d0cmhxdGJxdmxjY2lqY3BzYXByaGxtcyJ9fV0sIl9pZCI6InljZ3dsd295d3l1bnRlb2NscWRkdGNyY3FxenVjeGpydWNnZSIsIl90aHVtYm5haWxTcmMiOiJxd2N2d2xzanRmdGR2cHh5Y2xkdXhqbnRkd25pcXR1aGZmaHkiLCJfdGh1bWJuYWlsV2lkdGgiOjYwMCwiX3RodW1ibmFpbEhlaWdodCI6NzAsIl90aHVtYm5haWxUaW1lIjoxNTU5ODkxMDY0OTQzfX0=',
							'brizy-use-brizy'    => true
						],
					]
				),
				'brizy_post_uid'              => 'sffbf00297b0b4e9ee27af32a7b79c333',
				'brizy-meta'                  => '{"_thumbnailSrc": "1234567890","_thumbnailWidth": 0}',
				'brizy-media'                 => '{"fonts":["pvfegzyhgbmoprmzmsxfakudbermsvztkyel","jzuulmiplxnszgangurbqaexkirdbgpfhfxm"],"images":["dd81059582abb5710fa8ca1da32a825a4f4bc587.jpeg","e3959c03766425afcfa8bd16e72fb505b6221ae1.jpeg"]}',
				'brizy-post-editor-version'   => '1.0.101',
				'brizy-post-compiler-version' => '1.0.101',
				'brizy-need-compile'          => 0,
			],
		] );

		$manager    = new Brizy_Editor_Screenshot_Manager( new  Brizy_Editor_UrlBuilder( null ) );
		$screenPath = $manager->getScreenshot( '1234567890' );

		$client = $this->getCloudClientObserver();
		$client->createScreenshot( '1234567890', $screenPath )
		       ->shouldBeCalled();

		$bridge = new Brizy_Admin_Cloud_ScreenshotBridge( $client->reveal() );
		$bridge->export( Brizy_Editor_Block::get( $postID ) );
	}

}
