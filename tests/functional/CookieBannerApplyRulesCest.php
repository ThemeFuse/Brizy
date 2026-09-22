<?php

class CookieBannerApplyRulesCest {

	/**
	 * @var Brizy_Admin_Blocks_CookieBanner
	 */
	private $banner;

	/**
	 * @var Brizy_Admin_Rules_Manager
	 */
	private $rulesManager;

	/**
	 * @var int
	 */
	private $blockId;

	/**
	 * @var Brizy_Admin_Rule[]
	 */
	private $customRules;

	/**
	 * @param FunctionalTester $I
	 */
	protected function _before( FunctionalTester $I ) {
		wp_cache_flush();
		wp_set_current_user( 1 );

		$I->dontHavePostInDatabase( [ 'post_type' => Brizy_Admin_Blocks_Main::CP_GLOBAL, ] );
		Brizy_Editor_Block::cleanClassCache();

		$this->banner       = new Brizy_Admin_Blocks_CookieBanner();
		$this->rulesManager = new Brizy_Admin_Rules_Manager();
		$this->blockId      = $I->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Blocks_Main::CP_GLOBAL,
			'post_title'  => 'Cookie Banner',
			'post_name'   => 'cookie-banner',
			'post_status' => 'publish',
			'meta_input'  => [
				'brizy_post_uid' => $this->banner->getUid(),
			],
		] );

		$pageId   = $I->havePostInDatabase( [ 'post_type' => 'page', 'post_title' => 'Page X', 'post_status' => 'publish' ] );
		$category = $I->haveTermInDatabase( 'Category Y ' . uniqid(), 'category' );

		// custom rules, as added in the editor: include page X and exclude category Y
		$this->customRules = [
			new Brizy_Admin_Rule( null, Brizy_Admin_Rule::TYPE_INCLUDE, Brizy_Admin_Rule::POSTS, 'page', [ $pageId ] ),
			new Brizy_Admin_Rule( null, Brizy_Admin_Rule::TYPE_EXCLUDE, Brizy_Admin_Rule::TAXONOMY, 'category', [ $category[0] ] ),
		];

		wp_cache_flush();
	}

	/**
	 * @param Brizy_Admin_Rule[] $rules
	 */
	private function seedRules( array $rules ) {
		$this->rulesManager->setRules( $this->blockId, $rules );
		wp_cache_flush();
	}

	/**
	 * @return Brizy_Admin_Rule[]
	 */
	private function readRules() {
		wp_cache_flush();

		return $this->rulesManager->getRules( $this->blockId );
	}

	/**
	 * @param FunctionalTester $I
	 * @param Brizy_Admin_Rule[] $expected
	 * @param Brizy_Admin_Rule[] $actual
	 */
	private function assertSameRuleSet( FunctionalTester $I, array $expected, array $actual ) {
		$I->assertCount( count( $expected ), $actual, 'The block should have exactly the applied rules' );

		foreach ( array_values( $expected ) as $i => $rule ) {
			$I->assertSame( $rule->getType(), $actual[ $i ]->getType(), 'The rule type should match' );
			$I->assertSame( $rule->getAppliedFor(), $actual[ $i ]->getAppliedFor(), 'The rule appliedFor should match' );
			$I->assertSame( $rule->getEntityType(), $actual[ $i ]->getEntityType(), 'The rule entityType should match' );
			$I->assertSame( $rule->getEntityValues(), $actual[ $i ]->getEntityValues(), 'The rule entityValues should match' );
		}
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testApplyReplacesCustomRules( FunctionalTester $I ) {
		$this->seedRules( $this->customRules );
		$I->assertCount( 2, $this->readRules() );

		$result = $this->banner->applyRules( $this->blockId, $this->banner->includeAllRules() );
		$rules  = $this->readRules();

		$I->assertTrue( $result, 'Apply should report success' );
		$I->assertCount( 1, $rules, 'Only the applied rule should be left' );
		$I->assertSame( Brizy_Admin_Rule::TYPE_INCLUDE, $rules[0]->getType() );
		$I->assertNull( $rules[0]->getAppliedFor() );
		$I->assertSame( '', $rules[0]->getEntityType() );
		$I->assertSame( [], $rules[0]->getEntityValues() );

		foreach ( $rules as $rule ) {
			foreach ( $this->customRules as $custom ) {
				$I->assertFalse( $rule->isEqual( $custom ), 'The custom rules should be gone' );
			}
		}
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testSwitchFromIncludeAllToExcludeAll( FunctionalTester $I ) {
		$I->assertTrue( $this->banner->applyRules( $this->blockId, $this->banner->includeAllRules() ) );

		$result = $this->banner->applyRules( $this->blockId, $this->banner->excludeAllRules() );
		$rules  = $this->readRules();

		$I->assertTrue( $result );
		$I->assertCount( 1, $rules );
		$I->assertSame( Brizy_Admin_Rule::TYPE_EXCLUDE, $rules[0]->getType() );
		$this->assertSameRuleSet( $I, $this->banner->excludeAllRules(), $rules );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testSwitchFromExcludeAllToIncludeAll( FunctionalTester $I ) {
		$I->assertTrue( $this->banner->applyRules( $this->blockId, $this->banner->excludeAllRules() ) );

		$result = $this->banner->applyRules( $this->blockId, $this->banner->includeAllRules() );
		$rules  = $this->readRules();

		$I->assertTrue( $result );
		$I->assertCount( 1, $rules );
		$I->assertSame( Brizy_Admin_Rule::TYPE_INCLUDE, $rules[0]->getType() );
		$this->assertSameRuleSet( $I, $this->banner->includeAllRules(), $rules );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testApplyingTheSameSetTwiceIsIdempotent( FunctionalTester $I ) {
		$this->seedRules( $this->customRules );

		$first = $this->banner->applyRules( $this->blockId, $this->banner->includeAllRules() );
		wp_cache_flush();
		$metaAfterFirst = get_post_meta( $this->blockId, 'brizy-rules', true );

		$second = $this->banner->applyRules( $this->blockId, $this->banner->includeAllRules() );
		wp_cache_flush();
		$metaAfterSecond = get_post_meta( $this->blockId, 'brizy-rules', true );

		$I->assertTrue( $first );
		$I->assertTrue( $second );
		$I->assertSame( $metaAfterFirst, $metaAfterSecond, 'The stored rules should be identical after the second apply' );
		$this->assertSameRuleSet( $I, $this->banner->includeAllRules(), $this->readRules() );
	}

	/**
	 * The meta update reports false for an unchanged value; apply must still succeed.
	 *
	 * @param FunctionalTester $I
	 */
	public function testApplyingASetTheBlockAlreadyHasSucceeds( FunctionalTester $I ) {
		$this->seedRules( $this->banner->excludeAllRules() );

		$writes  = 0;
		$blockId = $this->blockId;
		$counter = function ( $metaId, $objectId, $metaKey ) use ( &$writes, $blockId ) {
			if ( (int) $objectId === (int) $blockId && $metaKey === 'brizy-rules' ) {
				$writes ++;
			}
		};

		add_action( 'updated_post_meta', $counter, 10, 3 );
		add_action( 'added_post_meta', $counter, 10, 3 );
		try {
			$result = $this->banner->applyRules( $this->blockId, $this->banner->excludeAllRules() );
		} finally {
			remove_action( 'updated_post_meta', $counter, 10 );
			remove_action( 'added_post_meta', $counter, 10 );
		}

		$I->assertTrue( $result, 'An unchanged value is not a failure' );
		$I->assertSame( 0, $writes, 'The value was already stored, so nothing was written' );
		$this->assertSameRuleSet( $I, $this->banner->excludeAllRules(), $this->readRules() );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testApplyFailsWhenTheWriteDoesNotHappen( FunctionalTester $I ) {
		$this->seedRules( $this->customRules );

		$blockId      = $this->blockId;
		$shortCircuit = function ( $check, $objectId, $metaKey ) use ( $blockId ) {
			return ( (int) $objectId === (int) $blockId && $metaKey === 'brizy-rules' ) ? false : $check;
		};

		add_filter( 'update_post_metadata', $shortCircuit, 10, 3 );
		try {
			$result = $this->banner->applyRules( $this->blockId, $this->banner->includeAllRules() );
		} finally {
			remove_filter( 'update_post_metadata', $shortCircuit, 10 );
		}

		$I->assertFalse( $result, 'Apply should report failure when the rules read back differ' );
		$I->assertCount( 2, $this->readRules(), 'The custom rules are still stored' );
	}

	/**
	 * Each alteration changes the rules read back after the write.
	 *
	 * @return array
	 */
	private function readBackAlterations() {
		return [
			'type'         => function ( $rule ) {
				$rule['type'] = Brizy_Admin_Rule::TYPE_EXCLUDE;

				return [ $rule ];
			},
			'appliedFor'   => function ( $rule ) {
				$rule['appliedFor'] = Brizy_Admin_Rule::POSTS;

				return [ $rule ];
			},
			'entityType'   => function ( $rule ) {
				$rule['entityType'] = 'page';

				return [ $rule ];
			},
			'entityValues' => function ( $rule ) {
				$rule['entityValues'] = [ 123 ];

				return [ $rule ];
			},
			'extra rule'   => function ( $rule ) {
				$extra               = $rule;
				$extra['id']         = 'extra';
				$extra['type']       = Brizy_Admin_Rule::TYPE_EXCLUDE;
				$extra['appliedFor'] = Brizy_Admin_Rule::POSTS;
				$extra['entityType'] = 'post';

				return [ $rule, $extra ];
			},
		];
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testApplyFailsWhenTheRulesReadBackDiffer( FunctionalTester $I ) {
		$blockId = $this->blockId;

		foreach ( $this->readBackAlterations() as $field => $alter ) {
			$this->seedRules( $this->customRules );

			$alterReadBack = function ( $check, $objectId, $metaKey, $single ) use ( $blockId, $alter ) {
				if ( (int) $objectId !== (int) $blockId || $metaKey !== 'brizy-rules' ) {
					return $check;
				}
				$applied = [ 'id' => 'cb', 'type' => 1, 'appliedFor' => null, 'entityType' => '', 'entityValues' => [], 'mode' => null ];

				// get_metadata() returns the first element for a single value
				return [ $alter( $applied ) ];
			};

			add_filter( 'get_post_metadata', $alterReadBack, 10, 4 );
			try {
				$result = $this->banner->applyRules( $this->blockId, $this->banner->includeAllRules() );
			} finally {
				remove_filter( 'get_post_metadata', $alterReadBack, 10 );
			}

			$I->assertFalse( $result, "Apply should report failure when the read-back {$field} differs" );
		}
	}

	/**
	 * Rule ids are not part of the comparison: equal fields mean success.
	 *
	 * @param FunctionalTester $I
	 */
	public function testApplySucceedsWhenOnlyTheRuleIdDiffers( FunctionalTester $I ) {
		$blockId  = $this->blockId;
		$readBack = function ( $check, $objectId, $metaKey ) use ( $blockId ) {
			if ( (int) $objectId !== (int) $blockId || $metaKey !== 'brizy-rules' ) {
				return $check;
			}

			return [ [ [ 'id' => 'another-id', 'type' => 1, 'appliedFor' => null, 'entityType' => '', 'entityValues' => [], 'mode' => null ] ] ];
		};

		add_filter( 'get_post_metadata', $readBack, 10, 3 );
		try {
			$result = $this->banner->applyRules( $this->blockId, $this->banner->includeAllRules() );
		} finally {
			remove_filter( 'get_post_metadata', $readBack, 10 );
		}

		$I->assertTrue( $result );
	}
}
