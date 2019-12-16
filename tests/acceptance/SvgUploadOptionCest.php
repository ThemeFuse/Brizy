<?php


class SvgUploadOptionCest {

	/**
	 * @param AcceptanceTester $I
	 *
	 * @throws \Codeception\Exception\ModuleException
	 */
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
	public function settingsLayoutTest( AcceptanceTester $I ) {

		$I->amOnPage( 'wp-admin/admin.php?page=brizy-settings' );
		$I->see( 'Enable SVG Uploads' );
		$I->checkOption('#svg-upload-enabled');
		$I->click( '#submit' );
		$I->seeCheckboxIsChecked('#svg-upload-enabled');
		$I->see( 'Enable SVG Uploads' );
	}
}