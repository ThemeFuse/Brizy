<?php

class Brizy_Admin_Rules_Manager {


	/**
	 * @return array|null
	 */
	static function getCurrentPageGroupAndType() {
		global $wp_query;

		if ( ! isset( $wp_query ) || is_admin() ) {
			return null;
		}

		$ruleMatches = [];

		$defaultRule = [ 'applyFor' => Brizy_Admin_Rule::TEMPLATE, 'entityType' => null, 'entityValues' => [] ];

		if ( is_404() ) {
			$rule               = $defaultRule;
			$rule['applyFor']   = Brizy_Admin_Rule::TEMPLATE;
			$rule['entityType'] = 404;
			$ruleMatches[]      = $rule;
		}

		if ( is_author() ) {
			$rule                   = $defaultRule;
			$rule['applyFor']       = Brizy_Admin_Rule::TEMPLATE;
			$rule['entityType']     = 'author';
			$author_obj             = $wp_query->get_queried_object();
			$rule['entityValues'][] = $author_obj->ID;
			$ruleMatches[]          = $rule;
		}

		if ( is_search() ) {
			$rule               = $defaultRule;
			$rule['applyFor']   = Brizy_Admin_Rule::TEMPLATE;
			$rule['entityType'] = 'search';
			$ruleMatches[]      = $rule;

		}

		if ( function_exists( 'is_shop' ) && is_shop() ) {

			$rule               = $defaultRule;
			$rule['applyFor']   = Brizy_Admin_Rule::WOO_SHOP_PAGE;
			$rule['entityType'] = 'shop_page';
			$ruleMatches[]      = $rule;

			$rule               = $defaultRule;
			$rule['applyFor']   = Brizy_Admin_Rule::POSTS;
			$rule['entityType'] = 'page';
			$rule['entityValues'][] = wc_get_page_id( 'shop' );
			$ruleMatches[]      = $rule;

		}

		if ( is_front_page() && ! is_home() ) {
			$rule               = $defaultRule;
			$rule['applyFor']   = Brizy_Admin_Rule::TEMPLATE;
			$rule['entityType'] = 'front_page';
			$ruleMatches[]      = $rule;
		}

		if ( is_home() ) {
			$rule               = $defaultRule;
			$rule['applyFor']   = Brizy_Admin_Rule::TEMPLATE;
			$rule['entityType'] = 'home_page';
			$ruleMatches[]      = $rule;
		}

		if ( is_category() || is_tag() || is_tax() ) {
			$rule               = $defaultRule;
			$rule['applyFor']   = Brizy_Admin_Rule::TAXONOMY;
			$rule['entityType'] = $wp_query->queried_object->taxonomy;;
			$rule['entityValues'][] = $wp_query->queried_object_id;
			$ruleMatches[]          = $rule;

		}
		if ( is_day() ) {
			$rule             = $defaultRule;
			$rule['applyFor'] = Brizy_Admin_Rule::DAY_ARCHIVE;
			if ( $wp_query->queried_object ) {
				$rule['entityType'] = $wp_query->queried_object->name;
			} else {
				$rule['entityType'] = 'post';
			}
			$ruleMatches[] = $rule;
		}

		if ( is_month() ) {
			$rule             = $defaultRule;
			$rule['applyFor'] = Brizy_Admin_Rule::MONTH_ARCHIVE;
			if ( $wp_query->queried_object ) {
				$rule['entityType'] = $wp_query->queried_object->name;
			} else {
				$rule['entityType'] = 'post';
			}
			$ruleMatches[] = $rule;
		}
		if ( is_year() ) {
			$rule             = $defaultRule;
			$rule['applyFor'] = Brizy_Admin_Rule::YEAR_ARCHIVE;
			if ( $wp_query->queried_object ) {
				$rule['entityType'] = $wp_query->queried_object->name;
			} else {
				$rule['entityType'] = 'post';
			}
			$ruleMatches[] = $rule;
		}

		if ( is_date() ) {
			$rule             = $defaultRule;
			$rule['applyFor'] = Brizy_Admin_Rule::DATE_ARCHIVE;
			if ( $wp_query->queried_object ) {
				$rule['entityType'] = $wp_query->queried_object->name;
			} else {
				$rule['entityType'] = 'post';
			}
			$ruleMatches[] = $rule;

		}

		if ( is_archive() || isset( $_REQUEST['post_type'] ) ) {
			$rule             = $defaultRule;
			$rule['applyFor'] = Brizy_Admin_Rule::ARCHIVE;
			if ( $wp_query->queried_object ) {
				$rule['entityType'] = $wp_query->queried_object->name;
			} else {
				$rule['entityType'] = 'post';
			}
			$ruleMatches[] = $rule;
		}

		$object = get_queried_object();
		if ( ( $object instanceof WP_Post  ) && $object ) {
			$rule                   = $defaultRule;
			$rule['applyFor']       = Brizy_Admin_Rule::POSTS;
			$rule['entityType']     = $object->post_type;
			$rule['entityValues'][] = get_queried_object_id();
			$ruleMatches[]          = $rule;
		}

//		if ( $wp_query->post instanceof WP_Post ) {
//			$rule                   = $defaultRule;
//			$rule['applyFor']       = Brizy_Admin_Rule::POSTS;
//			$rule['entityType']     = $wp_query->post->post_type;
//			$rule['entityValues'][] = $wp_query->post->ID;
//			$ruleMatches[]          = $rule;
//		}

        return $ruleMatches;
    }

