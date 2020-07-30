<?php


class BrizyAdminRulesValidatorFactoryCest{

	protected function _before(FunctionalTester $I) {
		wp_cache_flush();
		global $wpdb;
		$wpdb->db_connect();

		$I->loginAs( 'admin', 'admin' );
	}

	public function testGetValidator(FunctionalTester $I) {
		$templateid = $I->havePostInDatabase( [
			'post_type' => Brizy_Admin_Templates::CP_TEMPLATE
		] );
		$popupId    = $I->havePostInDatabase( [
			'post_type' => Brizy_Admin_Popups_Main::CP_POPUP
		] );
		$postId     = $I->havePostInDatabase( [
			'post_type' => 'post'
		] );

		$templateValidator = Brizy_Admin_Rules_ValidatorFactory::getValidator( $templateid );
		$I->assertInstanceOf( Brizy_Admin_Rules_TemplateRuleValidator::class, $templateValidator, 'It should return a template validator' );

		$popupValidator = Brizy_Admin_Rules_ValidatorFactory::getValidator( $popupId );
		$I->assertInstanceOf( Brizy_Admin_Rules_PopupRuleValidator::class, $popupValidator, 'It should return a popup validator' );

		$postValidator = Brizy_Admin_Rules_ValidatorFactory::getValidator( $postId );
		$I->assertNull( $postValidator, 'It should not return a post validator' );
	}
}
