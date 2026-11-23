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

	public function layoutIsSupportedForCloudCronWithoutLoggedInUser( FunctionalTester $I ) {
		$I->wantToTest( 'Layout post type is supported for the cloud cron without a logged-in user' );
		wp_set_current_user( 0 );
		remove_filter( 'brizy_supported_post_types', array( 'Brizy_Admin_Layouts_Main', 'populateSupportedPosts' ) );
		$I->assertNotContains( Brizy_Admin_Layouts_Main::CP_LAYOUT, Brizy_Editor::get()->supported_post_types() );

		new Brizy_Admin_Cloud_Cron( null );

		$I->assertContains( Brizy_Admin_Layouts_Main::CP_LAYOUT, Brizy_Editor::get()->supported_post_types(), 'Layouts must be supported for cron sync' );
	}
}