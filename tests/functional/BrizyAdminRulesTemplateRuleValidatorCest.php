<?php


class BrizyAdminRulesTemplateRuleValidatorCest {

	protected function _before( FunctionalTester $I ) {
		wp_cache_flush();
		global $wpdb;
		$wpdb->db_connect();
		$I->havePostInDatabase([]);
		$rules   = [];
		$rules[] = new Brizy_Admin_Rule( 1, 1, 1, 'post', [ 1, 2 ] );
		$rules[] = new Brizy_Admin_Rule( 2, 1, 1, 'page', [ 3, 4 ] );

		$rulesData = [];

		foreach ( $rules as $rule ) {
			$rulesData[] = $rule->convertToOptionValue();
		}

		$I->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Templates::CP_TEMPLATE,
			'post_status' => 'publish',
			'meta_input'  => [
				'brizy-rules' => serialize( $rulesData ),
			]
		] );


		$rules   = [];
		$rules[] = new Brizy_Admin_Rule( 1, 1, 1, 'post', [ 5, 6 ] );
		$rules[] = new Brizy_Admin_Rule( 2, 1, 1, 'page', [ 7, 8 ] );

		$rulesData = [];

		foreach ( $rules as $rule ) {
			$rulesData[] = $rule->convertToOptionValue();
		}

		$I->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Templates::CP_TEMPLATE,
			'post_status' => 'publish',
			'meta_input'  => [
				'brizy-rules' => serialize( $rulesData ),
			]
		] );

	}

	public function testValidateRuleForPostId( FunctionalTester $I ) {

		$templateId = $I->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Templates::CP_TEMPLATE,
			'post_status' => 'publish',
		] );

		$validator = Brizy_Admin_Rules_ValidatorFactory::getValidator( $templateId );
		$validator->validateRuleForPostId( new Brizy_Admin_Rule( 2, 1, 1, 'page', [ 10, 12 ] ), $templateId );

		$I->expectThrowable( Brizy_Admin_Rules_ValidationException::class, function () use ( $validator, $templateId ) {
			$validator->validateRuleForPostId( new Brizy_Admin_Rule( 3, 1, 1, 'post', [ 1, 2 ] ), $templateId );
		} );
	}


	public function testValidateRulesForPostId( FunctionalTester $I ) {
		$rules   = array();
		$rules[] = new Brizy_Admin_Rule( 1, 1, 1, 'post', [ 11, 12 ] );
		$rules[] = new Brizy_Admin_Rule( 2, 1, 1, 'page', [ 13, 14 ] );

		$rulesData = [];

		foreach ( $rules as $rule ) {
			$rulesData[] = $rule->convertToOptionValue();
		}

		$templateId = $I->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Templates::CP_TEMPLATE,
			'post_status' => 'publish',
		] );

		$validator = Brizy_Admin_Rules_ValidatorFactory::getValidator( $templateId );

		$validator->validateRulesForPostId( $rules, $templateId );

		$I->expectThrowable( Brizy_Admin_Rules_ValidationException::class, function () use ( $validator, $templateId ) {
			$validator->validateRulesForPostId( [
				new Brizy_Admin_Rule( 2, 1, 1, 'post', [ 1, 2 ] ),
			], $templateId );
		} );
	}
}
