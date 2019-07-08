<?php


class SiteSettingsCest {


	public function _before( FunctionalTester $I ) {
		$I->loginAsAdmin();
		$I->amOnPluginsPage();
		$I->activatePlugin( 'brizy' );
	}

	public function settingsPopupTest( AcceptanceTester $I ) {
		$I->amOnPage( '/wp-content/plugins/brizy/admin/site-settings.php' );
		$I->seeResponseCodeIs( 200 );
	}

	/**
	 * @param AcceptanceTester $I
	 */
	public function settingsPopupLayoutTest( AcceptanceTester $I ) {

		$I->amOnPage( '/wp-content/plugins/brizy/admin/site-settings.php' );
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
	public function siteSettingsDataSubmitTest( AcceptanceTester $I ) {

		$formParams = [
			'title'       => 'brizy-settings-title',
			'description' => 'brizy-settings-description',
		];

		$I->amOnPage( '/wp-content/plugins/brizy/admin/site-settings.php' );
		$I->click( '#settingsDash > li:nth-of-type(1)' );

		$I->submitForm( '#settings form', $formParams );

		$I->amOnPage( '/wp-content/plugins/brizy/admin/site-settings.php' );
		$I->seeInFormFields( '#settings form', $formParams );

		$I->canSeeInSource( 'brizy-settings-favicon-url' );

		$I->seeOptionInDatabase( [
			'option_name'  => 'blogdescription',
			'option_value' => 'brizy-settings-description'
		] );
		$I->seeOptionInDatabase( [ 'option_name' => 'blogname', 'option_value' => 'brizy-settings-title' ] );
		$I->seeOptionInDatabase( [
			'option_name'  => 'brizy-settings-favicon',
			'option_value' => 'brizy-settings-favicon-url'
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
		$I->submitForm( '#socialSharing form', $formParams );

		$I->amOnPage( '/wp-content/plugins/brizy/admin/site-settings.php' );
		$I->seeInFormFields( '#socialSharing form', $formParams );
		$I->canSeeInSource( 'brizy-social-thumbnail-url' );


		$I->seeOptionInDatabase( [ 'option_name' => 'brizy-social-title', 'option_value' => 'brizy-social-title' ] );
		$I->seeOptionInDatabase( [
			'option_name'  => 'brizy-social-description',
			'option_value' => 'brizy-social-description'
		] );
		$I->seeOptionInDatabase( [
			'option_name'  => 'brizy-social-thumbnail',
			'option_value' => 'brizy-social-thumbnail-url'
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
		$I->submitForm( '#customCSS form', $formParams );

		$I->amOnPage( '/wp-content/plugins/brizy/admin/site-settings.php' );
		$I->seeInFormFields( '#customCSS form', $formParams );

		$I->seeOptionInDatabase( [ 'option_name' => 'brizy-custom-css', 'option_value' => $css ] );
	}

	/**
	 * @param AcceptanceTester $I
	 */
	public function codeInjectDataSubmitTest( AcceptanceTester $I ) {

		$header = 'INJECTED CONTENT IN HEADER';
		$footer = 'INJECTED CONTENT IN FOOTER';

		$I->amOnPage( '/wp-content/plugins/brizy/admin/site-settings.php' );

		$I->click( '#settingsDash > li:nth-of-type(4)' );

		$formParams = [
			'header_code' => $header,
			'footer_code' => $footer,
		];
		$I->submitForm( '#codeInjection form', $formParams );
		$I->amOnPage( '/wp-content/plugins/brizy/admin/site-settings.php' );
		$I->seeInFormFields( '#codeInjection form', $formParams );

		$I->seeOptionInDatabase( [ 'option_name' => 'brizy-header-injection', 'option_value' => $header ] );
		$I->seeOptionInDatabase( [ 'option_name' => 'brizy-footer-injection', 'option_value' => $footer ] );

	}
}