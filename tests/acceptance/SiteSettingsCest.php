<?php


class SiteSettingsCest {

	public function _before( AcceptanceTester $I ) {
		$I->loginAs( 'admin', 'admin' );
		$I->amOnPluginsPage();
		@$I->cleanUploadsDir();
		$I->activatePlugin( 'brizy' );
	}

	/**
	 * @param AcceptanceTester $I
	 */
	public function settingsPopupLayoutTest( AcceptanceTester $I ) {

		$I->amOnPage( '/wp-content/plugins/brizy/admin/site-settings.php' );
		$I->waitForPageLoad( $I );
		// test popup
		$I->see( 'Project' );
		$I->see( 'Site Settings' );
		$I->see( 'Social Sharing' );
		$I->see( 'Custom CSS' );
		$I->see( 'Code Injection' );

		// test site settings tab
		$I->click( '#settingsDash > li:nth-of-type(1)' );
		$I->see( 'Site Title' );
		$I->see( 'Site Description' );
		$I->see( 'Favicon' );
		$I->see( 'Save Changes' );

		// test social sharing tab
		$I->click( '#settingsDash > li:nth-of-type(2)' );
		$I->see( 'Social information' );
		$I->see( 'Status Message' );
		$I->see( 'Description (max. 280 characters)' );
		$I->see( 'Image Thumbnail' );
		$I->see( 'Save Changes' );

		// test custom css tab
		$I->click( '#settingsDash > li:nth-of-type(3)' );
		$I->see( 'Custom CSS' );
		$I->see( 'This area will allow you to add custom CSS rules into your site.' );
		$I->see( 'Save Changes' );

		// test code injection tab
		$I->click( '#settingsDash > li:nth-of-type(4)' );
		$I->see( 'Code Injection > Header' );
		$I->see( 'Code Injection > Footer' );
		$I->see( 'Save Changes' );
	}


	/**
	 * @param AcceptanceTester $I
	 */
	public function inPageSiteSettingsTest( AcceptanceTester $I ) {
		$I->haveOptionInDatabase( 'blogname', md5( 'blogname' ) );
		$I->haveOptionInDatabase( 'blogdescription', md5( 'blogdescription' ) );

		$I->haveOptionInDatabase( 'brizy-settings-favicon', md5( 'brizy-settings-favicon' ) );
		$I->haveOptionInDatabase( 'brizy-social-title', md5( 'brizy-social-title' ) );
		$I->haveOptionInDatabase( 'brizy-social-description', md5( 'brizy-social-description' ) );
		$I->haveOptionInDatabase( 'brizy-social-thumbnail', md5( 'brizy-social-thumbnail' ) );
		$I->haveOptionInDatabase( 'brizy-custom-css', md5( 'brizy-custom-css' ) );
		$I->haveOptionInDatabase( 'brizy-header-injection', md5( 'brizy-header-injection' ) );
		$I->haveOptionInDatabase( 'brizy-footer-injection', md5( 'brizy-footer-injection' ) );

		$I->amOnPage( '/ ' );

		$I->seeInSource( md5( 'blogname' ) );
		$I->seeInSource( md5( 'blogdescription' ) );
		$I->seeInSource( md5( 'brizy-settings-favicon' ) );
		$I->seeInSource( md5( 'brizy-social-title' ) );
		$I->seeInSource( md5( 'brizy-social-description' ) );
		$I->seeInSource( md5( 'brizy-social-thumbnail' ) );
		$I->seeInSource( md5( 'brizy-custom-css' ) );
		$I->seeInSource( md5( 'brizy-header-injection' ) );
		$I->seeInSource( md5( 'brizy-footer-injection' ) );
	}

