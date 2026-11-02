<?php

/**
 * Test double for the banner: counts the enable and disable calls and reports the
 * configured result (failure by default).
 */
class CookieBannerSettingFailureSpy extends Brizy_Admin_Blocks_CookieBanner {

	/**
	 * @var int
	 */
	public $enableCalls = 0;

	/**
	 * @var int
	 */
	public $disableCalls = 0;

	/**
	 * @var bool
	 */
	public $result = false;

	public function enable(): bool {
		$this->enableCalls ++;

		return $this->result;
	}

	public function disable(): bool {
		$this->disableCalls ++;

		return $this->result;
	}
}

/**
 * Thrown from the wp_redirect filter, so a test leaves action_validate_form_submit() before its exit.
 */
class CookieBannerSettingFailureRedirect extends Exception {
}

/**
 * Cookie banner setting R4 (and the "unless R4 applies" branch of R2 AC4/AC5): when banner
 * enable or disable fails, `cookie-banner-enabled` keeps its previous value and an error notice
 * replaces `Settings saved.`, while the other General options are still saved.
 */
class CookieBannerSettingFailureCest {

	/**
	 * @var mixed
	 */
	private $storageBackup;

	/**
	 * @var array
	 */
	private $postBackup;

	/**
	 * @var array
	 */
	private $requestBackup;

	/**
	 * @var array
	 */
	private $screenGlobalsBackup = array();

	/**
	 * @var string|null
	 */
	private $screenNameBackup;

	/**
	 * @var CookieBannerSettingFailureSpy
	 */
	private $spy;

