<?php


class Brizy_Admin_Rules_AbstractValidatorUnitTest extends \Codeception\Test\Unit {

	/**
	 * @var \UnitTester
	 */
	protected $tester;

	public function testValidateRule() {

		$validatorStub = $this->getMockForAbstractClass( 'Brizy_Admin_Rules_AbstractValidator',[], '', false );

		// Given
		$rulesSetArray   = [];
		$rulesSetArray[] = new Brizy_Admin_Rule( 1, 1, 1, 'post', [] );
		$rulesSetArray[] = new Brizy_Admin_Rule( 2, 1, 1, 'page', [] );
		$ruleSet         = new Brizy_Admin_RuleSet( $rulesSetArray );

		$rule1 = new Brizy_Admin_Rule( 3, 1, 1, 'post', [ 1 ] );
		$rule2 = new Brizy_Admin_Rule( 4, 1, 1, 'post', [] );

		$validatorStub->validateRule( $rule1, $ruleSet );

		// When
		$this->expectException( Brizy_Admin_Rules_ValidationException::class );
		$validatorStub->validateRule( $rule2, $ruleSet );
	}

//	public function testValidateRuleWithMultimpleEntityIds() {
//
//		$validatorStub = $this->getMockForAbstractClass( 'Brizy_Admin_Rules_AbstractValidator' );
//
//		// Given
//		$rulesSetArray   = [];
//		$rulesSetArray[] = new Brizy_Admin_Rule( 1, 1, 1, 'post', [1,2,3,4,5] );
//		$ruleSet         = new Brizy_Admin_RuleSet( $rulesSetArray );
//
//		$rule = new Brizy_Admin_Rule( 3, 1, 1, 'post', [ 6 ] );
//
//		$validatorStub->validateRule( $rule, $ruleSet );
//
//		$rule = new Brizy_Admin_Rule( 3, 1, 1, 'post', [ 1 ] );
//		$this->expectException( Brizy_Admin_Rules_ValidationException::class );
//		$validatorStub->validateRule( $rule, $ruleSet );
//	}

	public function testValidateRules() {
		$validatorStub = $this->getMockForAbstractClass( 'Brizy_Admin_Rules_AbstractValidator',[], '', false );

		// Given
		$rulesSetArray   = [];
		$rulesSetArray[] = new Brizy_Admin_Rule( 1, 1, 1, 'post', [] );
		$rulesSetArray[] = new Brizy_Admin_Rule( 2, 1, 1, 'page', [] );
		$ruleSet         = new Brizy_Admin_RuleSet( $rulesSetArray );

		$rules   = [];
		$rules[] = new Brizy_Admin_Rule( 3, 1, 1, 'post', [ 1 ] );

		$validatorStub->validateRules( $rules, $ruleSet );

		// When
		$rules[] = new Brizy_Admin_Rule( 4, 1, 1, 'post', [] );

		$this->expectException( Brizy_Admin_Rules_ValidationException::class );
		$validatorStub->validateRules( $rules, $ruleSet );
	}
}
