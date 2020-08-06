<?php


abstract class Brizy_Admin_Rules_AbstractValidator implements Brizy_Admin_Rules_ValidatorInterface {

	/**
	 * @var int
	 */
	private $postId;

	/**
	 * @var Brizy_Admin_Rules_Manager
	 */
	protected $manager;

	/**
	 * Brizy_Admin_Rules_TemplateRuleValidator constructor.
	 *
	 * @param int $postId
	 * @param Brizy_Admin_Rules_Manager $manager
	 */
	public function __construct( $postId, Brizy_Admin_Rules_Manager $manager ) {
		$this->manager = $manager;
		$this->postId  = (int) $postId;
	}

	/**
	 * @param Brizy_Admin_Rule $rule
	 * @param int $postId
	 *
	 * @return mixed
	 */
	abstract public function validateRuleForPostId( Brizy_Admin_Rule $rule, $postId );

	/**
	 * @param Brizy_Admin_Rule[] $rules
	 * @param int $postId
	 *
	 * @return mixed
	 */
	abstract public function validateRulesForPostId( $rules, $postId );

	/**
	 * @param Brizy_Admin_Rule $rule
	 * @param Brizy_Admin_RuleSet $targetRuleSet
	 *
	 * @return mixed
	 * @throws Brizy_Admin_Rules_ValidationException
	 */
	public function validateRule( Brizy_Admin_Rule $rule, $targetRuleSet ) {
		foreach ( $targetRuleSet->getRules() as $arule ) {

			if ( $rule->isEqual( $arule ) ) {
				throw new Brizy_Admin_Rules_ValidationException( $arule->getId(), 'The rule is already used' );
			}
		}

		return true;
	}

	/**
	 * @param $rules
	 * @param Brizy_Admin_RuleSet $targetRuleSet
	 *
	 * @return mixed
	 * @throws Brizy_Admin_Rules_ValidationException
	 */
	public function validateRules( $rules, $targetRuleSet ) {
		$errors = array();
		foreach ( $targetRuleSet->getRules() as $arule ) {
			foreach ( $rules as $newRule ) {
				if ( $newRule->isEqual( $arule ) ) {
					throw new Brizy_Admin_Rules_ValidationException( $arule->getId(), 'The rule is already used' );
				}
			}
		}

		if ( count( $errors ) > 0 ) {
			return $errors;
		}

		return array();
	}

	/**
	 * @param array $args
	 *
	 * @return Brizy_Admin_RuleSet
	 * @throws Exception
	 */
	protected function getRulesSetByWPQuery( $args = array() ) {

		$defaults = array(
			'posts_per_page' => - 1,
			'post_status'    => array( 'publish', 'pending', 'draft', 'future', 'private', 'inherit' )
		);

		$r = wp_parse_args( $args, $defaults );

		$templates = get_posts( $r );

		$rules = array();

		foreach ( $templates as $template ) {
			$tRules = $this->manager->getRules( $template->ID );
			$rules  = array_merge( $rules, $tRules );
		}

		$rules = self::sortRules( $rules );

		return new Brizy_Admin_RuleSet( $rules );
	}

	/**
	 * @param Brizy_Admin_Rule[] $rules
	 *
	 * @return mixed
	 */
	static public function sortRules( $rules ) {
		// sort the rules by how specific they are
		usort( $rules, function ( $a, $b ) {
			/**
			 * @var Brizy_Admin_Rule $a ;
			 * @var Brizy_Admin_Rule $b ;
			 */
			$la = $a->getRuleWeight([]);
			$lb = $b->getRuleWeight([]);
			if ( $lb == $la ) {
				return 0;
			}

			return $la < $lb ? 1 : - 1;
		} );

		return $rules;
	}


}
