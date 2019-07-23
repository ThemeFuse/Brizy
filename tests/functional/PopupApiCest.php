<?php


class PopupApiCest
{

    public function _before(FunctionalTester $I)
    {
//        $I->haveManyPostsInDatabase(2, [
//            'post_type' => Brizy_Admin_Popups_Main::CP_POPUP,
//            'post_title' => 'Popup {{n}}',
//            'post_name' => 'Popup {{n}}',
//            'post_status' => 'publish',
//            'meta_input' => [
//                'brizy' => serialize([
//                        "brizy-post" => [
//                            'compiled_html' => '',
//                            'compiled_html_body' => null,
//                            'compiled_html_head' => null,
//                            'editor_version' => null,
//                            'compiler_version' => null,
//                            'plugin_version' => null,
//                            'editor_data' => 'eyJ0eXBlIjoiU2VjdGlvbiIsImJsb2NrSWQiOiJCbGFuazAwMExpZ2h0IiwidmFsdWUiOnsiX3N0eWxlcyI6WyJzZWN0aW9uIl0sIml0ZW1zIjpbeyJ0eXBlIjoiU2VjdGlvbkl0ZW0iLCJ2YWx1ZSI6eyJfc3R5bGVzIjpbInNlY3Rpb24taXRlbSJdLCJpdGVtcyI6W10sIl9pZCI6ImFsYWF5c3dlcnNxa3d0cmhxdGJxdmxjY2lqY3BzYXByaGxtcyJ9fV0sIl9pZCI6InljZ3dsd295d3l1bnRlb2NscWRkdGNyY3FxenVjeGpydWNnZSIsIl90aHVtYm5haWxTcmMiOiJxd2N2d2xzanRmdGR2cHh5Y2xkdXhqbnRkd25pcXR1aGZmaHkiLCJfdGh1bWJuYWlsV2lkdGgiOjYwMCwiX3RodW1ibmFpbEhlaWdodCI6NzAsIl90aHVtYm5haWxUaW1lIjoxNTU5ODkxMDY0OTQzfX0=',
//                            'brizy-use-brizy' => true,
//                            'rules' => []
//                        ],
//                    ]
//                ),
//                'brizy_post_uid' => 'gffbf00297b0b4e9ee27af32a7b79c333{{n}}',
//                'brizy-post-editor-version' => '1.0.101',
//                'brizy-post-compiler-version' => '1.0.101',
//                'brizy-need-compile' => 0,
//                'brizy-rules' => '{}',
//            ],
//        ]);

        $I->loginAs('admin', 'admin');
    }

    public function createPopupTest(FunctionalTester $I)
    {
        $I->sendAjaxPostRequest('wp-admin/admin-ajax.php?' . build_query(['action' => Brizy_Admin_Popups_Api::CREATE_POPUP_ACTION]), [
            'uid' => 'rvnmxwnzfehrukgcaepiaaucgfzaseyygfso',
            'data' => '{"type":"Section","blockId":"Blank000Light","value":{"_styles":["section"],"items":[{"type":"SectionItem","value":{"_styles":["section-item"],"items":[],"_id":"avqjytdqwvbxwvezdfrayhrcutiggckqhdet"}}],"_id":"djopvkarfnjwvlvidjswzhfcpqhmvnahxvdj","_thumbnailSrc":"djopvkarfnjwvlvidjswzhfcpqhmvnahxvdj","_thumbnailWidth":600,"_thumbnailHeight":70,"_thumbnailTime":1559892714552}}',
        ]);

        $I->seeResponseCodeIsSuccessful();
        $jsonResponse = $I->grabResponse();
        $block = json_decode($jsonResponse);
        $block = $block->data;

        $I->assertNotNull($block->uid, 'Block should contain property: uid');
        $I->assertNotNull($block->data, 'Block should contain property:  data');
        $I->assertIsArray($block->rules, 'Block should contain property:  rules and must be array');
    }

