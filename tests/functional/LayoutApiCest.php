<?php


class LayoutApiCest {

	public function _before( FunctionalTester $I ) {
		wp_cache_flush();
		$I->dontHavePostInDatabase( [ 'post_type' => Brizy_Admin_Layouts_Main::CP_LAYOUT ] );
		$I->haveManyPostsInDatabase( 2, [
			'post_type'   => Brizy_Admin_Layouts_Main::CP_LAYOUT,
			'post_title'  => 'Layout {{n}}',
			'post_name'   => 'Layout {{n}}',
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
				'brizy_post_uid'              => 'gffbf00297b0b4e9ee27af32a7b79c333{{n}}',
				'brizy-meta'                  => '{"_thumbnailSrc": "","_thumbnailWidth": 0}',
				'brizy-post-editor-version'   => '1.0.101',
				'brizy-post-compiler-version' => '1.0.101',
				'brizy-need-compile'          => 0,
			],
		] );

		$I->loginAs( 'admin', 'admin' );
	}

	public function requestWithoutVersionKey( FunctionalTester $I ) {
		$I->wantToTest( 'Request with invalid editor version' );
		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [ 'action' => Brizy_Admin_Layouts_Api::GET_LAYOUTS_ACTION ] ) );
		$I->seeResponseCodeIs( 400 );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function getLayoutByIdTest( FunctionalTester $I ) {

		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'  => Brizy_Admin_Layouts_Api::GET_LAYOUT_BY_UID_ACTION,
				'uid'     => 'gffbf00297b0b4e9ee27af32a7b79c3331',
				'version' => BRIZY_EDITOR_VERSION
			] ) );

		$jsonResponse = $I->grabResponse();
		$I->seeResponseCodeIsSuccessful();

		$layout = json_decode( $jsonResponse );

		$I->assertNotNull( $layout->data, 'Response should contain property data' );

		$layout = $layout->data;

		$I->assertNotNull( $layout->uid, 'Layout should contain property: uid' );
		$I->assertNotNull( $layout->status, 'Layout should contain property:  status' );
		$I->assertNotNull( $layout->data, 'Layout should contain property:  data' );
		$I->assertNotNull( $layout->synchronized, 'Layout should contain property:  synchronized' );
		$I->assertNotNull( $layout->synchronizable, 'Layout should contain property:  synchronizable' );
		$I->assertFalse( isset( $layout->media ), 'Layout should not contain property:  media' );
		$I->assertEquals( $layout->meta, '{"_thumbnailSrc": "","_thumbnailWidth": 0}', 'Layout should contain correct meta value' );

	}

	/**
	 * @param FunctionalTester $I
	 */
	public function getLayoutsWithoutFieldsTest( FunctionalTester $I ) {

		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'  => Brizy_Admin_Layouts_Api::GET_LAYOUTS_ACTION,
				'version' => BRIZY_EDITOR_VERSION
			] ) );

		$I->seeResponseCodeIsSuccessful();

		$jsonResponse = $I->grabResponse();
		$array        = json_decode( $jsonResponse );

		$I->assertCount( 2, $array->data, 'Response should contain two blocks' );

		foreach ( $array->data as $layout ) {
			$I->assertNotNull( $layout->uid, 'Layout should contain property: uid' );
			$I->assertNotNull( $layout->status, 'Layout should contain property:  status' );
			$I->assertNotNull( $layout->data, 'Layout should contain property:  data' );
			$I->assertNotNull( $layout->synchronized, 'Layout should contain property:  synchronized' );
			$I->assertNotNull( $layout->synchronizable, 'Layout should contain property:  synchronizable' );
			$I->assertFalse( isset( $layout->media ), 'Layout should not contain property:  media' );
			$I->assertEquals( $layout->meta, '{"_thumbnailSrc": "","_thumbnailWidth": 0}', 'Layout should contain correct meta value' );
		}

	}

	/**
	 * @param FunctionalTester $I
	 */
	public function getLayoutsWithFieldsTest( FunctionalTester $I ) {

		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'  => Brizy_Admin_Layouts_Api::GET_LAYOUTS_ACTION,
				'version' => BRIZY_EDITOR_VERSION,
				'fields'  => [ 'uid', 'meta','synchronized' ]
			] ) );

		$I->seeResponseCodeIsSuccessful();

		$jsonResponse = $I->grabResponse();
		$array        = json_decode( $jsonResponse );

		$I->assertCount( 2, $array->data, 'Response should contain two blocks' );

		foreach ( $array->data as $popup ) {
			$I->assertTrue( isset($popup->uid), 'Layout should contain property: uid' );
			$I->assertTrue( isset($popup->synchronized), 'Layout should contain property: synchronized' );
			$I->assertFalse( isset($popup->status), 'Layout should contain property:  status' );
			$I->assertFalse(isset( $popup->data), 'Layout should contain property:  data' );
			$I->assertFalse( isset( $popup->media ), 'Layout should not contain property:  media' );
			$I->assertFalse( isset( $popup->synchronizable ), 'Layout should not contain property:  synchronizable' );
			$I->assertEquals( $popup->meta, '{"_thumbnailSrc": "","_thumbnailWidth": 0}', 'Layout should contain correct meta value' );
		}

	}

	public function createLayoutTest( FunctionalTester $I ) {
		$meta  = '{"_thumbnailSrc": "","_thumbnailWidth": 0}';
		$media = '{"fonts":["pvfegzyhgbmoprmzmsxfakudbermsvztkyel","jzuulmiplxnszgangurbqaexkirdbgpfhfxm"],"images":["dd81059582abb5710fa8ca1da32a825a4f4bc587.jpeg","e3959c03766425afcfa8bd16e72fb505b6221ae1.jpeg"]}';


		$I->sendAjaxPostRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'  => Brizy_Admin_Layouts_Api::CREATE_LAYOUT_ACTION,
				'version' => BRIZY_EDITOR_VERSION
			] ), [
			'uid'   => 'rvnmxwnzfehrukgcaepiaaucgfzaseyygfso',
			'data'  => '{"type":"Section","blockId":"Blank000Light","value":{"_styles":["section"],"items":[{"type":"SectionItem","value":{"_styles":["section-item"],"items":[],"_id":"avqjytdqwvbxwvezdfrayhrcutiggckqhdet"}}],"_id":"djopvkarfnjwvlvidjswzhfcpqhmvnahxvdj","_thumbnailSrc":"djopvkarfnjwvlvidjswzhfcpqhmvnahxvdj","_thumbnailWidth":600,"_thumbnailHeight":70,"_thumbnailTime":1559892714552}}',
			'meta'  => $meta,
			'media' => $media
		] );

		$I->seeResponseCodeIsSuccessful();
		$jsonResponse = $I->grabResponse();
		$layout        = json_decode( $jsonResponse );
		$layout        = $layout->data;

		$I->assertNotNull( $layout->uid, 'Layout should contain property: uid' );
		$I->assertNotNull( $layout->status, 'Layout should contain property:  status' );
		$I->assertNotNull( $layout->data, 'Layout should contain property:  data' );
		$I->assertFalse( isset( $layout->media ), 'Layout should not contain property:  media' );
		$I->assertNotNull( $layout->synchronized, 'Layout should contain property:  synchronized' );
		$I->assertNotNull( $layout->synchronizable, 'Layout should contain property:  synchronizable' );
		$I->assertEquals( $layout->meta, $meta, 'Layout should contain the meta property and the correct value' );
	}

	public function createLayoutWithInvalidDataTest( FunctionalTester $I ) {

		$I->sendAjaxPostRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'  => Brizy_Admin_Layouts_Api::CREATE_LAYOUT_ACTION,
				'version' => BRIZY_EDITOR_VERSION
			] ), [
			'uid'   => 'rvnmxwnzfehrukgcaepiaaucgfzaseyygfso',
			'data'  => '{"type":"Section","blockId":"Blank000Light","value":{"_styles":["section"],"items":[{"type":"SectionItem","value":{"_styles":["section-item"],"items":[],"_id":"avqjytdqwvbxwvezdfrayhrcutiggckqhdet"}}],"_id":"djopvkarfnjwvlvidjswzhfcpqhmvnahxvdj","_thumbnailSrc":"djopvkarfnjwvlvidjswzhfcpqhmvnahxvdj","_thumbnailWidth":600,"_thumbnailHeight":70,"_thumbnailTime":1559892714552}}',
			'media' => []
		] );

		$I->seeResponseCodeIs( 400 );

		$I->sendAjaxPostRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'  => Brizy_Admin_Layouts_Api::CREATE_LAYOUT_ACTION,
				'version' => BRIZY_EDITOR_VERSION
			] ), [
			'uid'  => 'rvnmxwnzfehrukgcaepiaaucgfzaseyygfso',
			'data' => '{"type":"Section","blockId":"Blank000Light","value":{"_styles":["section"],"items":[{"type":"SectionItem","value":{"_styles":["section-item"],"items":[],"_id":"avqjytdqwvbxwvezdfrayhrcutiggckqhdet"}}],"_id":"djopvkarfnjwvlvidjswzhfcpqhmvnahxvdj","_thumbnailSrc":"djopvkarfnjwvlvidjswzhfcpqhmvnahxvdj","_thumbnailWidth":600,"_thumbnailHeight":70,"_thumbnailTime":1559892714552}}',
			'meta' => []
		] );

		$I->seeResponseCodeIs( 400 );

		$I->sendAjaxPostRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'  => Brizy_Admin_Layouts_Api::CREATE_LAYOUT_ACTION,
				'version' => BRIZY_EDITOR_VERSION
			] ), [
			'uid'   => 'rvnmxwnzfehrukgcaepiaaucgfzaseyygfso',
			'meta'  => [],
			'media' => []
		] );

		$I->seeResponseCodeIs( 400 );

		$I->sendAjaxPostRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'  => Brizy_Admin_Layouts_Api::CREATE_LAYOUT_ACTION,
				'version' => BRIZY_EDITOR_VERSION
			] ), [
			'data'  => '{"type":"Section","blockId":"Blank000Light","value":{"_styles":["section"],"items":[{"type":"SectionItem","value":{"_styles":["section-item"],"items":[],"_id":"avqjytdqwvbxwvezdfrayhrcutiggckqhdet"}}],"_id":"djopvkarfnjwvlvidjswzhfcpqhmvnahxvdj","_thumbnailSrc":"djopvkarfnjwvlvidjswzhfcpqhmvnahxvdj","_thumbnailWidth":600,"_thumbnailHeight":70,"_thumbnailTime":1559892714552}}',
			'meta'  => [],
			'media' => []
		] );

		$I->seeResponseCodeIs( 400 );

	}


	public function updateLayoutTest( FunctionalTester $I ) {

		$uid         = 'sffbf00297';
		$newPosition = [ 'align' => 'bottom', 'index' => 2 ];

		$newLayoutData = '{"type":"Section","blockId":"Blank000Light","value":{"_styles":["section"],"items":[{"type":"SectionItem","value":{"_styles":["section-item"],"items":[{"type":"Wrapper","value":{"_styles":["wrapper","wrapper--richText"],"items":[{"type":"RichText","value":{"_styles":["richText"],"_id":"syjtlzsdrwrgnmwxpstedqobpsdfxmavczha"}}],"_id":"xkthoywyegkdidqznqjrkccydqiaycgawlty"}}],"_id":"avqjytdqwvbxwvezdfrayhrcutiggckqhdet"}}],"_id":"djopvkarfnjwvlvidjswzhfcpqhmvnahxvdj","_thumbnailSrc":"rvnmxwnzfehrukgcaepiaaucgfzaseyygfso","_thumbnailWidth":600,"_thumbnailHeight":70,"_thumbnailTime":1559892726684}}';

		$popupId = $I->havePostInDatabase( [
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
				'brizy_post_uid'              => $uid,
				'brizy-meta'                  => '{"_thumbnailSrc": "","_thumbnailWidth": 0}',
				'brizy-post-editor-version'   => '1.0.101',
				'brizy-post-compiler-version' => '1.0.101',
				'brizy-need-compile'          => 0,
			],
		] );


		$newMeta = '{"_thumbnailSrc": "1","_thumbnailWidth": "1"}';
		$I->sendAjaxPostRequest( 'wp-admin/admin-ajax.php?' . build_query( [ 'action' => Brizy_Admin_Layouts_Api::UPDATE_LAYOUT_ACTION ] ), [
			'uid'         => $uid,
			'data'        => $newLayoutData,
			'meta'        => $newMeta,
			'is_autosave' => 1,
			'dataVersion' => 2,
			'version'     => BRIZY_EDITOR_VERSION
		] );
		$popup = json_decode( $I->grabResponse() );
		$I->seeResponseCodeIsSuccessful();


		$popup = $popup->data;

		$I->assertEquals( $popup->uid, $uid, 'Layout should contain valid uid' );
		$I->assertEquals( $popup->status, 'publish', 'Layout should contain property:  status' );
		$I->assertEquals( $popup->data, $newLayoutData, 'Layout should contain updated data' );

		$I->assertEquals( $popup->meta, $newMeta, 'Layout should contain updated meta property' );
		$I->assertFalse( isset( $popup->media ), 'Layout should not contain property:  media' );

		$I->seePostInDatabase( [ 'post_type' => 'revision', 'post_parent' => $popupId ] );
		$I->dontSeePostMetaInDatabase( [
			'post_id'  => $popupId,
			'meta_key' => 'brizy-media',
		] );
	}
}