    /**
     * @return array|null
     */
    static function getCurrentPageGroupAndTypeForPopoup()
    {
		return self::getCurrentPageGroupAndType();

        global $wp_query;

		if ( ! isset( $wp_query ) || is_admin() ) {
			return null;
		}

		$applyFor     = Brizy_Admin_Rule::TEMPLATE;
		$entityType   = null;
		$entityValues = array();

		/*	if ( is_404() ) {
				$applyFor   = Brizy_Admin_Rule::TEMPLATE;
				$entityType = '404';
			} elseif ( is_author() ) {
				$applyFor   = Brizy_Admin_Rule::TEMPLATE;
				$entityType = 'author';
			} elseif ( is_search() ) {
				$applyFor   = Brizy_Admin_Rule::TEMPLATE;
				$entityType = 'search';
			} elseif ( is_front_page() ) {
				$applyFor   = Brizy_Admin_Rule::TEMPLATE;
				$entityType = 'front_page';
			} elseif ( is_home() ) {
				$applyFor   = Brizy_Admin_Rule::TEMPLATE;
				$entityType = 'home_page';
			} else*/

		if ( is_category() || is_tag() || is_tax() ) {
			$applyFor       = Brizy_Admin_Rule::TAXONOMY;
			$entityType     = $wp_query->queried_object->taxonomy;
			$entityValues[] = $wp_query->queried_object_id;
		} elseif ( is_archive() ) {
			$applyFor = Brizy_Admin_Rule::ARCHIVE;
			if ( $wp_query->queried_object ) {
				$entityType = $wp_query->queried_object->name;
			}
		} elseif ( ( $wp_query->queried_object instanceof WP_Post || $wp_query->post instanceof WP_Post ) && get_queried_object() ) {
			$applyFor       = Brizy_Admin_Rule::POSTS;
			$entityType     = get_queried_object()->post_type;
			$entityValues[] = get_queried_object_id();
		}

		return array( $applyFor, $entityType, $entityValues );
	}

	/**
	 * @param $entities
	 * @param $context
	 *
	 * @return mixed
	 */
	static function sortEntitiesByRuleWeight( $entities, $context ) {
		$ruleManager = new Brizy_Admin_Rules_Manager();
		// sort templates by rule set weight
		usort( $entities, function ( $t1, $t2 ) use ( $ruleManager, $context ) {
			$ruleSetT1      = $ruleManager->getRuleSet( $t1->ID );
			$ruleSetT2      = $ruleManager->getRuleSet( $t2->ID );
			$rule_weight_t1 = $ruleSetT1->getRuleWeight( $context );
			$rule_weight_t2 = $ruleSetT2->getRuleWeight( $context );
			if ( $rule_weight_t1 == $rule_weight_t2 ) {
				return 0;
			}

			return ( $rule_weight_t1 < $rule_weight_t2 ) ? 1 : - 1;
		} );

		return $entities;
	}

	/**
	 * @param $jsonString
	 * @param string $postType
	 *
	 * @return Brizy_Admin_Rule
	 * @throws Exception
	 */
	public function createRuleFromJson( $jsonString, $postType = Brizy_Admin_Templates::CP_TEMPLATE ) {
		$ruleJson = json_decode( $jsonString );

		return Brizy_Admin_Rule::createFromJsonObject( $ruleJson );
	}

	/**
	 * @param $jsonString
	 * @param string $postType
	 *
	 * @return array
	 * @throws Exception
	 */
	public function createRulesFromJson( $jsonString, $postType = Brizy_Admin_Templates::CP_TEMPLATE ) {
		$rulesJson = json_decode( $jsonString );
		$rules     = array();

		if ( is_array( $rulesJson ) ) {
			foreach ( $rulesJson as $ruleJson ) {
				$rules[] = Brizy_Admin_Rule::createFromJsonObject( $ruleJson );
			}
		}

		return $rules;
	}

	/**
	 * @param $postId
	 *
	 * @return array
	 * @throws Exception
	 */
	public function getRules( $postId ) {
		$rules = array();

		$meta_value = get_post_meta( (int) $postId, 'brizy-rules', true );

		// fallback if the migration was not run
		if ( ! $meta_value ) {
			$meta_value = get_post_meta( (int) $postId, 'brizy-template-rules', true );
		}

		if ( is_array( $meta_value ) && count( $meta_value ) ) {

			foreach ( $meta_value as $v ) {
				$brizy_admin_rule = Brizy_Admin_Rule::createFromSerializedData( $v );
				$rules[]          = $brizy_admin_rule;
			}
		}

		$rules = Brizy_Admin_Rules_AbstractValidator::sortRules( $rules );

		return $rules;
	}