    /**
     * @param FunctionalTester $I
     */
    public function updatePopupTest(FunctionalTester $I)
    {

        $uid = 'sffbf00297';
        $newBlockData = '{"type":"Section","blockId":"Blank000Light","value":{"_styles":["section"],"items":[{"type":"SectionItem","value":{"_styles":["section-item"],"items":[{"type":"Wrapper","value":{"_styles":["wrapper","wrapper--richText"],"items":[{"type":"RichText","value":{"_styles":["richText"],"_id":"syjtlzsdrwrgnmwxpstedqobpsdfxmavczha"}}],"_id":"xkthoywyegkdidqznqjrkccydqiaycgawlty"}}],"_id":"avqjytdqwvbxwvezdfrayhrcutiggckqhdet"}}],"_id":"djopvkarfnjwvlvidjswzhfcpqhmvnahxvdj","_thumbnailSrc":"rvnmxwnzfehrukgcaepiaaucgfzaseyygfso","_thumbnailWidth":600,"_thumbnailHeight":70,"_thumbnailTime":1559892726684}}';

        $blockId = $I->havePostInDatabase([
            'post_type' => Brizy_Admin_Popups_Main::CP_POPUP,
            'post_title' => 'Popup',
            'post_name' => 'Popup',
            'post_status' => 'publish',
            'meta_input' => [
                'brizy' => serialize([
                        "brizy-post" => [
                            'compiled_html' => '',
                            'compiled_html_body' => null,
                            'compiled_html_head' => null,
                            'editor_version' => null,
                            'compiler_version' => null,
                            'plugin_version' => null,
                            'editor_data' => 'eyJ0eXBlIjoiU2VjdGlvbiIsImJsb2NrSWQiOiJCbGFuazAwMExpZ2h0IiwidmFsdWUiOnsiX3N0eWxlcyI6WyJzZWN0aW9uIl0sIml0ZW1zIjpbeyJ0eXBlIjoiU2VjdGlvbkl0ZW0iLCJ2YWx1ZSI6eyJfc3R5bGVzIjpbInNlY3Rpb24taXRlbSJdLCJpdGVtcyI6W10sIl9pZCI6ImFsYWF5c3dlcnNxa3d0cmhxdGJxdmxjY2lqY3BzYXByaGxtcyJ9fV0sIl9pZCI6InljZ3dsd295d3l1bnRlb2NscWRkdGNyY3FxenVjeGpydWNnZSIsIl90aHVtYm5haWxTcmMiOiJxd2N2d2xzanRmdGR2cHh5Y2xkdXhqbnRkd25pcXR1aGZmaHkiLCJfdGh1bWJuYWlsV2lkdGgiOjYwMCwiX3RodW1ibmFpbEhlaWdodCI6NzAsIl90aHVtYm5haWxUaW1lIjoxNTU5ODkxMDY0OTQzfX0=',
                            'brizy-use-brizy' => true,
                            'rules' => []
                        ],
                    ]
                ),
                'brizy_post_uid' => $uid,
                'brizy-post-editor-version' => '1.0.101',
                'brizy-post-compiler-version' => '1.0.101',
                'brizy-need-compile' => 0,
                'brizy-rules' => '{}',
            ],
        ]);


        $I->sendAjaxPostRequest('wp-admin/admin-ajax.php?' . build_query(['action' => Brizy_Admin_Popups_Main::UPDATE_POPUP_ACTION]), [
            'uid' => $uid,
            'data' => $newBlockData,
            'is_autosave' => 1,
        ]);

        $I->seeResponseCodeIsSuccessful();
        $block = json_decode($I->grabResponse());
        $block = $block->data;

        $I->assertEquals($block->uid, $uid, 'Block should contain valid uid');
        $I->assertEquals($block->status, 'publish', 'Block should contain property:  status');
        $I->assertEquals($block->data, $newBlockData, 'Block should contain updated data');
        $I->assertIsArray($block->rules, 'Block should contain property:  rules and must be array');

        $I->seePostInDatabase(['post_type' => 'revision', 'post_parent' => $blockId]);
    }


}