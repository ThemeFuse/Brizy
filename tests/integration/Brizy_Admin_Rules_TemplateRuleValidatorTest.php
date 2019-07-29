<?php


class Brizy_Admin_Rules_TemplateRuleValidatorTest extends \Codeception\Test\Unit {

	/**
	 * @var \IntegrationTester
	 */
	protected $tester;

	protected function _before() {
		wp_cache_flush();
		global $wpdb;
		$wpdb->db_connect();

		$rules = [];
		$rules[] = new Brizy_Admin_Rule( 1, 1, 1, 'post', [ 1, 2 ] );
		$rules[] = new Brizy_Admin_Rule( 2, 1, 1, 'page', [ 3, 4 ] );

		$rulesData = [];

		foreach ( $rules as $rule ) {
			$rulesData[] = $rule->convertToOptionValue();
		}

		$this->tester->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Templates::CP_TEMPLATE,
			'post_status' => 'publish',
			'meta_input'  => [
				'brizy-rules' => serialize( $rulesData ),
			]
		] );


		$rules = [];
		$rules[] = new Brizy_Admin_Rule( 1, 1, 1, 'post', [ 5, 6 ] );
		$rules[] = new Brizy_Admin_Rule( 2, 1, 1, 'page', [ 7, 8 ] );

		$rulesData = [];

		foreach ( $rules as $rule ) {
			$rulesData[] = $rule->convertToOptionValue();
		}

		$this->tester->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Templates::CP_TEMPLATE,
			'post_status' => 'publish',
			'meta_input'  => [
				'brizy-rules' => serialize( $rulesData ),
			]
		] );

	}

	public function testValidateRuleForPostId() {

		$templateId = $this->tester->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Templates::CP_TEMPLATE,
			'post_status' => 'publish',
		] );

		$validator = Brizy_Admin_Rules_ValidatorFactory::getValidator( $templateId );

		$validator->validateRuleForPostId( new Brizy_Admin_Rule( 2, 1, 1, 'page', [ 10, 12 ] ), $templateId );

		$this->expectException( Brizy_Admin_Rules_ValidationException::class );
		$validator->validateRuleForPostId( new Brizy_Admin_Rule( 3, 1, 1, 'post', [ 1, 2 ] ), $templateId );
	}


	public function testValidateRulesForPostId() {
		$rules   = array();
		$rules[] = new Brizy_Admin_Rule( 1, 1, 1, 'post', [ 11, 12 ] );
		$rules[] = new Brizy_Admin_Rule( 2, 1, 1, 'page', [ 13, 14 ] );

		$rulesData = [];

		foreach ( $rules as $rule ) {
			$rulesData[] = $rule->convertToOptionValue();
		}

		$templateId = $this->tester->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Popups_Main::CP_POPUP,
			'post_status' => 'publish',
		] );

		$validator = Brizy_Admin_Rules_ValidatorFactory::getValidator( $templateId );

		$validator->validateRulesForPostId( $rules, $templateId );

		$this->expectException( Brizy_Admin_Rules_ValidationException::class );
		$validator->validateRulesForPostId( [
			new Brizy_Admin_Rule( 2, 1, 1, 'post', [ 1, 2 ] ),
		], $templateId );
	}
}
