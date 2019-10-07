<?php


class PopupDefaultRulesCest {

	public function _before( AcceptanceTester $I ) {
		$I->loginAs( 'admin', 'admin' );
	}

	/**
	 * @param AcceptanceTester $I
	 */
	public function settingsPopupLayoutTest( AcceptanceTester $I ) {

		$I->amOnPage( '/wp-admin/edit.php?post_type=brizy-popup' );
		$response = $I->grabResponse();
		//$I->waitForPageLoad( $I );

		// click on Add new
		$I->click( '#wpcontent .page-title-action' );
		//$I->waitForPageLoad( $I );

		// click on Add new
		$I->click( '.enable-brizy-editor' );
		//$I->waitForPageLoad( $I );

		$postId = $I->grabValueFrom( '#post_ID' );

	}


}