<?php


class BlockApiCest {

	/**
	 * @param AcceptanceTester $I
	 */
	public function getGlobalBlocksTest( AcceptanceTester $I ) {
		$I->loginAsAdmin();
		$I->sendGET( 'admin-ajax.php', [ 'action' => 'brizy-get-global-blocks' ] );
		$I->seeResponseCodeIs( 200 );
	}

	/**
	 * @param AcceptanceTester $I
	 */
	public function getSavedBlocksTest( AcceptanceTester $I ) {

		$I->loginAsAdmin();
		$I->sendAjaxGetRequest('admin-ajax.php', [ 'action' => 'brizy-get-global-blocks' ]);
		//$I->sendGET( 'admin-ajax.php', [ 'action' => 'brizy-get-global-blocks' ] );
		$I->seeResponseCodeIs( 200 );
	}
}