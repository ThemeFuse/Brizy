<?php

/**
 * Class ComponentApiCest
 */
class ComponentApiCest {

	/**
	 * @param FunctionalTester $I
	 */
	public function _before( FunctionalTester $I ) {
		$I->loginAs( 'admin', 'admin' );
		@$I->cleanUploadsDir();
	}


	/**
	 * @param FunctionalTester $I
	 */
	public function getComponentDataInvalidIdsTest( FunctionalTester $I ) {

		// unknown component id
		$I->sendGET( '/wp-admin/admin-ajax.php?' . build_query( [
				'action' => Brizy_Public_ComponentsApi::AJAX_GET_DATA,
				'v'      => '{}',
				'pageId' => 1,
				'id'     => 'UNKNOWN_COMPONENT'
			] ) );
		$I->seeResponseCodeIs( 404 );

		// no component id
		$I->sendGET( '/wp-admin/admin-ajax.php?' . build_query( [
				'action' => Brizy_Public_ComponentsApi::AJAX_GET_DATA,
				'pageId' => 1,
				'v'      => '{}',
			] ) );
		$I->seeResponseCodeIs( 400 );

		// no model data
		$I->sendGET( '/wp-admin/admin-ajax.php?' . build_query( [
				'action' => Brizy_Public_ComponentsApi::AJAX_GET_DATA,
				'pageId' => 1,
				'id'     => 'LatestComments'
			] ) );
		$I->seeResponseCodeIs( 400 );

		// no page id
		$I->sendGET( '/wp-admin/admin-ajax.php?' . build_query( [
				'action' => Brizy_Public_ComponentsApi::AJAX_GET_DATA,
				'v'      => '{}',
				'id'     => 'LatestComments'
			] ) );
		$I->seeResponseCodeIs( 400 );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function getComponentDataTest( FunctionalTester $I ) {
		$I->sendGET( '/wp-admin/admin-ajax.php?' . build_query( [
				'action' => Brizy_Public_ComponentsApi::AJAX_GET_DATA,
				'v'      => '{}',
				'pageId' => 1,
				'id'     => 'LatestComments'
			] ) );
		$I->seeResponseCodeIsSuccessful();
	}
}