	/**
	 * @param AcceptanceTester $I
	 */
	public function siteSettingsDataSubmitTest( AcceptanceTester $I ) {

		$formParams = [
			'title'       => 'brizy-"settings"-&title',
			'description' => 'brizy-"settings"-&description',
		];

		$I->amOnPage( '/wp-content/plugins/brizy/admin/site-settings.php' );
		$I->click( '#settingsDash > li:nth-of-type(1)' );

		$I->attachFile( 'input[name=favicon]', 'favico.jpg' );

		$I->submitForm( '#settings form', $formParams );

		$I->amOnPage( '/wp-content/plugins/brizy/admin/site-settings.php' );
		$I->click( '#settingsDash > li:nth-of-type(1)' );
		$I->seeInFormFields( '#settings form', $formParams );

		$I->seeOptionInDatabase( [
			'option_name'  => 'blogname',
			'option_value' => 'brizy-&quot;settings&quot;-&amp;title'
		] );
		$I->seeOptionInDatabase( [
			'option_name'  => 'blogdescription',
			'option_value' => 'brizy-&quot;settings&quot;-&amp;description'
		] );
		$I->seeOptionInDatabase( [
			'option_name' => 'brizy-settings-favicon',
		] );
	}


	/**
	 * @param AcceptanceTester $I
	 */
	public function socialSharingDataSubmitTest( AcceptanceTester $I ) {

		$formParams = [
			'title'       => 'brizy-social-title',
			'description' => 'brizy-social-description',
		];

		$I->amOnPage( '/wp-content/plugins/brizy/admin/site-settings.php' );
		$I->click( '#settingsDash > li:nth-of-type(2)' );
		$I->attachFile( 'input[name=thumbnail]', 'favico.jpg' );
		$I->submitForm( '#socialSharing form', $formParams );

		$I->amOnPage( '/wp-content/plugins/brizy/admin/site-settings.php' );
		$I->click( '#settingsDash > li:nth-of-type(2)' );
		$I->seeInFormFields( '#socialSharing form', $formParams );

		$I->seeOptionInDatabase( [
			'option_name'  => 'brizy-social-title',
			'option_value' => 'brizy-social-title'
		] );
		$I->seeOptionInDatabase( [
			'option_name'  => 'brizy-social-description',
			'option_value' => 'brizy-social-description'
		] );
		$I->seeOptionInDatabase( [
			'option_name' => 'brizy-social-thumbnail',
		] );
	}

	/**
	 * @param AcceptanceTester $I
	 */
	public function customCssDataSubmitTest( AcceptanceTester $I ) {

		$css        = '.custom-brizy-class { height:1px; width:2px; }';
		$formParams = [
			'custom_css' => $css,
		];

		$I->amOnPage( '/wp-content/plugins/brizy/admin/site-settings.php' );
		$I->click( '#settingsDash > li:nth-of-type(3)' );
		$I->executeJS('$("#customCSS textarea").show();');
		$I->submitForm( '#customCSS form', $formParams );

		$I->amOnPage( '/wp-content/plugins/brizy/admin/site-settings.php' );
		$I->click( '#settingsDash > li:nth-of-type(3)' );
		$I->executeJS('$("#customCSS textarea").show();');
		$I->seeInFormFields( '#customCSS form', $formParams );

		$I->seeOptionInDatabase( [
			'option_name'  => 'brizy-custom-css',
			'option_value' => $css
		] );
	}

	/**
	 * @param AcceptanceTester $I
	 */
	public function codeInjectDataSubmitTest( AcceptanceTester $I ) {

		$header = 'INJECTED CONTENT IN HEADER';
		$footer = 'INJECTED CONTENT IN FOOTER';

		$formParams = [
			'header_code' => $header,
			'footer_code' => $footer,
		];

		$I->amOnPage( '/wp-content/plugins/brizy/admin/site-settings.php' );
		$I->click( '#settingsDash > li:nth-of-type(4)' );
		$I->executeJS('$("#customCSS textarea").show();');

		$I->submitForm( '#codeInjection form', $formParams );
		$I->amOnPage( '/wp-content/plugins/brizy/admin/site-settings.php' );

		$I->click( '#settingsDash > li:nth-of-type(4)' );
		$I->executeJS('$("#customCSS textarea").show();');
		$I->seeInFormFields( '#codeInjection form', $formParams );

		$I->seeOptionInDatabase( [ 'option_name' => 'brizy-header-injection', 'option_value' => $header ] );
		$I->seeOptionInDatabase( [ 'option_name' => 'brizy-footer-injection', 'option_value' => $footer ] );
	}
}