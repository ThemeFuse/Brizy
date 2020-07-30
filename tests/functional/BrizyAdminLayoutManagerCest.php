<?php

use \Prophecy\Argument;


class BrizyAdminLayoutManagerCest {


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
	public function testGetLayouts( FunctionalTester $I ) {

		// Having
		$layoutUid = md5( time() );
		$layoutId  = $I->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Layouts_Main::CP_LAYOUT,
			'post_title'  => 'CP_LAYOUT',
			'post_name'   => 'CP_LAYOUT',
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
				'brizy_post_uid'              => $layoutUid,
				'brizy-meta'                  => '{"_thumbnailSrc": "","_thumbnailWidth": 0}',
				'brizy-post-editor-version'   => '1.0.101',
				'brizy-post-compiler-version' => '1.0.101',
				'brizy-need-compile'          => 0,
			],
		] );


		// WHen
		$manager = new Brizy_Admin_Layouts_Manager( );
		$layouts  = $manager->getEntities( array() );

		foreach ( $layouts as $ablock ) {
			$I->assertInstanceOf( Brizy_Editor_Layout::class, $ablock, 'It should return instances of Brizy_Editor_Layout' );
		}

		$layouts = $manager->createResponseForEntities( $layouts );

		// Then
		foreach ( $layouts as $layout ) {
			$I->assertEquals( $layoutUid, $layout['uid'], 'It should return the correct block uid' );
			$I->assertNotEmpty( $layout['meta'], 'It should return some meta data' );
		}

	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testGetLocalLayoutByUid( FunctionalTester $I ) {
		// Having
		$layoutUid = md5( time() );
		$layoutId  = $I->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Layouts_Main::CP_LAYOUT,
			'post_title'  => '',
			'post_name'   => '',
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
				'brizy_post_uid'              => $layoutUid,
				'brizy-meta'                  => '{"_thumbnailSrc": "","_thumbnailWidth": 0}',
				'brizy-post-editor-version'   => '1.0.101',
				'brizy-post-compiler-version' => '1.0.101',
				'brizy-need-compile'          => 0,
			],
		] );


		// WHen
		$manager = new Brizy_Admin_Layouts_Manager();
		$layout   = $manager->getEntity( $layoutUid );

		$I->assertInstanceOf( Brizy_Editor_Layout::class, $layout, 'It should return instances of Brizy_Editor_Layout' );

		$layout = $layout->createResponse();
		// Then
		$I->assertEquals( $layoutUid, $layout['uid'], 'It should return the correct block uid' );
		$I->assertNotEmpty( $layout['data'], 'It should return some data' );
		$I->assertEquals( $layoutUid, $layout['uid'], 'It should return the correct block uid' );
		$I->assertEquals( '{"_thumbnailSrc": "","_thumbnailWidth": 0}', $layout['meta'], 'It should return the correct block meta' );
	}
}