	public function _before( FunctionalTester $I ) {
		if ( ! function_exists( 'menu_page_url' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}
		if ( ! class_exists( 'WP_Screen' ) ) {
			require_once ABSPATH . 'wp-admin/includes/class-wp-screen.php';
		}
		if ( ! function_exists( 'set_current_screen' ) ) {
			require_once ABSPATH . 'wp-admin/includes/screen.php';
		}

		wp_cache_flush();
		wp_set_current_user( 1 );
		$this->storageBackup = get_option( Brizy_Editor_Storage_Common::KEY, array() );
		$this->postBackup    = $_POST;
		$this->requestBackup = $_REQUEST;
		$_POST               = array();
		$_REQUEST            = array();
		foreach ( array( 'current_screen', 'typenow', 'taxnow' ) as $global ) {
			$this->screenGlobalsBackup[ $global ] = isset( $GLOBALS[ $global ] ) ? $GLOBALS[ $global ] : null;
		}
		$this->screenNameBackup = $this->screenName()->getValue( Brizy_Admin_Settings::_init() );

		$storage = Brizy_Editor_Storage_Common::instance();
		$storage->set( 'post-types', array( 'post', 'page' ) );
		$storage->set( 'svg-upload', false );
		$storage->set( 'json-upload', false );
		$storage->set( 'getting-started-video-enabled', false );
		$storage->delete( 'cookie-banner-enabled' );
		$this->resetFlash();

		$this->spy = new CookieBannerSettingFailureSpy();
		Brizy_Admin_Settings::_init()->setCookieBanner( $this->spy );
	}

	public function _after( FunctionalTester $I ) {
		Brizy_Admin_Settings::_init()->setCookieBanner( new Brizy_Admin_Blocks_CookieBanner() );
		$this->screenName()->setValue( Brizy_Admin_Settings::_init(), $this->screenNameBackup );
		foreach ( $this->screenGlobalsBackup as $global => $value ) {
			$GLOBALS[ $global ] = $value;
		}
		$_POST    = $this->postBackup;
		$_REQUEST = $this->requestBackup;
		update_option( Brizy_Editor_Storage_Common::KEY, $this->storageBackup );
		$this->resetFlash();
		wp_cache_flush();
	}

	/**
	 * @return ReflectionProperty
	 */
	private function screenName() {
		$property = new ReflectionProperty( 'Brizy_Admin_Settings', 'screenName' );
		$property->setAccessible( true );

		return $property;
	}

	/**
	 * Flash notices are kept in memory and stored in a transient on shutdown: clear both.
	 */
	private function resetFlash() {
		$notices = new ReflectionProperty( 'Brizy_Admin_Flash', 'notices' );
		$notices->setAccessible( true );
		$notices->setValue( Brizy_Admin_Flash::instance(), array() );
		delete_transient( Brizy_Admin_Flash::BRIZY_NOTICE_TRANSIENT_KEY );
	}

	/**
	 * @param bool|null $value null removes the key
	 */
	private function havePreviousValue( $value ) {
		if ( $value === null ) {
			Brizy_Editor_Storage_Common::instance()->delete( 'cookie-banner-enabled' );
		} else {
			Brizy_Editor_Storage_Common::instance()->set( 'cookie-banner-enabled', $value );
		}
		wp_cache_flush();
	}

	/**
	 * @param array $fields
	 */
	private function submitGeneral( array $fields ) {
		$_POST = array_merge( array( 'tab' => 'general', 'post-types' => array( 'post', 'page' ) ), $fields );
		Brizy_Admin_Settings::_init()->general_settings_submit();
		$_POST = array();
		wp_cache_flush();
	}

	/**
	 * Submits the General form through the real entry point: the current_screen handler
	 * action_validate_form_submit(), with a valid nonce, on the settings screen.
	 *
	 * @param array $fields
	 *
	 * @return string|null the redirect location, null when there was no redirect
	 */
	private function submitGeneralForm( array $fields ) {
		$screen = 'toplevel_page_' . Brizy_Admin_Settings::menu_slug();
		$this->screenName()->setValue( Brizy_Admin_Settings::_init(), $screen );
		$_POST = array();
		set_current_screen( $screen );

		$_POST    = array_merge( array(
			'tab'        => 'general',
			'post-types' => array( 'post', 'page' ),
			'_wpnonce'   => wp_create_nonce(),
		), $fields );
		$_REQUEST = $_POST;

		$redirect = function ( $location ) {
			throw new CookieBannerSettingFailureRedirect( $location );
		};
		add_filter( 'wp_redirect', $redirect );
		$location = null;
		try {
			Brizy_Admin_Settings::_init()->action_validate_form_submit();
		} catch ( CookieBannerSettingFailureRedirect $e ) {
			$location = $e->getMessage();
		}
		remove_filter( 'wp_redirect', $redirect );

		$_POST    = array();
		$_REQUEST = array();
		wp_cache_flush();

		return $location;
	}

	/**
	 * @return bool|null
	 */
	private function storedValue() {
		return Brizy_Editor_Storage_Common::instance()->get( 'cookie-banner-enabled', false );
	}

	/**
	 * @return bool
	 */
	private function hasBannerError() {
		return Brizy_Admin_Flash::instance()->has( md5( __( 'Unable to update the cookie banner. Please try again.', 'brizy' ) ) );
	}

	/**
	 * @return bool
	 */
	private function hasSettingsSaved() {
		return Brizy_Admin_Flash::instance()->has( md5( 'Settings saved.' ) );
	}

	public function failedEnableKeepsPreviousValue( FunctionalTester $I ) {
		$I->wantToTest( 'A failed enable keeps the previous value (unset or false) instead of storing true' );

		$this->havePreviousValue( null );
		$this->submitGeneral( array( 'cookie-banner-enabled' => '1' ) );
		$I->assertSame( 1, $this->spy->enableCalls, 'enable should be called' );
		$I->assertNull( $this->storedValue(), 'The value should stay unset' );
		$I->assertFalse( Brizy_Admin_Blocks_CookieBanner::isCookieBannerEnabled(), 'The reader should still return false' );

		$this->havePreviousValue( false );
		$this->submitGeneral( array( 'cookie-banner-enabled' => '1' ) );
		$I->assertSame( 2, $this->spy->enableCalls, 'enable should be called' );
		$I->assertTrue( $this->storedValue() === false, 'The value should stay false' );
	}

	public function failedDisableKeepsPreviousValue( FunctionalTester $I ) {
		$I->wantToTest( 'A failed disable keeps true instead of storing false' );

		$this->havePreviousValue( true );
		$this->submitGeneral( array() );

		$I->assertSame( 1, $this->spy->disableCalls, 'disable should be called' );
		$I->assertTrue( $this->storedValue() === true, 'The value should stay true' );
	}

	public function failureShowsErrorNotice( FunctionalTester $I ) {
		$I->wantToTest( 'A failed enable or disable queues an error notice' );

		$this->havePreviousValue( false );
		$this->submitGeneral( array( 'cookie-banner-enabled' => '1' ) );
		$I->assertTrue( Brizy_Admin_Flash::instance()->has_notice_type( Brizy_Admin_Flash::ERROR ), 'An error notice should be queued after a failed enable' );
		$I->assertTrue( $this->hasBannerError(), 'The error notice should be the cookie banner message' );

		$this->resetFlash();
		$this->havePreviousValue( true );
		$this->submitGeneral( array() );
		$I->assertTrue( Brizy_Admin_Flash::instance()->has_notice_type( Brizy_Admin_Flash::ERROR ), 'An error notice should be queued after a failed disable' );
		$I->assertTrue( $this->hasBannerError(), 'The error notice should be the cookie banner message' );
	}

	public function failureSkipsSettingsSavedNotice( FunctionalTester $I ) {
		$I->wantToTest( 'A failed enable or disable shows no Settings saved. notice' );

		$this->havePreviousValue( false );
		$location = $this->submitGeneralForm( array( 'cookie-banner-enabled' => '1' ) );
		$I->assertNotNull( $location, 'The save should redirect back to the settings page' );
		$I->assertSame( 1, $this->spy->enableCalls, 'enable should be called' );
		$I->assertTrue( $this->hasBannerError(), 'The error notice should be queued' );
		$I->assertFalse( $this->hasSettingsSaved(), 'Settings saved. should not be queued after a failed enable' );

		$this->resetFlash();
		$this->havePreviousValue( true );
		$this->submitGeneralForm( array() );
		$I->assertSame( 1, $this->spy->disableCalls, 'disable should be called' );
		$I->assertTrue( $this->hasBannerError(), 'The error notice should be queued' );
		$I->assertFalse( $this->hasSettingsSaved(), 'Settings saved. should not be queued after a failed disable' );

		// control: the same save with a successful banner shows the success notice
		$this->resetFlash();
		$this->spy->result = true;
		$this->havePreviousValue( false );
		$this->submitGeneralForm( array( 'cookie-banner-enabled' => '1' ) );
		$I->assertTrue( $this->hasSettingsSaved(), 'Settings saved. should be queued after a successful save' );
		$I->assertFalse( Brizy_Admin_Flash::instance()->has_notice_type( Brizy_Admin_Flash::ERROR ), 'No error notice should be queued after a successful save' );
	}

	public function otherOptionsSavedWhenBannerFails( FunctionalTester $I ) {
		$I->wantToTest( 'Post types, SVG uploads, JSON uploads and the Getting Started video are saved although the banner fails' );

		$storage = Brizy_Editor_Storage_Common::instance();
		// a failing enable (false to checked), then a failing disable (true to unchecked)
		foreach ( array( array( false, array( 'cookie-banner-enabled' => '1' ) ), array( true, array() ) ) as $case ) {
			list( $previous, $checkbox ) = $case;
			$this->havePreviousValue( $previous );
			$storage->set( 'post-types', array( 'post', 'page' ) );
			$storage->set( 'svg-upload', false );
			$storage->set( 'json-upload', false );
			$storage->set( 'getting-started-video-enabled', false );

			$this->submitGeneralForm( array_merge( $checkbox, array(
				'post-types'                    => array( 'page' ),
				'svg-upload-enabled'            => '1',
				'json-upload-enabled'           => '1',
				'getting-started-video-enabled' => '1',
			) ) );

			$I->assertTrue( $this->hasBannerError(), 'The banner should have failed' );
			$I->assertTrue( $this->storedValue() === $previous, 'The banner value should keep its previous value' );
			$I->assertEquals( array( 'page' ), $storage->get( 'post-types' ), 'The post types should be saved' );
			$I->assertTrue( $storage->get( 'svg-upload' ) === true, 'svg-upload should be saved' );
			$I->assertTrue( $storage->get( 'json-upload' ) === true, 'json-upload should be saved' );
			$I->assertTrue( $storage->get( 'getting-started-video-enabled' ) === true, 'getting-started-video-enabled should be saved' );
			$this->resetFlash();
		}

		$I->assertSame( 1, $this->spy->enableCalls, 'enable should be called once' );
		$I->assertSame( 1, $this->spy->disableCalls, 'disable should be called once' );
	}

	public function invalidPostTypeStillCallsBanner( FunctionalTester $I ) {
		$I->wantToTest( 'A post-type validation error does not stop the banner call when the checkbox changes' );

		$this->spy->result = true;
		$this->havePreviousValue( false );
		$this->submitGeneral( array( 'post-types' => array( 'post', 'not-a-real-post-type' ), 'cookie-banner-enabled' => '1' ) );
		$I->assertSame( 1, $this->spy->enableCalls, 'enable should be called once' );
		$I->assertTrue( $this->storedValue() === true, 'The new value should be stored' );
		$I->assertEquals( array( 'post', 'page' ), Brizy_Editor_Storage_Common::instance()->get( 'post-types' ), 'Invalid post types should not be stored' );

		$this->submitGeneral( array( 'post-types' => array( 'post', 'not-a-real-post-type' ) ) );
		$I->assertSame( 1, $this->spy->disableCalls, 'disable should be called once' );
		$I->assertTrue( $this->storedValue() === false, 'The new value should be stored' );

		$this->spy->result = false;
		$this->submitGeneral( array( 'post-types' => array( 'post', 'not-a-real-post-type' ), 'cookie-banner-enabled' => '1' ) );
		$I->assertSame( 2, $this->spy->enableCalls, 'enable should be called once more' );
		$I->assertTrue( $this->storedValue() === false, 'The failed enable should keep false' );
		$I->assertTrue( $this->hasBannerError(), 'The banner error should be queued next to the post-type error' );
	}

	public function checkedSaveAfterFailedEnableRetries( FunctionalTester $I ) {
		$I->wantToTest( 'After a failed enable, saving the checkbox checked again calls enable again' );

		$this->havePreviousValue( false );
		$this->submitGeneral( array( 'cookie-banner-enabled' => '1' ) );
		$this->submitGeneral( array( 'cookie-banner-enabled' => '1' ) );
		$I->assertSame( 2, $this->spy->enableCalls, 'enable should be called on each checked save' );

		$this->spy->result = true;
		$this->submitGeneral( array( 'cookie-banner-enabled' => '1' ) );
		$I->assertSame( 3, $this->spy->enableCalls, 'enable should be called again' );
		$I->assertTrue( $this->storedValue() === true, 'The successful retry should store true' );

		$this->submitGeneral( array( 'cookie-banner-enabled' => '1' ) );
		$I->assertSame( 3, $this->spy->enableCalls, 'enable should not be called once true is stored' );
		$I->assertSame( 0, $this->spy->disableCalls, 'disable should not be called' );
	}

	public function uncheckedSaveAfterFailedDisableRetries( FunctionalTester $I ) {
		$I->wantToTest( 'After a failed disable, saving the checkbox unchecked again calls disable again' );

		$this->havePreviousValue( true );
		$this->submitGeneral( array() );
		$this->submitGeneral( array() );
		$I->assertSame( 2, $this->spy->disableCalls, 'disable should be called on each unchecked save' );

		$this->spy->result = true;
		$this->submitGeneral( array() );
		$I->assertSame( 3, $this->spy->disableCalls, 'disable should be called again' );
		$I->assertTrue( $this->storedValue() === false, 'The successful retry should store false' );

		$this->submitGeneral( array() );
		$I->assertSame( 3, $this->spy->disableCalls, 'disable should not be called once false is stored' );
		$I->assertSame( 0, $this->spy->enableCalls, 'enable should not be called' );
	}
}
