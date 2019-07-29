<?php


class RulesApiCest {

	/**
	 * @param FunctionalTester $I
	 *
	 * @throws \Codeception\Exception\ModuleException
	 */
	public function _before( FunctionalTester $I ) {
		wp_cache_flush();
		$I->loginAs( 'admin', 'admin' );
	}


	/**
	 * @param FunctionalTester $I
	 *
	 * @throws Exception
	 */
	public function getRulesTest( FunctionalTester $I ) {

		$rule = Brizy_Admin_Rule::createFromRequestData( [
			"type"         => 1,
			"appliedFor"   => 1,
			"entityType"   => "post",
			"entityValues" => []
		] );

		$postId = $I->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Popups_Main::CP_POPUP,
			'post_status' => 'publish',
			'meta_input'  => [
				'brizy-rules' => serialize( [ $rule->convertToOptionValue() ] ),
			]
		] );

		$I->sendGET( $I->ajaxUrl( 'brizy_list_rules', [ 'post' => $postId ] ) );

		$I->seeResponseCodeIsSuccessful();

		$response = $I->grabJsonResponse( $I );

		$ruleManager = new Brizy_Admin_Rules_Manager();
		$rules       = $ruleManager->getRules( $postId );

		$I->assertEquals( $rules, [ $rule ], 'It should return the existing rules' );
	}

	/**
	 * @param FunctionalTester $I
	 *
	 * @throws Exception
	 */
	public function createRuleTest( FunctionalTester $I ) {

		$ruleId = md5( time() );
		$rule   = Brizy_Admin_Rule::createFromRequestData( [
			"id"           => $ruleId,
			"type"         => 1,
			"appliedFor"   => 1,
			"entityType"   => "post",
			"entityValues" => [ 1 ]
		] );

		$postId = $I->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Popups_Main::CP_POPUP,
			'post_status' => 'publish',
			'meta_input'  => [
				'brizy-rules' => serialize( [ $rule->convertToOptionValue() ] ),
			]
		] );

		$I->haveHttpHeader( 'Content-Type', 'application/json' );
		$newRule = Brizy_Admin_Rule::createFromRequestData( [
			"type"         => 1,
			"appliedFor"   => 1,
			"entityType"   => "post",
			"entityValues" => [ 3, 4 ]
		] );
		$I->sendPOST( $I->ajaxUrl( 'brizy_add_rule', [ 'post' => $postId ] ), $newRule->convertToOptionValue() );

		$I->seeResponseCodeIsSuccessful();

		$I->seePostMetaInDatabase( [
			'post_id'  => $postId,
			'meta_key' => 'brizy-rules'
		] );

		$ruleManager = new Brizy_Admin_Rules_Manager();
		$rules       = $ruleManager->getRules( $postId );

		$I->assertEquals( $rules, [
			$rule,
			$newRule
		], 'It should return the rule created' );
	}

	/**
	 * @param FunctionalTester $I
	 *
	 * @throws Exception
	 */
	public function createInvalidRuleTest( FunctionalTester $I ) {
		$ruleId = md5( time() );
		$rule   = Brizy_Admin_Rule::createFromRequestData( [
			"id"           => $ruleId,
			"type"         => 1,
			"appliedFor"   => 1,
			"entityType"   => "post",
			"entityValues" => [ 1 ]
		] );

		$postId = $I->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Popups_Main::CP_POPUP,
			'post_status' => 'publish',
			'meta_input'  => [
				'brizy-rules' => serialize( [ $rule->convertToOptionValue() ] ),
			]
		] );

		$I->haveHttpHeader( 'Content-Type', 'application/json' );
		$newRule = Brizy_Admin_Rule::createFromRequestData( [
			"type"         => 1,
			"appliedFor"   => 1,
			"entityType"   => "post",
			"entityValues" => [ 1 ]
		] );
		$I->sendPOST( $I->ajaxUrl( 'brizy_add_rule', [ 'post' => $postId ] ), $newRule->convertToOptionValue() );

		$I->seeResponseCodeIs( 400 );

		$ruleManager = new Brizy_Admin_Rules_Manager();
		$rules       = $ruleManager->getRules( $postId );

		$I->assertEquals( $rules, [ $rule ], 'It should return the rule created' );
	}


	/**
	 * @param FunctionalTester $I
	 *
	 * @throws Exception
	 */
	public function createRulesTest( FunctionalTester $I ) {

		$postId = $I->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Popups_Main::CP_POPUP,
			'post_status' => 'publish',
		] );

		$I->haveHttpHeader( 'Content-Type', 'application/json' );
		$rules = [
			[
				"type"         => 1,
				"appliedFor"   => 1,
				"entityType"   => "post",
				"entityValues" => [ 1 ]
			],
			[
				"type"         => 1,
				"appliedFor"   => 1,
				"entityType"   => "post",
				"entityValues" => [ 2 ]
			]
		];

		$I->sendPOST( $I->ajaxUrl( 'brizy_add_rules', [ 'post' => $postId ] ), $rules );

		$I->seeResponseCodeIsSuccessful();

		$I->seePostMetaInDatabase( [
			'post_id'  => $postId,
			'meta_key' => 'brizy-rules'
		] );

		$ruleManager           = new Brizy_Admin_Rules_Manager();
		$expectedRules         = $ruleManager->getRules( $postId );
		$expectedRulesAsArrays = [];
		foreach ( $expectedRules as $i => $exRule ) {
			$rules[ $i ]['id']       = $exRule->getId();
			$expectedRulesAsArrays[] = $exRule->convertToOptionValue();
		}

		$I->assertEquals( $expectedRulesAsArrays, $rules, 'It should return the rules created' );
	}

	/**
	 * @param FunctionalTester $I
	 *
	 * @throws Exception
	 */
	public function updateRulesTest( FunctionalTester $I ) {

		$rule = Brizy_Admin_Rule::createFromRequestData( [
			"type"         => 1,
			"appliedFor"   => 1,
			"entityType"   => "post",
			"entityValues" => []
		] );

		$postId = $I->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Popups_Main::CP_POPUP,
			'post_status' => 'publish',
			'meta_input'  => [
				'brizy-rules' => serialize( [ $rule->convertToOptionValue() ] ),
			]
		] );

		$I->haveHttpHeader( 'Content-Type', 'application/json' );
		$rules = [
			[
				"type"         => 1,
				"appliedFor"   => 2,
				"entityType"   => "post",
				"entityValues" => [ 1 ]
			],
			[
				"type"         => 1,
				"appliedFor"   => 2,
				"entityType"   => "post",
				"entityValues" => [ 2 ]
			]
		];

		$I->sendPOST( $I->ajaxUrl( 'brizy_update_rules', [ 'post' => $postId ] ), $rules );

		$I->seeResponseCodeIsSuccessful();

		$I->seePostMetaInDatabase( [
			'post_id'  => $postId,
			'meta_key' => 'brizy-rules'
		] );

		$ruleManager           = new Brizy_Admin_Rules_Manager();
		$expectedRules         = $ruleManager->getRules( $postId );
		$expectedRulesAsArrays = [];
		foreach ( $expectedRules as $i => $exRule ) {
			$rules[ $i ]['id']       = $exRule->getId();
			$expectedRulesAsArrays[] = $exRule->convertToOptionValue();
		}

		$I->assertEquals( $expectedRulesAsArrays, $rules, 'It should return the rules created' );
	}


	/**
	 * @param FunctionalTester $I
	 *
	 * @throws Exception
	 */
	public function deleteRuleTest( FunctionalTester $I ) {

		$ruleId = md5( time() );
		$rule   = Brizy_Admin_Rule::createFromRequestData( [
			"id"           => $ruleId,
			"type"         => 1,
			"appliedFor"   => 1,
			"entityType"   => "post",
			"entityValues" => []
		] );

		$postId = $I->havePostInDatabase( [
			'post_type'   => 'post',
			'post_status' => 'publish',
			'meta_input'  => [
				'brizy-rules' => serialize( [ $rule->convertToOptionValue() ] ),
			]
		] );

		$I->sendGET( $I->ajaxUrl( 'brizy_delete_rule', [ 'post' => $postId, 'rule' => $ruleId ] ) );

		$I->seeResponseCodeIsSuccessful();

		$ruleManager = new Brizy_Admin_Rules_Manager();
		$rules       = $ruleManager->getRules( $postId );

		$I->assertEquals( $rules, [], 'It should return an empty array of rules' );
	}

}