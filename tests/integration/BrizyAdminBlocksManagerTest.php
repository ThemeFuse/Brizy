<?php

use \Prophecy\Argument;


class BrizyAdminBlocksManagerTest extends \Codeception\TestCase\WPTestCase {

	/**
	 * @var \IntegrationTester
	 */
	protected $tester;

	protected function _before() {
		wp_cache_flush();
		$this->tester->dontHavePostInDatabase( [] );
	}

	/**
	 * @return \Prophecy\Prophecy\ObjectProphecy
	 */
	private function getCloudClientObjserver() {
		$cloudClientObserver = $this->prophesize( Brizy_Admin_Cloud_Client::class );

		return $cloudClientObserver;
	}

	public function testGetGlobalBlocks() {

		// Having
		$blockUid = md5( time() );
		$blockId  = $this->tester->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Blocks_Main::CP_GLOBAL,
			'post_title'  => 'Global',
			'post_name'   => 'Global',
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
							'brizy-use-brizy'    => true,
						],
					]
				),
				'brizy_post_uid'              => $blockUid,
				'brizy-meta'                  => '{"_thumbnailSrc": "","_thumbnailWidth": 0}',
				'brizy-post-editor-version'   => '1.0.101',
				'brizy-post-compiler-version' => '1.0.101',
				'brizy-need-compile'          => 0,
			],
		] );

		$clientObserver = $this->getCloudClientObjserver();
		$clientObserver->getBlocks( Argument::any() )->shouldNotBeCalled();

		// WHen
		$manager = new Brizy_Admin_Blocks_Manager( $clientObserver->reveal() );
		$blocks  = $manager->getAllBlocks( Brizy_Admin_Blocks_Main::CP_GLOBAL, array(), array( 'uid', 'meta' ) );

		// Then
		foreach ( $blocks as $block ) {
			$this->assertEquals( $blockUid, $block['uid'], 'It should return the correct block uid' );
			$this->assertNotEmpty( $block['meta'], 'It should return some meta data' );
		}

	}

	public function testGetSavedBlocks() {

		// Having
		$blockUid = md5( time() );
		$blockId  = $this->tester->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Blocks_Main::CP_SAVED,
			'post_title'  => 'Saved',
			'post_name'   => 'Saved',
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
							'brizy-use-brizy'    => true,
						],
					]
				),
				'brizy_post_uid'              => $blockUid,
				'brizy-meta'                  => '{"_thumbnailSrc": "","_thumbnailWidth": 0}',
				'brizy-post-editor-version'   => '1.0.101',
				'brizy-post-compiler-version' => '1.0.101',
				'brizy-need-compile'          => 0,
			],
		] );


		$clientObserver = $this->getCloudClientObjserver();
		$clientObserver->getBlocks( Argument::exact( [ 'fields' => [ 'uid', 'meta' ] ] ) )
		               ->willReturn( [
			               [ 'uid' => md5( 'uid' ), 'meta' => 'some meta info' ],
			               [ 'uid' => $blockUid, 'meta' => 'some meta info' ]
		               ] )
		               ->shouldBeCalled();

		// WHen
		$manager = new Brizy_Admin_Blocks_Manager( $clientObserver->reveal() );
		$blocks  = $manager->getAllBlocks( Brizy_Admin_Blocks_Main::CP_SAVED, array(), [ 'uid', 'meta' ] );

		// Then
		$this->assertCount( 2, $blocks, 'It should return only two blocks' );

		$this->assertEquals( $blockUid, $blocks[0]['uid'], 'It should return the correct block uid' );

		$this->assertEquals( md5( 'uid' ), $blocks[1]['uid'], 'It should return the correct block uid' );
		$this->assertEquals( 'some meta info', $blocks[1]['meta'], 'It should return the correct block meta' );
	}

	public function testGetLocalSavedBlockByUid() {
		// Having
		$blockUid = md5( time() );
		$blockId  = $this->tester->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Blocks_Main::CP_SAVED,
			'post_title'  => 'Saved',
			'post_name'   => 'Saved',
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
							'brizy-use-brizy'    => true,
						],
					]
				),
				'brizy_post_uid'              => $blockUid,
				'brizy-meta'                  => '{"_thumbnailSrc": "","_thumbnailWidth": 0}',
				'brizy-post-editor-version'   => '1.0.101',
				'brizy-post-compiler-version' => '1.0.101',
				'brizy-need-compile'          => 0,
			],
		] );


		// WHen
		$clientObserver = $this->getCloudClientObjserver();
		$clientObserver->getBlocks( Argument::exact( [ 'filter' => [ 'uid' => $blockUid ] ] ) )
		               ->willReturn(
			               [
				               [
					               'uid'    => $blockUid,
					               'meta'   => '{"_thumbnailSrc": "","_thumbnailWidth": 0}',
					               'data'   => '{"type":"Section","blockId":"Blank000Light","value":{"_styles":["section"],"items":[{"type":"SectionItem","value":{"_styles":["section-item"],"items":[],"_id":"alaayswersqkwtrhqtbqvlccijcpsaprhlms"}}],"_id":"ycgwlwoywyunteoclqddtcrcqqzucxjrucge","_thumbnailSrc":"qwcvwlsjtftdvpxyclduxjntdwniqtuhffhy","_thumbnailWidth":600,"_thumbnailHeight":70,"_thumbnailTime":1559891064943}}',
					               'id'     => 12,
					               'status' => 'publish'
				               ]
			               ]
		               )
		               ->shouldNotBeCalled();

		$manager = new Brizy_Admin_Blocks_Manager( $clientObserver->reveal() );
		$block   = $manager->getBlockByUid( Brizy_Admin_Blocks_Main::CP_SAVED, $blockUid );

		// Then
		$this->assertEquals( $blockUid, $block['uid'], 'It should return the correct block uid' );
		$this->assertNotEmpty( $block['data'], 'It should return some data' );
		$this->assertEquals( $blockUid, $block['uid'], 'It should return the correct block uid' );
		$this->assertEquals( '{"_thumbnailSrc": "","_thumbnailWidth": 0}', $block['meta'], 'It should return the correct block meta' );
	}

	public function testGetCloudBlockByUid() {
		// Having
		$blockUid = md5( time() );

		// WHen
		$clientObserver = $this->getCloudClientObjserver();
		$clientObserver->getBlocks( Argument::exact( [ 'filter' => [ 'uid' => $blockUid ] ] ) )
		               ->willReturn(
			               [
				               [
					               'uid'    => $blockUid,
					               'meta'   => '{"_thumbnailSrc": "","_thumbnailWidth": 0}',
					               'data'   => '{"type":"Section","blockId":"Blank000Light","value":{"_styles":["section"],"items":[{"type":"SectionItem","value":{"_styles":["section-item"],"items":[],"_id":"alaayswersqkwtrhqtbqvlccijcpsaprhlms"}}],"_id":"ycgwlwoywyunteoclqddtcrcqqzucxjrucge","_thumbnailSrc":"qwcvwlsjtftdvpxyclduxjntdwniqtuhffhy","_thumbnailWidth":600,"_thumbnailHeight":70,"_thumbnailTime":1559891064943}}',
					               'id'     => 12,
					               'status' => 'publish'
				               ]
			               ]
		               )
		               ->shouldBeCalled();

		$manager = new Brizy_Admin_Blocks_Manager( $clientObserver->reveal() );
		$block   = $manager->getBlockByUid( Brizy_Admin_Blocks_Main::CP_SAVED, $blockUid );

		// Then
		$this->assertEquals( $blockUid, $block['uid'], 'It should return the correct block uid' );
		$this->assertNotEmpty( $block['data'], 'It should return some data' );
		$this->assertEquals( $blockUid, $block['uid'], 'It should return the correct block uid' );
		$this->assertEquals( '{"_thumbnailSrc": "","_thumbnailWidth": 0}', $block['meta'], 'It should return the correct block meta' );
	}
}