<?php


class CreateBrizyPageCest {

	public function _before( AcceptanceTester $I ) {
		@$I->cleanUploadsDir();
		$I->loginAs( 'admin', 'admin' );
		$I->amOnPluginsPage();
		$I->activatePlugin( 'brizy' );
		$I->dontHavePostInDatabase( [] );
	}

	/**
	 * @param AcceptanceTester $I
	 */
	public function settingsPopupLayoutTest( AcceptanceTester $I ) {

		$I->amOnPagesPage();
		$I->click( '//*[@id="wpbody-content"]/div[3]/a' );
		$I->click( '.enable-brizy-editor' );

		$I->seePostInDatabase( [ 'post_type' => 'page', 'post_status' => 'draft' ] );

		$I->waitForEditorToLoad();
		$I->clickOnPublish();
		$I->waitForPublish( );

		$I->seePostInDatabase( [ 'post_type' => 'page', 'post_status' => 'publish' ] );
	}
}