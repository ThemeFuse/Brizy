<?php


interface Brizy_Admin_Rules_ValidatorInterface {

	/**
	 * @param Brizy_Admin_Rule $rule
	 * @param Brizy_Admin_RuleSet $targetRuleSet
	 *
	 * @return mixed
	 */
	public function validateRule( Brizy_Admin_Rule $rule, $targetRuleSet );

	/**
	 * @param $rules
	 * @param Brizy_Admin_RuleSet $targetRuleSet
	 *
	 * @return mixed
	 */
	public function validateRules( $rules, $targetRuleSet );


}