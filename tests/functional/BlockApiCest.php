<?php


class BlockApiCest {

	public function _before( FunctionalTester $I ) {
		wp_cache_flush();
		$I->dontHavePostInDatabase( [ 'post_type' => Brizy_Admin_Blocks_Main::CP_GLOBAL ] );
		$I->dontHavePostInDatabase( [ 'post_type' => Brizy_Admin_Blocks_Main::CP_SAVED ] );
		$I->haveManyPostsInDatabase( 2, [
			'post_type'   => Brizy_Admin_Blocks_Main::CP_GLOBAL,
			'post_title'  => 'Global {{n}}',
			'post_name'   => 'Global {{n}}',
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
							'position'           => [ 'top' => 0, 'bottom' => 1, 'currentAlign' => "top" ],
							'rules'              => []
						],
					]
				),
				'brizy_post_uid'              => 'gffbf00297b0b4e9ee27af32a7b79c333{{n}}',
				'brizy-post-editor-version'   => '1.0.101',
				'brizy-post-compiler-version' => '1.0.101',
				'brizy-need-compile'          => 0,
				'brizy-rules'                 => '{}',
			],
		] );

		$I->haveManyPostsInDatabase( 2, [
			'post_type'   => Brizy_Admin_Blocks_Main::CP_SAVED,
			'post_title'  => 'Save {{n}}',
			'post_name'   => 'Save {{n}}',
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
				'brizy_post_uid'              => 'sffbf00297b0b4e9ee27af32a7b79c333{{n}}',
				'brizy-post-editor-version'   => '1.0.101',
				'brizy-post-compiler-version' => '1.0.101',
				'brizy-need-compile'          => 0,
			],
		] );

		$I->loginAs( 'admin', 'admin' );
	}

	public function requestWithoutVersionKey( FunctionalTester $I ) {
		$I->wantToTest( 'Request with invalid editor version' );
		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [ 'action' => Brizy_Admin_Blocks_Api::GET_GLOBAL_BLOCKS_ACTION ] ) );
		$I->seeResponseCodeIs( 400 );
	}

	/**
	 * @param AcceptanceTester $I
	 */
	public function getGlobalBlocksTest( FunctionalTester $I ) {

		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'  => Brizy_Admin_Blocks_Api::GET_GLOBAL_BLOCKS_ACTION,
				'version' => BRIZY_EDITOR_VERSION
			] ) );

		$I->seeResponseCodeIsSuccessful();

		$jsonResponse = $I->grabResponse();
		$array        = json_decode( $jsonResponse );

		$I->assertCount( 2, $array->data, 'Response should contain two blocks' );

		foreach ( $array->data as $block ) {
			$I->assertNotNull( $block->uid, 'Block should contain property: uid' );
			$I->assertNotNull( $block->status, 'Block should contain property:  status' );
			$I->assertNotNull( $block->data, 'Block should contain property:  data' );
			$I->assertIsObject( $block->position, 'Block should contain property:  position and must be object' );
			$I->assertIsArray( $block->rules, 'Block should contain property:  rules and must be array' );
		}

	}

	/**
	 * @param AcceptanceTester $I
	 */
	public function getSavedBlocksTest( FunctionalTester $I ) {

		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'  => Brizy_Admin_Blocks_Api::GET_SAVED_BLOCKS_ACTION,
				'version' => BRIZY_EDITOR_VERSION
			] ) );

		$I->seeResponseCodeIsSuccessful();

		$jsonResponse = $I->grabResponse();
		$array        = json_decode( $jsonResponse );

		$I->assertCount( 2, $array->data, 'Response should contain two blocks' );

		foreach ( $array->data as $block ) {
			$I->assertNotNull( $block->uid, 'Block should contain property: uid' );
			$I->assertNotNull( $block->status, 'Block should contain property:  status' );
			$I->assertNotNull( $block->data, 'Block should contain property:  data' );
		}
	}


	public function createGlobalBlockTest( FunctionalTester $I ) {
		$I->sendAjaxPostRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'  => Brizy_Admin_Blocks_Api::CREATE_GLOBAL_BLOCK_ACTION,
				'version' => BRIZY_EDITOR_VERSION
			] ), [
			'uid'      => 'rvnmxwnzfehrukgcaepiaaucgfzaseyygfso',
			'data'     => '{"type":"Section","blockId":"Blank000Light","value":{"_styles":["section"],"items":[{"type":"SectionItem","value":{"_styles":["section-item"],"items":[],"_id":"avqjytdqwvbxwvezdfrayhrcutiggckqhdet"}}],"_id":"djopvkarfnjwvlvidjswzhfcpqhmvnahxvdj","_thumbnailSrc":"djopvkarfnjwvlvidjswzhfcpqhmvnahxvdj","_thumbnailWidth":600,"_thumbnailHeight":70,"_thumbnailTime":1559892714552}}',
			'position' => '{"align": "top","index": 1}'
		] );

		$I->seeResponseCodeIsSuccessful();
		$jsonResponse = $I->grabResponse();
		$block        = json_decode( $jsonResponse );
		$block        = $block->data;

		$I->assertNotNull( $block->uid, 'Block should contain property: uid' );
		$I->assertNotNull( $block->status, 'Block should contain property:  status' );
		$I->assertNotNull( $block->data, 'Block should contain property:  data' );
		$I->assertIsObject( $block->position, 'Block should contain property:  position and must be object' );
		$I->assertEquals( $block->position->align, 'top', 'Block position should contain updated align property' );
		$I->assertEquals( $block->position->index, 1, 'Block position should contain updated index property' );
		$I->assertIsArray( $block->rules, 'Block should contain property:  rules and must be array' );
	}

	public function updateGlobalBlockTest( FunctionalTester $I ) {

		$uid          = 'sffbf00297';
		$newBlockData = '{"type":"Section","blockId":"Blank000Light","value":{"_styles":["section"],"items":[{"type":"SectionItem","value":{"_styles":["section-item"],"items":[{"type":"Wrapper","value":{"_styles":["wrapper","wrapper--richText"],"items":[{"type":"RichText","value":{"_styles":["richText"],"_id":"syjtlzsdrwrgnmwxpstedqobpsdfxmavczha"}}],"_id":"xkthoywyegkdidqznqjrkccydqiaycgawlty"}}],"_id":"avqjytdqwvbxwvezdfrayhrcutiggckqhdet"}}],"_id":"djopvkarfnjwvlvidjswzhfcpqhmvnahxvdj","_thumbnailSrc":"rvnmxwnzfehrukgcaepiaaucgfzaseyygfso","_thumbnailWidth":600,"_thumbnailHeight":70,"_thumbnailTime":1559892726684}}';
		$newPosition  = [ 'align' => 'bottom', 'index' => 2 ];

		$blockId = $I->havePostInDatabase( [
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
							'position'           => [ 'align' => 'top', 'index' => 1 ],
							'rules'              => []
						],
					]
				),
				'brizy_post_uid'              => $uid,
				'brizy-post-editor-version'   => '1.0.101',
				'brizy-post-compiler-version' => '1.0.101',
				'brizy-need-compile'          => 0,
				'brizy-rules'                 => '{}',
			],
		] );


		$I->sendAjaxPostRequest( 'wp-admin/admin-ajax.php?' . build_query( [ 'action' => Brizy_Admin_Blocks_Api::UPDATE_GLOBAL_BLOCK_ACTION ] ), [
			'uid'         => $uid,
			'data'        => $newBlockData,
			'position'    => json_encode( $newPosition ),
			'is_autosave' => 1,
			'version'     => BRIZY_EDITOR_VERSION
		] );

		$I->seeResponseCodeIsSuccessful();
		$block = json_decode( $I->grabResponse() );

		$block = $block->data;

		$I->assertEquals( $block->uid, $uid, 'Block should contain valid uid' );
		$I->assertEquals( $block->status, 'publish', 'Block should contain property:  status' );
		$I->assertEquals( $block->data, $newBlockData, 'Block should contain updated data' );
		$I->assertIsObject( $block->position, 'Block should contain property:  position and must be object' );
		$I->assertEquals( $block->position->align, $newPosition['align'], 'Block position should contain updated align property' );
		$I->assertEquals( $block->position->index, $newPosition['index'], 'Block position should contain updated index property' );
		//$I->assertEquals( $block->position->currentAlign, $newPosition['currentAlign'], 'Block position should contain updated currentAlign property' );
		$I->assertIsArray( $block->rules, 'Block should contain property:  rules and must be array' );

		$I->seePostInDatabase( [ 'post_type' => 'revision', 'post_parent' => $blockId ] );
	}


	public function createSavedBlockTest( FunctionalTester $I ) {
		$I->sendAjaxPostRequest( 'wp-admin/admin-ajax.php?' . build_query( [ 'action' => Brizy_Admin_Blocks_Api::CREATE_SAVED_BLOCK_ACTION ] ), [
			'uid'     => 'rvnmxwnzfehrukgcaepiaaucgfzaseyygfso',
			'data'    => '{"type":"Section","blockId":"Blank000Light","value":{"_styles":["section"],"items":[{"type":"SectionItem","value":{"_styles":["section-item"],"items":[],"_id":"avqjytdqwvbxwvezdfrayhrcutiggckqhdet"}}],"_id":"djopvkarfnjwvlvidjswzhfcpqhmvnahxvdj","_thumbnailSrc":"djopvkarfnjwvlvidjswzhfcpqhmvnahxvdj","_thumbnailWidth":600,"_thumbnailHeight":70,"_thumbnailTime":1559892714552}}',
			'version' => BRIZY_EDITOR_VERSION

		] );

		$I->seeResponseCodeIsSuccessful();
		$block = json_decode( $I->grabResponse() );
		$block = $block->data;

		$I->assertNotNull( $block->uid, 'Block should contain property: uid' );
		$I->assertNotNull( $block->status, 'Block should contain property:  status' );
		$I->assertNotNull( $block->data, 'Block should contain property:  data' );
	}

	public function updateSavedBlockTest( FunctionalTester $I ) {

		$uid          = 'adaferersdfw';
		$newBlockData = '{"type":"Section","blockId":"Blank000Light","value":{"_styles":["section"],"items":[{"type":"SectionItem","value":{"_styles":["section-item"],"items":[{"type":"Wrapper","value":{"_styles":["wrapper","wrapper--richText"],"items":[{"type":"RichText","value":{"_styles":["richText"],"_id":"syjtlzsdrwrgnmwxpstedqobpsdfxmavczha"}}],"_id":"xkthoywyegkdidqznqjrkccydqiaycgawlty"}}],"_id":"avqjytdqwvbxwvezdfrayhrcutiggckqhdet"}}],"_id":"djopvkarfnjwvlvidjswzhfcpqhmvnahxvdj","_thumbnailSrc":"rvnmxwnzfehrukgcaepiaaucgfzaseyygfso","_thumbnailWidth":600,"_thumbnailHeight":70,"_thumbnailTime":1559892726684}}';

		$blockId = $I->havePostInDatabase( [
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
				'brizy_post_uid'              => $uid,
				'brizy-post-editor-version'   => '1.0.101',
				'brizy-post-compiler-version' => '1.0.101',
				'brizy-need-compile'          => 0
			],
		] );


		$I->sendAjaxPostRequest( 'wp-admin/admin-ajax.php?' . build_query( [ 'action' => Brizy_Admin_Blocks_Api::UPDATE_SAVED_BLOCK_ACTION ] ), [
			'uid'         => $uid,
			'data'        => $newBlockData,
			'is_autosave' => 1,
			'version'     => BRIZY_EDITOR_VERSION
		] );

		$I->seeResponseCodeIsSuccessful();
		$block = json_decode( $I->grabResponse() );
		$block = $block->data;

		$I->assertEquals( $block->uid, $uid, 'Block should contain valid uid' );
		$I->assertEquals( $block->status, 'publish', 'Block should contain property:  status' );
		$I->assertEquals( $block->data, $newBlockData, 'Block should contain updated data' );

		$I->seePostInDatabase( [ 'post_type' => 'revision', 'post_parent' => $blockId ] );
	}

}