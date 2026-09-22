<?php

/**
 * Cookie banner setting R1: the General tab renders an "Enable Cookie Banner" checkbox
 * in the General form, checked only when the stored value is true.
 */
class CookieBannerSettingFieldCest {

	/**
	 * @var mixed
	 */
	private $storageBackup;

	public function _before( FunctionalTester $I ) {
		wp_cache_flush();
		$this->storageBackup = get_option( Brizy_Editor_Storage_Common::KEY, array() );
	}

	public function _after( FunctionalTester $I ) {
		update_option( Brizy_Editor_Storage_Common::KEY, $this->storageBackup );
		wp_cache_flush();
	}

	/**
	 * @param bool|null $value null means never stored
	 *
	 * @return DOMXPath
	 */
	private function renderGeneralTab( $value ) {
		if ( $value === null ) {
			Brizy_Editor_Storage_Common::instance()->delete( 'cookie-banner-enabled' );
		} else {
			Brizy_Editor_Storage_Common::instance()->set( 'cookie-banner-enabled', $value );
		}
		wp_cache_flush();

		$method = new ReflectionMethod( 'Brizy_Admin_Settings', 'get_general_tab' );
		$method->setAccessible( true );
		$html = $method->invoke( Brizy_Admin_Settings::_init() );

		$dom      = new DOMDocument();
		$previous = libxml_use_internal_errors( true );
		$dom->loadHTML( '<?xml encoding="utf-8"?>' . $html );
		libxml_clear_errors();
		libxml_use_internal_errors( $previous );

		return new DOMXPath( $dom );
	}

	/**
	 * @param FunctionalTester $I
	 * @param DOMXPath $xpath
	 *
	 * @return DOMElement
	 */
	private function getCheckbox( FunctionalTester $I, DOMXPath $xpath ) {
		$inputs = $xpath->query( '//input[@name="cookie-banner-enabled"]' );
		$I->assertEquals( 1, $inputs->length, 'The General tab should contain exactly one cookie-banner-enabled input' );

		return $inputs->item( 0 );
	}

	public function checkboxIsRenderedAndLabelled( FunctionalTester $I ) {
		$I->wantToTest( 'The General tab contains a checkbox labelled Enable Cookie Banner' );

		$xpath    = $this->renderGeneralTab( null );
		$checkbox = $this->getCheckbox( $I, $xpath );

		$I->assertEquals( 'checkbox', $checkbox->getAttribute( 'type' ), 'The input should be a checkbox' );
		$I->assertEquals( 'cookie-banner-enabled', $checkbox->getAttribute( 'id' ), 'The checkbox id should be cookie-banner-enabled' );
		$I->assertEquals( '1', $checkbox->getAttribute( 'value' ), 'The checkbox value should be 1' );

		$th = $xpath->query( 'ancestor::tr[1]/th', $checkbox );
		$I->assertEquals( 1, $th->length, 'The checkbox row should have a header cell' );
		$I->assertEquals( 'Enable Cookie Banner', trim( preg_replace( '/\s+/', ' ', $th->item( 0 )->textContent ) ), 'The checkbox row should be labelled Enable Cookie Banner' );
	}

	public function checkboxIsInTheGeneralForm( FunctionalTester $I ) {
		$I->wantToTest( 'The checkbox is in the same form as the other General options and uses the same submit button' );

		$xpath    = $this->renderGeneralTab( null );
		$checkbox = $this->getCheckbox( $I, $xpath );

		$form = $xpath->query( 'ancestor::form[1]', $checkbox );
		$I->assertEquals( 1, $form->length, 'The checkbox should be inside a form' );
		$I->assertEquals( 1, $xpath->query( '//form' )->length, 'The General tab should render a single form' );

		$tab = $xpath->query( '//input[@name="tab"][@value="general"]' );
		$I->assertEquals( 1, $tab->length, 'The General form should contain the tab=general input' );
		$I->assertTrue( $xpath->query( 'ancestor::form[1]', $tab->item( 0 ) )->item( 0 )->isSameNode( $form->item( 0 ) ), 'tab=general should be in the same form' );

		$submit = $xpath->query( '//button[@name="brizy-general-submit"]' );
		$I->assertEquals( 1, $submit->length, 'The General form should contain the brizy-general-submit button' );
		$I->assertTrue( $xpath->query( 'ancestor::form[1]', $submit->item( 0 ) )->item( 0 )->isSameNode( $form->item( 0 ) ), 'The submit button should be in the same form' );

		$svg = $xpath->query( '//input[@name="svg-upload-enabled"]' );
		$I->assertEquals( 1, $svg->length, 'The General form should still contain the SVG uploads checkbox' );
		$I->assertTrue( $xpath->query( 'ancestor::form[1]', $svg->item( 0 ) )->item( 0 )->isSameNode( $form->item( 0 ) ), 'The SVG uploads checkbox should be in the same form' );
	}

	public function checkedWhenStoredTrue( FunctionalTester $I ) {
		$I->wantToTest( 'The checkbox is checked when the stored value is true' );

		$checkbox = $this->getCheckbox( $I, $this->renderGeneralTab( true ) );
		$I->assertTrue( $checkbox->hasAttribute( 'checked' ), 'The checkbox should be checked' );
	}

	public function uncheckedWhenStoredFalse( FunctionalTester $I ) {
		$I->wantToTest( 'The checkbox is unchecked when the stored value is false' );

		$checkbox = $this->getCheckbox( $I, $this->renderGeneralTab( false ) );
		$I->assertFalse( $checkbox->hasAttribute( 'checked' ), 'The checkbox should not be checked' );
	}

	public function uncheckedWhenNeverStored( FunctionalTester $I ) {
		$I->wantToTest( 'The checkbox is unchecked when no value was ever stored' );

		$checkbox = $this->getCheckbox( $I, $this->renderGeneralTab( null ) );
		$I->assertFalse( $checkbox->hasAttribute( 'checked' ), 'The checkbox should not be checked' );
	}
}
