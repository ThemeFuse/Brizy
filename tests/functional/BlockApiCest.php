<?php


class BlockApiCest {


	public function _before(FunctionalTester $I)
	{
		$I->haveManyPostsInDatabase( 2, [ 'post_type' => 'brizy-global-block', 'post_status' => 'publish' ] );
		$I->haveManyPostsInDatabase( 2, [ 'post_type' => 'brizy-saved-block', 'post_status' => 'publish' ] );
	}


	/**
	 * @param AcceptanceTester $I
	 */
	public function getGlobalBlocksTest( FunctionalTester $I ) {
		$I->loginAs('admin','admin');
		$I->amOnPluginsPage();
		$I->activatePlugin('brizy');
		$I->sendAjaxGetRequest( 'admin-ajax.php' ,  [ 'action' => 'brizy-get-global-blocks' ] );
		$I->seeResponseCodeIsSuccessful();


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