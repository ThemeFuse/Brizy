<?php

use \Prophecy\Argument;


class BrizyAdminBlocksManagerCest {


	/**
	 * @param FunctionalTester $I
	 */
	protected function _before( FunctionalTester $I ) {
		wp_cache_flush();

		$I->dontHavePostInDatabase( [ 'post_type' => 'brizy-saved-block', ] );
		$I->dontHavePostInDatabase( [ 'post_type' => 'brizy-global-block', ] );

		$I->haveTransientInDatabase( 'brizy_cloud_editor_versions',
			[
				"sync"   => BRIZY_SYNC_VERSION,
				"editor" => "import-export-1-cloud",
				"free"   => "import-export-1-cloud",
				"pro"    => "import-export-1-cloud"
			]
		);

		Brizy_Admin_Cloud::unRegisterCloudFilters();
	}


	/**
	 * @param FunctionalTester $I
	 */
	public function testGetGlobalBlocks( FunctionalTester $I ) {

		// Having
		$blockUid = md5( time() );
		$blockId  = $I->havePostInDatabase( [
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


		// WHen
		$manager = new Brizy_Admin_Blocks_Manager( Brizy_Admin_Blocks_Main::CP_SAVED );
		$blocks  = $manager->getEntities( array() );

		foreach ( $blocks as $ablock ) {
			$I->assertInstanceOf( Brizy_Editor_Block::class, $ablock, 'It should return instances of Brizy_Editor_Block' );
		}

		$blocks = $manager->createResponseForEntities( $blocks );

		// Then
		foreach ( $blocks as $block ) {
			$I->assertEquals( $blockUid, $block['uid'], 'It should return the correct block uid' );
			$I->assertNotEmpty( $block['meta'], 'It should return some meta data' );
		}

	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testGetSavedBlocks( FunctionalTester $I ) {

		// Having
		$blockUid = md5( time() );
		$blockId  = $I->havePostInDatabase( [
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
		$manager = new Brizy_Admin_Blocks_Manager( Brizy_Admin_Blocks_Main::CP_SAVED );
		$blocks  = $manager->getEntities( array() );

		foreach ( $blocks as $ablock ) {
			$I->assertInstanceOf( Brizy_Editor_Block::class, $ablock, 'It should return instances of Brizy_Editor_Block' );
		}

		$blocks = $manager->createResponseForEntities( $blocks );
		// Then
		$I->assertCount( 1, $blocks, 'It should return only two blocks' );

		$I->assertEquals( $blockUid, $blocks[0]['uid'], 'It should return the correct block uid' );
		$I->assertArrayHasKey( 'uid', $blocks[0], 'It should return the uid property' );
		$I->assertArrayHasKey( 'meta', $blocks[0], 'It should return the meta property' );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testGetLocalSavedBlockByUid( FunctionalTester $I ) {
		// Having
		$blockUid = md5( time() );
		$blockId  = $I->havePostInDatabase( [
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
		$manager = new Brizy_Admin_Blocks_Manager( Brizy_Admin_Blocks_Main::CP_SAVED );
		$block   = $manager->getEntity( $blockUid );

		$I->assertInstanceOf( Brizy_Editor_Block::class, $block, 'It should return instances of Brizy_Editor_Block' );

		$block = $block->createResponse();
		// Then
		$I->assertEquals( $blockUid, $block['uid'], 'It should return the correct block uid' );
		$I->assertNotEmpty( $block['data'], 'It should return some data' );
		$I->assertEquals( $blockUid, $block['uid'], 'It should return the correct block uid' );
		$I->assertEquals( '{"_thumbnailSrc": "","_thumbnailWidth": 0}', $block['meta'], 'It should return the correct block meta' );
	}
}