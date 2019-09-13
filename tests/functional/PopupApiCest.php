<?php


class PopupApiCest {

	public function _before( FunctionalTester $I ) {
		wp_cache_flush();
		$I->dontHavePostInDatabase( [ 'post_type' => Brizy_Admin_Popups_Main::CP_GLOBAL_POPUP ] );
		$I->dontHavePostInDatabase( [ 'post_type' => Brizy_Admin_Popups_Main::CP_SAVED_POPUP ] );
		$I->haveManyPostsInDatabase( 2, [
			'post_type'   => Brizy_Admin_Popups_Main::CP_GLOBAL_POPUP,
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

		$I->haveManyPostsInDatabase( 2, [
			'post_type'   => Brizy_Admin_Popups_Main::CP_SAVED_POPUP,
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
				'brizy-meta'                  => '{"_thumbnailSrc": "","_thumbnailWidth": 0}',
				'brizy-media'                 => '{"fonts":["pvfegzyhgbmoprmzmsxfakudbermsvztkyel","jzuulmiplxnszgangurbqaexkirdbgpfhfxm"],"images":["dd81059582abb5710fa8ca1da32a825a4f4bc587.jpeg","e3959c03766425afcfa8bd16e72fb505b6221ae1.jpeg"]}',
				'brizy-post-editor-version'   => '1.0.101',
				'brizy-post-compiler-version' => '1.0.101',
				'brizy-need-compile'          => 0,
			],
		] );

		$I->loginAs( 'admin', 'admin' );
	}

	public function requestWithoutVersionKey( FunctionalTester $I ) {
		$I->wantToTest( 'Request with invalid editor version' );
		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [ 'action' => Brizy_Admin_Popups_Api::GET_GLOBAL_POPUPS_ACTION ] ) );
		$I->seeResponseCodeIs( 400 );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function getGlobalPopupByIdTest( FunctionalTester $I ) {

		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'  => Brizy_Admin_Popups_Api::GET_GLOBAL_POPUP_BY_UID_ACTION,
				'uid'      => 'gffbf00297b0b4e9ee27af32a7b79c3331',
				'version' => BRIZY_EDITOR_VERSION
			] ) );

		$I->seeResponseCodeIsSuccessful();

		$jsonResponse = $I->grabResponse();
		$popup        = json_decode( $jsonResponse );

		$I->assertNotNull( $popup->data, 'Response sould contain property data' );

		$popup = $popup->data;

		$I->assertNotNull( $popup->uid, 'Popup should contain property: uid' );
		$I->assertNotNull( $popup->status, 'Popup should contain property:  status' );
		$I->assertNotNull( $popup->data, 'Popup should contain property:  data' );
		$I->assertFalse( isset( $popup->media ), 'Popup should not contain property:  media' );
		$I->assertEquals( $popup->meta, '{"_thumbnailSrc": "","_thumbnailWidth": 0}', 'Popup should contain correct meta value' );

	}

	/**
	 * @param FunctionalTester $I
	 */
	public function getSavedPopupByIdTest( FunctionalTester $I ) {

		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'  => Brizy_Admin_Popups_Api::GET_SAVED_POPUP_BY_UID_ACTION,
				'uid'      => 'sffbf00297b0b4e9ee27af32a7b79c3331',
				'version' => BRIZY_EDITOR_VERSION
			] ) );

		$I->seeResponseCodeIsSuccessful();

		$jsonResponse = $I->grabResponse();
		$popup        = json_decode( $jsonResponse );

		$I->assertNotNull( $popup->data, 'Response sould contain property data' );

		$popup = $popup->data;

		$I->assertNotNull( $popup->uid, 'Popup should contain property: uid' );
		$I->assertNotNull( $popup->status, 'Popup should contain property:  status' );
		$I->assertNotNull( $popup->data, 'Popup should contain property:  data' );
		$I->assertFalse( isset( $popup->media ), 'Popup should not contain property:  media' );
		$I->assertEquals( $popup->meta, '{"_thumbnailSrc": "","_thumbnailWidth": 0}', 'Popup should contain correct meta value' );

	}

	/**
	 * @param FunctionalTester $I
	 */
	public function getGlobalPopupsTest( FunctionalTester $I ) {

		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'  => Brizy_Admin_Popups_Api::GET_GLOBAL_POPUPS_ACTION,
				'version' => BRIZY_EDITOR_VERSION
			] ) );

		$I->seeResponseCodeIsSuccessful();

		$jsonResponse = $I->grabResponse();
		$array        = json_decode( $jsonResponse );

		$I->assertCount( 2, $array->data, 'Response should contain two blocks' );

		foreach ( $array->data as $popup ) {
			$I->assertNotNull( $popup->uid, 'Popup should contain property: uid' );
			//$I->assertNotNull( $popup->status, 'Popup should contain property:  status' );
			//$I->assertNotNull( $popup->data, 'Popup should contain property:  data' );
			$I->assertFalse( isset( $popup->media ), 'Popup should not contain property:  media' );
			$I->assertEquals( $popup->meta, '{"_thumbnailSrc": "","_thumbnailWidth": 0}', 'Popup should contain correct meta value' );
		}

	}

	/**
	 * @param FunctionalTester $I
	 */
	public function getSavedPopupsTest( FunctionalTester $I ) {

		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'  => Brizy_Admin_Popups_Api::GET_SAVED_POPUPS_ACTION,
				'version' => BRIZY_EDITOR_VERSION
			] ) );

		$I->seeResponseCodeIsSuccessful();

		$jsonResponse = $I->grabResponse();
		$array        = json_decode( $jsonResponse );

		$I->assertCount( 2, $array->data, 'Response should contain two blocks' );

		foreach ( $array->data as $popup ) {
			$I->assertNotNull( $popup->uid, 'Popup should contain property: uid' );
			//$I->assertNotNull( $popup->status, 'Popup should contain property:  status' );
			//$I->assertNotNull( $popup->data, 'Popup should contain property:  data' );
			//$I->assertFalse( isset( $popup->media ), 'Popup should not contain property:  media' );
			$I->assertNotNull( $popup->meta, 'Popup should contain property:  meta' );
			$I->assertEquals( $popup->meta, '{"_thumbnailSrc": "","_thumbnailWidth": 0}', 'Popup should contain correct meta value' );
		}
	}


	public function createGlobalPopupTest( FunctionalTester $I ) {
		$meta  = '{"_thumbnailSrc": "","_thumbnailWidth": 0}';
		$media = '{"fonts":["pvfegzyhgbmoprmzmsxfakudbermsvztkyel","jzuulmiplxnszgangurbqaexkirdbgpfhfxm"],"images":["dd81059582abb5710fa8ca1da32a825a4f4bc587.jpeg","e3959c03766425afcfa8bd16e72fb505b6221ae1.jpeg"]}';


		$I->sendAjaxPostRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'  => Brizy_Admin_Popups_Api::CREATE_GLOBAL_POPUP_ACTION,
				'version' => BRIZY_EDITOR_VERSION
			] ), [
			'uid'   => 'rvnmxwnzfehrukgcaepiaaucgfzaseyygfso',
			'data'  => '{"type":"Section","blockId":"Blank000Light","value":{"_styles":["section"],"items":[{"type":"SectionItem","value":{"_styles":["section-item"],"items":[],"_id":"avqjytdqwvbxwvezdfrayhrcutiggckqhdet"}}],"_id":"djopvkarfnjwvlvidjswzhfcpqhmvnahxvdj","_thumbnailSrc":"djopvkarfnjwvlvidjswzhfcpqhmvnahxvdj","_thumbnailWidth":600,"_thumbnailHeight":70,"_thumbnailTime":1559892714552}}',
			'meta'  => $meta,
			'media' => $media
		] );

		$I->seeResponseCodeIsSuccessful();
		$jsonResponse = $I->grabResponse();
		$popup        = json_decode( $jsonResponse );
		$popup        = $popup->data;

		$I->assertNotNull( $popup->uid, 'Popup should contain property: uid' );
		$I->assertNotNull( $popup->status, 'Popup should contain property:  status' );
		$I->assertNotNull( $popup->data, 'Popup should contain property:  data' );
		$I->assertFalse( isset( $popup->media ), 'Popup should not contain property:  media' );
		$I->assertEquals( $popup->meta, $meta, 'Popup should contain the meta property and the correct value' );
	}

	public function updateGlobalPopupTest( FunctionalTester $I ) {

		$uid         = 'sffbf00297';
		$newPosition = [ 'align' => 'bottom', 'index' => 2 ];

		$newPopupData = '{"type":"Section","blockId":"Blank000Light","value":{"_styles":["section"],"items":[{"type":"SectionItem","value":{"_styles":["section-item"],"items":[{"type":"Wrapper","value":{"_styles":["wrapper","wrapper--richText"],"items":[{"type":"RichText","value":{"_styles":["richText"],"_id":"syjtlzsdrwrgnmwxpstedqobpsdfxmavczha"}}],"_id":"xkthoywyegkdidqznqjrkccydqiaycgawlty"}}],"_id":"avqjytdqwvbxwvezdfrayhrcutiggckqhdet"}}],"_id":"djopvkarfnjwvlvidjswzhfcpqhmvnahxvdj","_thumbnailSrc":"rvnmxwnzfehrukgcaepiaaucgfzaseyygfso","_thumbnailWidth":600,"_thumbnailHeight":70,"_thumbnailTime":1559892726684}}';

		$popupId = $I->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Popups_Main::CP_GLOBAL_POPUP,
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
				'brizy_post_uid'              => $uid,
				'brizy-meta'                  => '{"_thumbnailSrc": "","_thumbnailWidth": 0}',
				'brizy-post-editor-version'   => '1.0.101',
				'brizy-post-compiler-version' => '1.0.101',
				'brizy-need-compile'          => 0,
			],
		] );


		$newMeta = '{"_thumbnailSrc": "1","_thumbnailWidth": "1"}';
		$I->sendAjaxPostRequest( 'wp-admin/admin-ajax.php?' . build_query( [ 'action' => Brizy_Admin_Popups_Api::UPDATE_GLOBAL_POPUP_ACTION ] ), [
			'uid'         => $uid,
			'data'        => $newPopupData,
			'meta'        => $newMeta,
			'is_autosave' => 1,
			'version'     => BRIZY_EDITOR_VERSION
		] );

		$I->seeResponseCodeIsSuccessful();
		$popup = json_decode( $I->grabResponse() );

		$popup = $popup->data;

		$I->assertEquals( $popup->uid, $uid, 'Popup should contain valid uid' );
		$I->assertEquals( $popup->status, 'publish', 'Popup should contain property:  status' );
		$I->assertEquals( $popup->data, $newPopupData, 'Popup should contain updated data' );

		$I->assertEquals( $popup->meta, $newMeta, 'Popup should contain updated meta property' );
		$I->assertFalse( isset( $popup->media ), 'Popup should not contain property:  media' );

		$I->seePostInDatabase( [ 'post_type' => 'revision', 'post_parent' => $popupId ] );
		$I->dontSeePostMetaInDatabase( [
			'post_id'  => $popupId,
			'meta_key' => 'brizy-media',
		] );
	}


	public function createSavedPopupTest( FunctionalTester $I ) {
		$metaData  = '{"_thumbnailSrc": "","_thumbnailWidth": 0}';
		$mediaData = '{"fonts":["pvfegzyhgbmoprmzmsxfakudbermsvztkyel","jzuulmiplxnszgangurbqaexkirdbgpfhfxm"],"images":["dd81059582abb5710fa8ca1da32a825a4f4bc587.jpeg","e3959c03766425afcfa8bd16e72fb505b6221ae1.jpeg"]}';

		$data = '{"type":"Section","blockId":"Blank000Light","value":{"_styles":["section"],"items":[{"type":"SectionItem","value":{"_styles":["section-item"],"items":[],"_id":"avqjytdqwvbxwvezdfrayhrcutiggckqhdet"}}],"_id":"djopvkarfnjwvlvidjswzhfcpqhmvnahxvdj","_thumbnailSrc":"djopvkarfnjwvlvidjswzhfcpqhmvnahxvdj","_thumbnailWidth":600,"_thumbnailHeight":70,"_thumbnailTime":1559892714552}}';

		$I->sendAjaxPostRequest( 'wp-admin/admin-ajax.php?' . build_query( [ 'action' => Brizy_Admin_Popups_Api::CREATE_SAVED_POPUP_ACTION ] ), [
			'uid'     => 'rvnmxwnzfehrukgcaepiaaucgfzaseyygfso',
			'data'    => $data,
			'meta'    => $metaData,
			'media'   => $mediaData,
			'version' => BRIZY_EDITOR_VERSION

		] );

		$I->seeResponseCodeIsSuccessful();
		$popup = json_decode( $I->grabResponse() );
		$popup = $popup->data;

		$I->assertNotNull( $popup->uid, 'Popup should contain property: uid' );
		$I->assertNotNull( $popup->status, 'Popup should contain property:  status' );
		$I->assertEquals( $popup->data, $data, 'Popup should contain property:  data' );
		$I->assertEquals( $popup->meta, $metaData, 'Popup should contain property:  meta' );
		$I->assertFalse( isset( $popup->media ), 'Popup should not contain property:  media' );
	}

	public function createPopupWithInvalidDataTest( FunctionalTester $I ) {

		$I->sendAjaxPostRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'  => Brizy_Admin_Popups_Api::CREATE_SAVED_POPUP_ACTION,
				'version' => BRIZY_EDITOR_VERSION
			] ), [
			'uid'   => 'rvnmxwnzfehrukgcaepiaaucgfzaseyygfso',
			'data'  => '{"type":"Section","blockId":"Blank000Light","value":{"_styles":["section"],"items":[{"type":"SectionItem","value":{"_styles":["section-item"],"items":[],"_id":"avqjytdqwvbxwvezdfrayhrcutiggckqhdet"}}],"_id":"djopvkarfnjwvlvidjswzhfcpqhmvnahxvdj","_thumbnailSrc":"djopvkarfnjwvlvidjswzhfcpqhmvnahxvdj","_thumbnailWidth":600,"_thumbnailHeight":70,"_thumbnailTime":1559892714552}}',
			'media' => []
		] );

		$I->seeResponseCodeIs( 400 );

		$I->sendAjaxPostRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'  => Brizy_Admin_Popups_Api::CREATE_SAVED_POPUP_ACTION,
				'version' => BRIZY_EDITOR_VERSION
			] ), [
			'uid'  => 'rvnmxwnzfehrukgcaepiaaucgfzaseyygfso',
			'data' => '{"type":"Section","blockId":"Blank000Light","value":{"_styles":["section"],"items":[{"type":"SectionItem","value":{"_styles":["section-item"],"items":[],"_id":"avqjytdqwvbxwvezdfrayhrcutiggckqhdet"}}],"_id":"djopvkarfnjwvlvidjswzhfcpqhmvnahxvdj","_thumbnailSrc":"djopvkarfnjwvlvidjswzhfcpqhmvnahxvdj","_thumbnailWidth":600,"_thumbnailHeight":70,"_thumbnailTime":1559892714552}}',
			'meta' => []
		] );

		$I->seeResponseCodeIs( 400 );

		$I->sendAjaxPostRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'  => Brizy_Admin_Popups_Api::CREATE_SAVED_POPUP_ACTION,
				'version' => BRIZY_EDITOR_VERSION
			] ), [
			'uid'   => 'rvnmxwnzfehrukgcaepiaaucgfzaseyygfso',
			'meta'  => [],
			'media' => []
		] );

		$I->seeResponseCodeIs( 400 );

		$I->sendAjaxPostRequest( 'wp-admin/admin-ajax.php?' . build_query( [
				'action'  => Brizy_Admin_Popups_Api::CREATE_SAVED_POPUP_ACTION,
				'version' => BRIZY_EDITOR_VERSION
			] ), [
			'data'  => '{"type":"Section","blockId":"Blank000Light","value":{"_styles":["section"],"items":[{"type":"SectionItem","value":{"_styles":["section-item"],"items":[],"_id":"avqjytdqwvbxwvezdfrayhrcutiggckqhdet"}}],"_id":"djopvkarfnjwvlvidjswzhfcpqhmvnahxvdj","_thumbnailSrc":"djopvkarfnjwvlvidjswzhfcpqhmvnahxvdj","_thumbnailWidth":600,"_thumbnailHeight":70,"_thumbnailTime":1559892714552}}',
			'meta'  => [],
			'media' => []
		] );

		$I->seeResponseCodeIs( 400 );

	}



	public function updateSavedPopupTest( FunctionalTester $I ) {

		$uid          = 'adaferersdfw';
		$newPopupData = '{"type":"Section","blockId":"Blank000Light","value":{"_styles":["section"],"items":[{"type":"SectionItem","value":{"_styles":["section-item"],"items":[{"type":"Wrapper","value":{"_styles":["wrapper","wrapper--richText"],"items":[{"type":"RichText","value":{"_styles":["richText"],"_id":"syjtlzsdrwrgnmwxpstedqobpsdfxmavczha"}}],"_id":"xkthoywyegkdidqznqjrkccydqiaycgawlty"}}],"_id":"avqjytdqwvbxwvezdfrayhrcutiggckqhdet"}}],"_id":"djopvkarfnjwvlvidjswzhfcpqhmvnahxvdj","_thumbnailSrc":"rvnmxwnzfehrukgcaepiaaucgfzaseyygfso","_thumbnailWidth":600,"_thumbnailHeight":70,"_thumbnailTime":1559892726684}}';
		$newMedia     = '{"fonts":[],"images":[]}';

		$popupId = $I->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Popups_Main::CP_SAVED_POPUP,
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
				'brizy-meta'                  => '{"_thumbnailSrc": "","_thumbnailWidth": 0}',
				'brizy-post-editor-version'   => '1.0.101',
				'brizy-post-compiler-version' => '1.0.101',
				'brizy-need-compile'          => 0,
				'brizy-media'                 => '{"fonts":["pvfegzyhgbmoprmzmsxfakudbermsvztkyel","jzuulmiplxnszgangurbqaexkirdbgpfhfxm"],"images":["dd81059582abb5710fa8ca1da32a825a4f4bc587.jpeg","e3959c03766425afcfa8bd16e72fb505b6221ae1.jpeg"]}'
			],
		] );


		$newMeta = '{"_thumbnailSrc": "1","_thumbnailWidth": "1"}';
		$I->sendAjaxPostRequest( 'wp-admin/admin-ajax.php?' . build_query( [ 'action' => Brizy_Admin_Popups_Api::UPDATE_SAVED_POPUP_ACTION ] ), [
			'uid'         => $uid,
			'data'        => $newPopupData,
			'meta'        => $newMeta,
			'media'       => $newMedia,
			'is_autosave' => 1,
			'version'     => BRIZY_EDITOR_VERSION
		] );

		$I->seeResponseCodeIsSuccessful();
		$popup = json_decode( $I->grabResponse() );
		$popup = $popup->data;

		$I->assertEquals( $popup->uid, $uid, 'Popup should contain valid uid' );
		$I->assertEquals( $popup->status, 'publish', 'Popup should contain property:  status' );
		$I->assertEquals( $popup->data, $newPopupData, 'Popup should contain updated data' );
		$I->assertEquals( $popup->meta, $newMeta, 'Popup should contain providede meta data' );
		$I->assertFalse( isset( $popup->media ), 'Popup should not contain property:  media' );
		$I->seePostMetaInDatabase( [
			'post_id'    => $popupId,
			'meta_key'   => 'brizy-media',
			'meta_value' => $newMedia
		] );
		$I->seePostInDatabase( [ 'post_type' => 'revision', 'post_parent' => $popupId ] );
	}

}