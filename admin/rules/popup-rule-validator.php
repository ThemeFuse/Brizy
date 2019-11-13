<?php


class Brizy_Admin_Rules_PopupRuleValidator extends Brizy_Admin_Rules_AbstractValidator {

	/**
	 * @param Brizy_Admin_Rule $rule
	 * @param int $postId
	 *
	 * @return mixed
	 * @throws Brizy_Admin_Rules_ValidationException
	 * @throws Exception
	 */
	public function validateRuleForPostId( Brizy_Admin_Rule $rule, $postId ) {

		$ruleSet = $this->getPopupRuleSet( $postId );

		return $this->validateRule( $rule, $ruleSet );
	}

	/**
	 * @param Brizy_Admin_Rule[] $rules
	 * @param int $postId
	 *
	 * @return mixed
	 * @throws Brizy_Admin_Rules_ValidationException
	 */
	public function validateRulesForPostId( $rules, $postId ) {

		$ruleSets = $this->getPopupRuleSet( $postId );

		return $this->validateRules( $rules, $ruleSets );
	}


	private function getPopupRuleSet( $postId ) {
		$rules = $this->manager->getRules( $postId );

		$rules = self::sortRules( $rules );

		return new Brizy_Admin_RuleSet( $rules );
	}
}