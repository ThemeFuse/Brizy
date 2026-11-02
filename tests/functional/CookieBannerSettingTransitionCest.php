<?php

/**
 * Test double for the banner: counts the enable and disable calls and reports success.
 */
class CookieBannerSettingTransitionSpy extends Brizy_Admin_Blocks_CookieBanner {

	/**
	 * @var int
	 */
	public $enableCalls = 0;

	/**
	 * @var int
	 */
	public $disableCalls = 0;

	public function enable(): bool {
		$this->enableCalls ++;

		return true;
	}

	public function disable(): bool {
		$this->disableCalls ++;

		return true;
	}
}

/**
 * Cookie banner setting R3: a General save calls banner enable or disable only when
 * the stored `cookie-banner-enabled` value actually changes.
 */
class CookieBannerSettingTransitionCest {

	/**
	 * @var mixed
	 */
	private $storageBackup;

	/**
	 * @var array
	 */
	private $postBackup;

	/**
	 * @var CookieBannerSettingTransitionSpy
	 */
	private $spy;

	public function _before( FunctionalTester $I ) {
		wp_cache_flush();
		wp_set_current_user( 1 );
		$this->storageBackup = get_option( Brizy_Editor_Storage_Common::KEY, array() );
		$this->postBackup    = $_POST;
		$_POST               = array();
		Brizy_Editor_Storage_Common::instance()->set( 'post-types', array( 'post', 'page' ) );
		Brizy_Editor_Storage_Common::instance()->delete( 'cookie-banner-enabled' );
		$this->resetFlash();

		$this->spy = new CookieBannerSettingTransitionSpy();
		Brizy_Admin_Settings::_init()->setCookieBanner( $this->spy );
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
	 * @param bool $checked
	 */
	private function submitGeneral( $checked ) {
		$_POST = array( 'tab' => 'general', 'post-types' => array( 'post', 'page' ) );
		if ( $checked ) {
			$_POST['cookie-banner-enabled'] = '1';
		}
		Brizy_Admin_Settings::_init()->general_settings_submit();
		$_POST = array();
		$this->resetCaches();
	}

	private function resetCaches() {
		wp_cache_flush();
		Brizy_Editor_Block::cleanClassCache();
		Brizy_Editor_Post::cleanClassCache();
	}

	/**
	 * @return bool|null
	 */
	private function storedValue() {
		return Brizy_Editor_Storage_Common::instance()->get( 'cookie-banner-enabled', false );
	}

	/**
	 * Banner block ids in any status, trash included.
	 *
	 * @return int[]
	 */
	private function bannerIds() {
		global $wpdb;

		return array_map( 'intval', $wpdb->get_col( $wpdb->prepare(
			"SELECT p.ID FROM {$wpdb->posts} p INNER JOIN {$wpdb->postmeta} m ON m.post_id = p.ID AND m.meta_key = 'brizy_post_uid' WHERE m.meta_value = %s AND p.post_type = %s ORDER BY p.ID",
			( new Brizy_Admin_Blocks_CookieBanner() )->getUid(),
			Brizy_Admin_Blocks_Main::CP_GLOBAL
		) ) );
	}

	private function deleteBanners() {
		foreach ( $this->bannerIds() as $id ) {
			wp_delete_post( $id, true );
		}
		$this->resetCaches();
	}

	/**
	 * A banner block as a user leaves it after editing: custom title, editor data, meta,
	 * position and rules.
	 *
	 * @return int
	 */
	private function haveCustomizedBanner() {
		$id    = wp_insert_post( array(
			'post_type'   => Brizy_Admin_Blocks_Main::CP_GLOBAL,
			'post_status' => 'publish',
			'post_title'  => 'My banner',
			'meta_input'  => array( 'brizy_post_uid' => ( new Brizy_Admin_Blocks_CookieBanner() )->getUid() ),
		) );
		$block = Brizy_Editor_Block::get( $id );
		$block->setEditorData( '{"type":"CookieBanner","blockId":"CookieBanner","value":{"_id":"custom-banner","items":[]}}' );
		$block->setMeta( '{"type":"overlay","subtype":"cookieBanner","extraFontStyles":[],"custom":"yes"}' );
		$block->setPosition( Brizy_Editor_BlockPosition::createFromSerializedData( array( 'align' => 'top', 'top' => 10, 'bottom' => 20 ) ) );
		$block->setDependencies( array() );
		$block->save();

		$page = wp_insert_post( array( 'post_type' => 'page', 'post_status' => 'publish', 'post_title' => 'Cookie banner page' ) );
		( new Brizy_Admin_Rules_Manager() )->setRules( $id, array(
			new Brizy_Admin_Rule( null, Brizy_Admin_Rule::TYPE_INCLUDE, Brizy_Admin_Rule::POSTS, 'page', array( $page ) ),
		) );
		$this->resetCaches();

		return $id;
	}

	/**
	 * @param int $id
	 *
	 * @return array
	 */
	private function bannerSnapshot( $id ) {
		global $wpdb;
		$this->resetCaches();
		$snapshot = $wpdb->get_row( $wpdb->prepare( "SELECT post_status, post_title, post_modified FROM {$wpdb->posts} WHERE ID = %d", $id ), ARRAY_A );
		foreach ( array( 'brizy', 'brizy-meta', 'brizy-position', 'brizy-rules' ) as $key ) {
			$snapshot[ $key ] = $wpdb->get_var( $wpdb->prepare( "SELECT meta_value FROM {$wpdb->postmeta} WHERE post_id = %d AND meta_key = %s", $id, $key ) );
		}
		$snapshot['editor-data'] = Brizy_Editor_Block::get( $id )->getEditorData( true );

		return $snapshot;
	}

	/**
	 * @param int $id
	 * @param int $type
	 *
	 * @return bool
	 */
	private function hasMatchAllRule( $id, $type ) {
		$this->resetCaches();
		$rules = ( new Brizy_Admin_Rules_Manager() )->getRules( $id );

		return count( $rules ) === 1 && $rules[0]->getType() === $type && $rules[0]->getAppliedFor() === null && $rules[0]->getEntityValues() === array();
	}

	public function enableCalledOnceWhenUnsetBecomesTrue( FunctionalTester $I ) {
		$I->wantToTest( 'An unset value saved as checked calls enable exactly once' );

		$this->havePreviousValue( null );
		$this->submitGeneral( true );

		$I->assertSame( 1, $this->spy->enableCalls, 'enable should be called once' );
		$I->assertSame( 0, $this->spy->disableCalls, 'disable should not be called' );
		$I->assertTrue( $this->storedValue() === true, 'The new value should be stored' );
	}

	public function enableCalledOnceWhenFalseBecomesTrue( FunctionalTester $I ) {
		$I->wantToTest( 'A false value saved as checked calls enable exactly once' );

		$this->havePreviousValue( false );
		$this->submitGeneral( true );

		$I->assertSame( 1, $this->spy->enableCalls, 'enable should be called once' );
		$I->assertSame( 0, $this->spy->disableCalls, 'disable should not be called' );
		$I->assertTrue( $this->storedValue() === true, 'The new value should be stored' );
	}

	public function disableCalledOnceWhenTrueBecomesFalse( FunctionalTester $I ) {
		$I->wantToTest( 'A true value saved as unchecked calls disable exactly once' );

		$this->havePreviousValue( true );
		$this->submitGeneral( false );

		$I->assertSame( 0, $this->spy->enableCalls, 'enable should not be called' );
		$I->assertSame( 1, $this->spy->disableCalls, 'disable should be called once' );
		$I->assertTrue( $this->storedValue() === false, 'The new value should be stored' );
	}

	public function nothingCalledWhenTrueStaysTrue( FunctionalTester $I ) {
		$I->wantToTest( 'A true value saved as checked calls neither enable nor disable' );

		$this->havePreviousValue( true );
		$this->submitGeneral( true );

		$I->assertSame( 0, $this->spy->enableCalls, 'enable should not be called' );
		$I->assertSame( 0, $this->spy->disableCalls, 'disable should not be called' );
		$I->assertTrue( $this->storedValue() === true, 'The value should stay true' );
	}

	public function nothingCalledWhenFalseOrUnsetStaysFalse( FunctionalTester $I ) {
		$I->wantToTest( 'A false or unset value saved as unchecked calls neither enable nor disable' );

		foreach ( array( null, false ) as $previous ) {
			$this->havePreviousValue( $previous );
			$this->submitGeneral( false );
			$I->assertTrue( $this->storedValue() === false, 'false should be stored' );
		}

		$I->assertSame( 0, $this->spy->enableCalls, 'enable should not be called' );
		$I->assertSame( 0, $this->spy->disableCalls, 'disable should not be called' );
	}

	public function callsFollowTransitionsOnly( FunctionalTester $I ) {
		$I->wantToTest( 'Over several saves, enable and disable are called only when the value changes' );

		foreach ( array( true, true, false, false, true, false, true, true ) as $checked ) {
			$this->submitGeneral( $checked );
		}

		$I->assertSame( 3, $this->spy->enableCalls, 'enable should be called on each off to on change' );
		$I->assertSame( 2, $this->spy->disableCalls, 'disable should be called on each on to off change' );
	}

	public function uncheckedSaveOnNeverEnabledSiteCreatesNoBanner( FunctionalTester $I ) {
		$I->wantToTest( 'An unchecked save on a site where the banner was never enabled creates no banner block' );

		Brizy_Admin_Settings::_init()->setCookieBanner( new Brizy_Admin_Blocks_CookieBanner() );
		$this->deleteBanners();

		$this->submitGeneral( false );
		$I->assertCount( 0, $this->bannerIds(), 'No banner block should exist, trash included' );

		$this->havePreviousValue( false );
		$this->submitGeneral( false );
		$I->assertCount( 0, $this->bannerIds(), 'No banner block should exist, trash included' );
	}

	public function unchangedSaveKeepsTheBanner( FunctionalTester $I ) {
		$I->wantToTest( 'Saving without changing the value leaves the banner status, rules and content the same' );

		Brizy_Admin_Settings::_init()->setCookieBanner( new Brizy_Admin_Blocks_CookieBanner() );
		$this->deleteBanners();
		$id = $this->haveCustomizedBanner();

		foreach ( array( true, false ) as $value ) {
			$this->havePreviousValue( $value );
			$before = $this->bannerSnapshot( $id );

			$this->submitGeneral( $value );

			$after = $this->bannerSnapshot( $id );
			$I->assertSame( $before['post_status'], $after['post_status'], 'The banner status should not change' );
			$I->assertSame( $before['brizy-rules'], $after['brizy-rules'], 'The banner rules should not change' );
			$I->assertSame( $before['editor-data'], $after['editor-data'], 'The banner editor data should not change' );
			$I->assertSame( $before, $after, 'Nothing on the banner should change' );
		}
	}

	public function realTransitionsEnableAndDisableTheBanner( FunctionalTester $I ) {
		$I->wantToTest( 'Off to on creates the banner with include-all, on to off applies exclude-all' );

		Brizy_Admin_Settings::_init()->setCookieBanner( new Brizy_Admin_Blocks_CookieBanner() );
		$this->deleteBanners();
		$this->havePreviousValue( false );

		$this->submitGeneral( true );
		$ids = $this->bannerIds();
		$I->assertCount( 1, $ids, 'One banner block should be created' );
		$I->assertSame( 'publish', get_post_status( $ids[0] ), 'The banner should be published' );
		$I->assertTrue( $this->hasMatchAllRule( $ids[0], Brizy_Admin_Rule::TYPE_INCLUDE ), 'The banner should have the include-all rule set' );
		$I->assertTrue( $this->storedValue() === true, 'true should be stored' );

		$this->submitGeneral( false );
		$I->assertSame( $ids, $this->bannerIds(), 'The same banner block should be kept' );
		$I->assertTrue( $this->hasMatchAllRule( $ids[0], Brizy_Admin_Rule::TYPE_EXCLUDE ), 'The banner should have the exclude-all rule set' );
		$I->assertTrue( $this->storedValue() === false, 'false should be stored' );
		$I->assertFalse( Brizy_Admin_Flash::instance()->has_notice_type( Brizy_Admin_Flash::ERROR ), 'No error notice should be shown' );
	}
}