	/**
	 * @param $postId
	 * @param Brizy_Admin_Rule[] $rules
	 */
	public function saveRules( $postId, $rules ) {

		$arrayRules = array();

		foreach ( $rules as $rule ) {
			$arrayRules[] = $rule->convertToOptionValue();
		}

		update_metadata( 'post', (int) $postId, 'brizy-rules', $arrayRules );
	}

	/**
	 * @param $postId
	 * @param Brizy_Admin_Rule $rule
	 */
	public function addRule( $postId, $rule ) {
		$rules   = $this->getRules( $postId );
		$rules[] = $rule;
		$this->saveRules( $postId, $rules );

	}

	/**
	 * @param $postId
	 * @param $ruleId
	 */
	public function deleteRule( $postId, $ruleId ) {
		$rules = $this->getRules( $postId );
		foreach ( $rules as $i => $rule ) {
			if ( $rule->getId() == $ruleId ) {
				unset( $rules[ $i ] );
			}
		}

		$this->saveRules( $postId, $rules );
	}

	/**
	 * @param $postId
	 * @param Brizy_Admin_Rule[] $rules
	 */
	public function addRules( $postId, $rules ) {
		$current_rules = $this->getRules( $postId );
		$result_rules  = array_merge( $current_rules, $rules );
		$this->saveRules( $postId, $result_rules );
	}

	/**
	 * @param $postId
	 * @param Brizy_Admin_Rule[] $rules
	 */
	public function setRules( $postId, $rules ) {
		$this->saveRules( $postId, $rules );
	}

	/**
	 * @param int $postId
	 *
	 * @return Brizy_Admin_RuleSet
	 */
	public function getRuleSet( $postId ) {
		return new Brizy_Admin_RuleSet( $this->sortRules( $this->getRules( $postId ) ) );
	}

//
	public function getAllRulesSet( $args = array(), $postType = Brizy_Admin_Templates::CP_TEMPLATE ) {

		$defaults = array(
			'post_type'      => $postType,
			'posts_per_page' => - 1,
			'post_status'    => array( 'publish', 'pending', 'draft', 'auto-draft', 'future', 'private', 'inherit' ),
		);

		$r = wp_parse_args( $args, $defaults );

		$templates = get_posts( $r );

		$rules = array();

		foreach ( $templates as $template ) {
			$tRules = $this->getRules( $template->ID );
			$rules  = array_merge( $rules, $tRules );
		}

		$rules = $this->sortRules( $rules );

		$ruleSet = new Brizy_Admin_RuleSet( $rules );

		return $ruleSet;
	}


	private function sortRules( $rules ) {
		// sort the rules by how specific they are
		usort( $rules, function ( $a, $b ) {
			/**
			 * @var Brizy_Admin_Rule $a ;
			 * @var Brizy_Admin_Rule $b ;
			 */

			$la = $a->getRuleWeight( [] );
			$lb = $b->getRuleWeight( [] );
			if ( $lb == $la ) {
				return 0;
			}

			return $la < $lb ? 1 : - 1;
		} );

		return $rules;
	}
//
//	/**
//	 * @param $postType
//	 * @param Brizy_Admin_Rule $rule
//	 *
//	 * @return object|null
//	 */
//	public function validateRuleByPost( $postId, Brizy_Admin_Rule $rule ) {
//		$ruleSet = $this->getAllRulesSet( array(), $postType );
//		foreach ( $ruleSet->getRules() as $arule ) {
//
//			if ( $rule->isEqual( $arule ) ) {
//				return (object) array(
//					'message' => 'The rule is already used',
//					'rule'    => $arule->getId()
//				);
//			}
//		}
//
//		return null;
//	}
//	/**
//	 * @param $postType
//	 * @param Brizy_Admin_Rule $rule
//	 *
//	 * @return object|null
//	 */
//	public function validateRule( $postType, Brizy_Admin_Rule $rule ) {
//		$ruleSet = $this->getAllRulesSet( array(), $postType );
//		foreach ( $ruleSet->getRules() as $arule ) {
//
//			if ( $rule->isEqual( $arule ) ) {
//				return (object) array(
//					'message' => 'The rule is already used',
//					'rule'    => $arule->getId()
//				);
//			}
//		}
//
//		return null;
//	}
//
//	/**
//	 * @param $postType
//	 * @param array $rules
//	 *
//	 * @return array
//	 */
//	public function validateRules( $postType, array $rules ) {
//		// validate rule
//		$ruleSet = $this->getAllRulesSet( array(), $postType );
//		$errors  = array();
//		foreach ( $ruleSet->getRules() as $arule ) {
//			foreach ( $rules as $newRule ) {
//				if ( $newRule->isEqual( $arule ) ) {
//					$errors[] = (object) array(
//						'message' => 'The rule is already used',
//						'rule'    => $arule->getId()
//					);
//				}
//			}
//		}
//
//		if ( count( $errors ) > 0 ) {
//			return $errors;
//		}
//
//		return array();
//	}
}
