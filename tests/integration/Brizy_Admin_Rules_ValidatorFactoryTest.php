<?php


class Brizy_Admin_Rules_ValidatorFactoryTest extends \Codeception\Test\Unit {

	/**
	 * @var \IntegrationTester
	 */
	protected $tester;

	protected function _before() {
		wp_cache_flush();
		global $wpdb;
		$wpdb->db_connect();
	}

	public function testGetValidator() {
		$templateid = $this->tester->havePostInDatabase( [
			'post_type' => Brizy_Admin_Templates::CP_TEMPLATE
		] );
		$popupId    = $this->tester->havePostInDatabase( [
			'post_type' => Brizy_Admin_Popups_Main::CP_POPUP
		] );
		$postId     = $this->tester->havePostInDatabase( [
			'post_type' => 'post'
		] );

		$templateValidator = Brizy_Admin_Rules_ValidatorFactory::getValidator( $templateid );
		$this->tester->assertInstanceOf( Brizy_Admin_Rules_TemplateRuleValidator::class, $templateValidator, 'It should return a template validator' );

		$popupValidator = Brizy_Admin_Rules_ValidatorFactory::getValidator( $popupId );
		$this->tester->assertInstanceOf( Brizy_Admin_Rules_PopupRuleValidator::class, $popupValidator, 'It should return a popup validator' );

		$postValidator = Brizy_Admin_Rules_ValidatorFactory::getValidator( $postId );
		$this->tester->assertNull( $postValidator, 'It should not return a post validator' );
	}
}
