<?php

class LayoutsMainCest {
	/**
	 * @param \FunctionalTester $I
	 */
	public function _before( FunctionalTester $I ) {
		wp_cache_flush();
	}

	public function requestWithoutVersionKey( FunctionalTester $I ) {
		$I->wantToTest( 'Request with invalid editor version' );
		$I->assertTrue( post_type_exists( 'brizy-layout' ) ,'It should register layout post type');
	}
}