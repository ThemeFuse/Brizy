<?php


class CloudApiCest {

	/**
	 * @param FunctionalTester $I
	 */
	public function _before( FunctionalTester $I ) {
		wp_cache_flush();

		$I->loginAs( 'admin', 'admin' );
	}

//	/**
//	 * @param FunctionalTester $I
//	 */
//	public function signInTest( FunctionalTester $I ) {
//
//		$I->wantToTest( 'Request with invalid editor version' );
//		$I->setHeader( 'Content-Type', 'application/json' );
//		$I->sendPOST( 'wp-admin/admin-ajax.php?' . build_query(
//				[
//					'action'  => 'brizy-cloud-signin',
//					'version' => BRIZY_EDITOR_VERSION
//				] ),
//
//			json_encode( array(
//				'email'    => 'testbrizy@gmail.com',
//				'password' => '12345'
//			) )
//		);
//	}
//
//	/**
//	 * @param FunctionalTester $I
//	 */
//	public function getContainersTest( FunctionalTester $I ) {
//		$I->wantToTest( 'Get container request' );
//
//		$I->sendAjaxGetRequest( 'wp-admin/admin-ajax.php?' . build_query( [ 'action' => 'brizy-cloud-signin' ] ),
//			[
//				'username' => '',
//				'password' => ''
//			] );
//	}
}