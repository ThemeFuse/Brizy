<?php


class Brizy_Admin_Rules_PopupValidatorTest extends \Codeception\Test\Unit {

	/**
	 * @var \IntegrationTester
	 */
	protected $tester;

	protected function _before() {
		wp_cache_flush();
		global $wpdb;
		$wpdb->db_connect();
	}

	public function testValidateRuleForPostId() {
		$rules   = array();
		$rules[] = new Brizy_Admin_Rule( 1, 1, 1, 'post', [ 1, 2 ] );
		$rules[] = new Brizy_Admin_Rule( 2, 1, 1, 'page', [ 3, 4 ] );

		$rulesData = [];

		foreach ( $rules as $rule ) {
			$rulesData[] = $rule->convertToOptionValue();
		}

		$postId = $this->tester->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Popups_Main::CP_POPUP,
			'post_status' => 'publish',
			'meta_input'  => [
				'brizy-rules' => serialize( $rulesData ),
			]
		] );

		$validator = Brizy_Admin_Rules_ValidatorFactory::getValidator( $postId );

		$validator->validateRuleForPostId( new Brizy_Admin_Rule( 2, 1, 1, 'page', [ 5, 6 ] ), $postId );

		$this->expectException( Brizy_Admin_Rules_ValidationException::class );
		$validator->validateRuleForPostId( new Brizy_Admin_Rule( 3, 1, 1, 'post', [ 1, 2 ] ), $postId );
	}


	public function testValidateRulesForPostId() {
		$rules   = array();
		$rules[] = new Brizy_Admin_Rule( 1, 1, 1, 'post', [ 1, 2 ] );
		$rules[] = new Brizy_Admin_Rule( 2, 1, 1, 'page', [ 3, 4 ] );

		$rulesData = [];

		foreach ( $rules as $rule ) {
			$rulesData[] = $rule->convertToOptionValue();
		}

		$postId = $this->tester->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Popups_Main::CP_POPUP,
			'post_status' => 'publish',
			'meta_input'  => [
				'brizy-rules' => serialize( $rulesData ),
			]
		] );

		$validator = Brizy_Admin_Rules_ValidatorFactory::getValidator( $postId );

		$validator->validateRulesForPostId( [
			new Brizy_Admin_Rule( 2, 1, 1, 'page', [ 5, 6 ] ),
			new Brizy_Admin_Rule( 2, 1, 1, 'page', [ 7, 8 ] )
		], $postId );

		$this->expectException( Brizy_Admin_Rules_ValidationException::class );
		$validator->validateRulesForPostId( [
			new Brizy_Admin_Rule( 2, 1, 1, 'page', [ 5, 6 ] ),
			new Brizy_Admin_Rule( 2, 1, 1, 'post', [ 1, 2 ] )
		], $postId );
	}
}
