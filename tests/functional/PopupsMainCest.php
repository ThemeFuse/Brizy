<?php

class PopupsMainCest {
	/**
	 * @param \FunctionalTester $I
	 */
	public function _before( FunctionalTester $I ) {
		wp_cache_flush();
		$I->loginAs( 'admin', 'admin' );
		$I->dontHavePostInDatabase( [ 'post_type' => 'brizy-project' ] );
	}

	public function requestWithoutVersionKey( FunctionalTester $I ) {
		$I->wantToTest( 'Request with invalid editor version' );
		$I->assertTrue( post_type_exists( 'brizy-global-popup' ) ,'It should register global popup post type');
		$I->assertTrue( post_type_exists( 'brizy-saved-popup' ) ,'It should register saved popup post type');
	}
}