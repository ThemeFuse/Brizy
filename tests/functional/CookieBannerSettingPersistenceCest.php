<?php

/**
 * Test double for the banner: these tests cover storage only, so enable and disable
 * succeed without creating or changing a banner block.
 */
class CookieBannerSettingPersistenceStub extends Brizy_Admin_Blocks_CookieBanner {

	public function enable(): bool {
		return true;
	}

	public function disable(): bool {
		return true;
	}
}

/**
 * Cookie banner setting R2: the "Enable Cookie Banner" option is stored as a boolean
 * under `cookie-banner-enabled` in the common storage used by the other General options.
 */
class CookieBannerSettingPersistenceCest {

	/**
	 * @var mixed
	 */
	private $storageBackup;

	/**
	 * @var array
	 */
	private $postBackup;

	public function _before( FunctionalTester $I ) {
		wp_cache_flush();
		$this->storageBackup = get_option( Brizy_Editor_Storage_Common::KEY, array() );
		$this->postBackup    = $_POST;
		Brizy_Editor_Storage_Common::instance()->delete( 'cookie-banner-enabled' );
		$this->resetFlash();
		Brizy_Admin_Settings::_init()->setCookieBanner( new CookieBannerSettingPersistenceStub() );
	}

	public function _after( FunctionalTester $I ) {
		Brizy_Admin_Settings::_init()->setCookieBanner( new Brizy_Admin_Blocks_CookieBanner() );
		$_POST = $this->postBackup;
		update_option( Brizy_Editor_Storage_Common::KEY, $this->storageBackup );
		$this->resetFlash();
		wp_cache_flush();
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
	 * @param array $fields
	 */
	private function submitGeneral( array $fields ) {
		$_POST = array_merge( array( 'tab' => 'general', 'post-types' => array( 'post', 'page' ) ), $fields );
		Brizy_Admin_Settings::_init()->general_settings_submit();
		$_POST = array();
		wp_cache_flush();
	}

	public function neverSetReadsFalse( FunctionalTester $I ) {
		$I->wantToTest( 'An unset cookie-banner-enabled reads as false' );

		$I->assertNull( Brizy_Editor_Storage_Common::instance()->get( 'cookie-banner-enabled', false ), 'The key should not be in storage' );
		$I->assertFalse( Brizy_Admin_Blocks_CookieBanner::isCookieBannerEnabled(), 'The reader should return false when the key was never set' );
	}

	public function checkedStoresTrue( FunctionalTester $I ) {
		$I->wantToTest( 'Submitting the General form with the checkbox checked stores true' );

		$this->submitGeneral( array( 'cookie-banner-enabled' => '1' ) );

		$storage = Brizy_Editor_Storage_Common::instance()->get_storage();
		$I->assertArrayHasKey( 'cookie-banner-enabled', $storage, 'The value should be stored under cookie-banner-enabled' );
		$I->assertTrue( $storage['cookie-banner-enabled'] === true, 'The stored value should be boolean true' );
		$I->assertTrue( Brizy_Admin_Blocks_CookieBanner::isCookieBannerEnabled(), 'The reader should return true' );
	}

	public function absentStoresFalse( FunctionalTester $I ) {
		$I->wantToTest( 'Submitting the General form without the checkbox stores false' );

		$this->submitGeneral( array( 'cookie-banner-enabled' => '1' ) );
		$this->submitGeneral( array() );

		$value = Brizy_Editor_Storage_Common::instance()->get( 'cookie-banner-enabled' );
		$I->assertTrue( $value === false, 'The stored value should be boolean false' );
		$I->assertFalse( Brizy_Admin_Blocks_CookieBanner::isCookieBannerEnabled(), 'The reader should return false' );
	}

	public function storedValueIsBoolean( FunctionalTester $I ) {
		$I->wantToTest( 'The stored value is a boolean, never a string or a number' );

		$this->submitGeneral( array( 'cookie-banner-enabled' => '1' ) );
		$I->assertTrue( is_bool( Brizy_Editor_Storage_Common::instance()->get( 'cookie-banner-enabled' ) ), 'Checked should store a boolean' );

		$this->submitGeneral( array() );
		$I->assertTrue( is_bool( Brizy_Editor_Storage_Common::instance()->get( 'cookie-banner-enabled' ) ), 'Unchecked should store a boolean' );
	}

	public function storedInSameStoreAsOtherGeneralOptions( FunctionalTester $I ) {
		$I->wantToTest( 'cookie-banner-enabled lives in the same common storage as the other General options' );

		$this->submitGeneral( array( 'svg-upload-enabled' => '1', 'cookie-banner-enabled' => '1' ) );

		$option = get_option( Brizy_Editor_Storage_Common::KEY );
		$I->assertTrue( is_array( $option ), 'The common storage option should be an array' );
		foreach ( array( 'cookie-banner-enabled', 'svg-upload', 'json-upload', 'getting-started-video-enabled', 'post-types' ) as $key ) {
			$I->assertArrayHasKey( $key, $option, "The common storage should contain {$key}" );
		}
		$I->assertTrue( $option['cookie-banner-enabled'] === true, 'The value in the common storage option should be true' );
		$I->assertTrue(
			Brizy_Editor_Storage_Common::instance()->get( 'svg-upload' ) === true && Brizy_Editor_Storage_Common::instance()->get( 'cookie-banner-enabled' ) === true,
			'Both values should be readable from the same Brizy_Editor_Storage_Common instance'
		);
	}

	public function storedEvenWhenPostTypesAreInvalid( FunctionalTester $I ) {
		$I->wantToTest( 'A post-type validation error does not stop cookie-banner-enabled from being stored' );

		Brizy_Editor_Storage_Common::instance()->set( 'post-types', array( 'post', 'page' ) );
		$this->submitGeneral( array( 'post-types' => array( 'post', 'not-a-real-post-type' ), 'cookie-banner-enabled' => '1' ) );

		$I->assertTrue( Brizy_Editor_Storage_Common::instance()->get( 'cookie-banner-enabled' ) === true, 'The cookie banner value should be stored' );
		$I->assertEquals( array( 'post', 'page' ), Brizy_Editor_Storage_Common::instance()->get( 'post-types' ), 'Invalid post types should not be stored' );
	}

	public function existingGeneralOptionsStillSaved( FunctionalTester $I ) {
		$I->wantToTest( 'The other General options still save as before' );

		$this->submitGeneral( array(
			'post-types'                    => array( 'page' ),
			'svg-upload-enabled'            => '1',
			'json-upload-enabled'           => '1',
			'getting-started-video-enabled' => '1',
			'cookie-banner-enabled'         => '1',
		) );
		$storage = Brizy_Editor_Storage_Common::instance();
		$I->assertTrue( $storage->get( 'svg-upload' ) === true, 'svg-upload should be true' );
		$I->assertTrue( $storage->get( 'json-upload' ) === true, 'json-upload should be true' );
		$I->assertTrue( $storage->get( 'getting-started-video-enabled' ) === true, 'getting-started-video-enabled should be true' );
		$I->assertEquals( array( 'page' ), $storage->get( 'post-types' ), 'post-types should be saved' );

		$this->submitGeneral( array() );
		$I->assertTrue( $storage->get( 'svg-upload' ) === false, 'svg-upload should be false' );
		$I->assertTrue( $storage->get( 'json-upload' ) === false, 'json-upload should be false' );
		$I->assertTrue( $storage->get( 'getting-started-video-enabled' ) === false, 'getting-started-video-enabled should be false' );
		$I->assertEquals( array( 'post', 'page' ), $storage->get( 'post-types' ), 'post-types should be saved' );
	}
}
