<?php


class BlockApiCest {


	public function _before( FunctionalTester $I ) {
		$I->haveManyPostsInDatabase( 2, [
			'post_type'   => 'brizy-global-block',
			'post_title'  => 'Global {{n}}',
			'post_name'   => 'Global {{n}}',
			'post_status' => 'publish',
			'meta_input'  => [
				'brizy'                       => 'a:0:{}',
				'brizy_post_uid'              => 'ffbf00297b0b4e9ee27af32a7b79c333{{n}}',
				'brizy-post-editor-version'   => '1.0.101',
				'brizy-post-compiler-version' => '1.0.101',
				'brizy-need-compile'          => 0,
			],
		] );

		$I->havePostInDatabase( [
			'post_type'   => 'brizy-saved-block',
			'post_title'  => 'Global {{n}}',
			'post_name'   => 'Global {{n}}',
			'post_status' => 'publish',
			'meta_input'  => [
				'brizy'                       => 'a:0:{}',
				'brizy_post_uid'              => 'ffbf00297b0b4e9ee27af32a7b79c3332',
				'brizy-post-editor-version'   => '1.0.101',
				'brizy-post-compiler-version' => '1.0.101',
				'brizy-need-compile'          => 0,
			],
		] );
	}


	/**
	 * @param AcceptanceTester $I
	 */
	public function getGlobalBlocksTest( FunctionalTester $I ) {

		$I->loginAs( 'admin', 'admin' );

		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [ 'action' => 'brizy-get-global-blocks' ] ) );
		$I->seeResponseCodeIsSuccessful();

		$jsonResponse = $I->grabResponse();
		print_r($jsonResponse);
		$array        = json_decode( $jsonResponse );

		$I->assertCount( 2, $array, 'Response should contain two blocks' );

		foreach ( $array as $block ) {
			$I->assertNotNull($block->uid,'Block should contain property: uid');
			$I->assertNotNull($block->status,'Block should contain property:  status');
			$I->assertNotNull($block->data,'Block should contain property:  data');
			$I->assertNotNull($block->position,'Block should contain property:  position');
			$I->assertNotNull($block->rules,'Block should contain property:  rules');
		}

	}

	/**
	 * @param AcceptanceTester $I
	 */
//	public function getSavedBlocksTest( FunctionalTester $I ) {
//
//		$I->loginAsAdmin();
//		$I->seePluginActivated('brizy');
//		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php', [ 'action' => 'brizy-get-saved-blocks' ] );
//		$I->seeResponseCodeIsSuccessful();
//	}

}