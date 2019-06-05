<?php


class BlockApiCest {

	/**
	 * @param AcceptanceTester $I
	 */
	public function getGlobalBlocksTest( AcceptanceTester $I ) {

		$I->haveManyPostsInDatabase( 1, [ 'post_type' => 'bizy-global-block', 'post_status' => 'publish' ] );
		$I->loginAsAdmin();
		$I->amOnPluginsPage();
		$I->activatePlugin('brizy');
		// create the nonce

		$I->sendAjaxGetRequest( 'admin-ajax.php' ,  [ 'action' => 'brizy-get-global-blocks' ] );
		$I->seeResponseCodeIsSuccessful();
	}

	/**
	 * @param AcceptanceTester $I
	 */
	public function getSavedBlocksTest( AcceptanceTester $I ) {

		$I->haveManyPostsInDatabase( 1, [ 'post_type' => 'bizy-saved-block', 'post_status' => 'publish' ] );
		$I->loginAsAdmin();
		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php', [ 'action' => 'brizy-get-saved-blocks' ] );
		$I->seeResponseCodeIsSuccessful();
	}

}