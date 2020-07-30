<?php


class BrizyAdminRulesPopupValidatorCest {

	protected function _before( FunctionalTester $I ) {
		wp_cache_flush();
		global $wpdb;
		$wpdb->db_connect();
		$I->havePostInDatabase( [] );

		$I->loginAs( 'admin', 'admin' );
	}

	public function testValidateRuleForPostId( FunctionalTester $I ) {
		$rules   = array();
		$rules[] = new Brizy_Admin_Rule( 1, 1, 1, 'post', [ 1, 2 ] );
		$rules[] = new Brizy_Admin_Rule( 2, 1, 1, 'page', [ 3, 4 ] );

		$rulesData = [];

		foreach ( $rules as $rule ) {
			$rulesData[] = $rule->convertToOptionValue();
		}

		$postId = $I->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Popups_Main::CP_POPUP,
			'post_status' => 'publish',
			'meta_input'  => [
				'brizy-rules' => serialize( $rulesData ),
			]
		] );

		$validator = Brizy_Admin_Rules_ValidatorFactory::getValidator( $postId );

		$validator->validateRuleForPostId( new Brizy_Admin_Rule( 2, 1, 1, 'page', [ 5, 6 ] ), $postId );

		$I->expectThrowable( Brizy_Admin_Rules_ValidationException::class, function () use ($validator, $postId) {
			$validator->validateRuleForPostId( new Brizy_Admin_Rule( 3, 1, 1, 'post', [ 1, 2 ] ), $postId );
		} );
	}


	public function testValidateRulesForPostId( FunctionalTester $I ) {
		$rules   = array();
		$rules[] = new Brizy_Admin_Rule( 1, 1, 1, 'post', [ 1, 2 ] );
		$rules[] = new Brizy_Admin_Rule( 2, 1, 1, 'page', [ 3, 4 ] );

		$rulesData = [];

		foreach ( $rules as $rule ) {
			$rulesData[] = $rule->convertToOptionValue();
		}

		$postId = $I->havePostInDatabase( [
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

		$I->expectThrowable( Brizy_Admin_Rules_ValidationException::class, function () use ($validator, $postId) {
			$validator->validateRulesForPostId( [
				new Brizy_Admin_Rule( 2, 1, 1, 'page', [ 5, 6 ] ),
				new Brizy_Admin_Rule( 2, 1, 1, 'post', [ 1, 2 ] )
			], $postId );
		} );

	}
}
