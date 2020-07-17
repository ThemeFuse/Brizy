<?php


class Brizy_Admin_Rules_TemplateRuleValidator extends Brizy_Admin_Rules_AbstractValidator {
	/**
	 * @param Brizy_Admin_Rule $rule
	 * @param int $postId
	 *
	 * @return mixed
	 * @throws Brizy_Admin_Rules_ValidationException
	 */
	public function validateRuleForPostId( Brizy_Admin_Rule $rule, $postId ) {

		$ruleSets = $this->getRulesSetByWPQuery( [ 'post_type' => get_post_type( $postId ) ] );

		return $this->validateRule( $rule, $ruleSets );
	}

	/**
	 * @param Brizy_Admin_Rule[] $rules
	 * @param int $postId
	 *
	 * @return mixed
	 * @throws Brizy_Admin_Rules_ValidationException
	 */
	public function validateRulesForPostId( $rules, $postId ) {

		$ruleSets = $this->getRulesSetByWPQuery( [
			'post_type' => get_post_type( $postId ),
			'exclude'   => [ $postId ]
		] );

		return $this->validateRules( $rules, $ruleSets );
	}
}