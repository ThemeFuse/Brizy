<?php

class BrizyAdminRuleTest extends \Codeception\TestCase\Test {
	/**
	 * @var \UnitTester
	 */
	protected $tester;


	public function validMatches() {
		$incl   = Brizy_Admin_Rule::TYPE_INCLUDE;
		$templ  = Brizy_Admin_Rule::TEMPLATE;
		$taxon  = Brizy_Admin_Rule::TAXONOMY;
		$btempl = Brizy_Admin_Rule::BRIZY_TEMPLATE;

		return [
			[
				new \Brizy_Admin_Rule( 1, $incl, Brizy_Admin_Rule::POSTS, 'post', [] ),
				[ 'applyFor' => Brizy_Admin_Rule::POSTS, 'entityType' => 'post', 'entityValues' => [ 1 ] ],
				true
			],
			[
				new \Brizy_Admin_Rule( 1, $incl, Brizy_Admin_Rule::POSTS, 'post', [ 1, 2, 3 ] ),
				[ 'applyFor' => Brizy_Admin_Rule::POSTS, 'entityType' => 'post', 'entityValues' => [ 1 ] ],
				true
			],
			[
				new \Brizy_Admin_Rule( 1, $incl, Brizy_Admin_Rule::POSTS, 'post', [ 1, 2, 3 ] ),
				[ 'applyFor' => Brizy_Admin_Rule::POSTS, 'entityType' => 'post', 'entityValues' => [ 5 ] ],
				false
			],
			[
				new \Brizy_Admin_Rule( 1, $incl, $taxon, 'category', [] ),
				[ 'applyFor' => $taxon, 'entityType' => 'category', 'entityValues' => [ 1 ] ],
				true
			],
			[
				new \Brizy_Admin_Rule( 1, $incl, $taxon, 'category', [ 1, 2, 3, 4 ] ),
				[ 'applyFor' => $taxon, 'entityType' => 'category', 'entityValues' => [ 1 ] ],
				true
			],
			[
				new \Brizy_Admin_Rule( 1, $incl, $taxon, 'category', [ 1, 2, 3, 4 ] ),
				[ 'applyFor' => $taxon, 'entityType' => 'category', 'entityValues' => [ 5 ] ],
				false
			],
			[
				new \Brizy_Admin_Rule( 1, $incl, $taxon, 'post_tag', [] ),
				[ 'applyFor' => $taxon, 'entityType' => 'post_tag', 'entityValues' => [ 1 ] ],
				true
			],
			[
				new \Brizy_Admin_Rule( 1, $incl, $taxon, 'post_tag', [ 1, 2, 3 ] ),
				[ 'applyFor' => $taxon, 'entityType' => 'post_tag', 'entityValues' => [ 1 ] ],
				true
			],
			[
				new \Brizy_Admin_Rule( 1, $incl, $taxon, 'post_tag', [ 1, 2, 3 ] ),
				[ 'applyFor' => $taxon, 'entityType' => 'post_tag', 'entityValues' => [ 5 ] ],
				false
			],
			[
				new \Brizy_Admin_Rule( 2, $incl, $templ, 'author', [] ),
				[ 'applyFor' => $templ, 'entityType' => 'author', 'entityValues' => [ 1 ] ],
				true
			],
			[
				new \Brizy_Admin_Rule( 2, $incl, $templ, 'search', [] ),
				[ 'applyFor' => $templ, 'entityType' => 'search', 'entityValues' => [] ],
				true
			],
			[
				new \Brizy_Admin_Rule( 2, $incl, $templ, 'front_page', [] ),
				[ 'applyFor' => $templ, 'entityType' => 'front_page', 'entityValues' => [] ],
				true
			],
			[
				new \Brizy_Admin_Rule( 2, $incl, $templ, 'home_page', [] ),
				[ 'applyFor' => $templ, 'entityType' => 'home_page', 'entityValues' => [] ],
				true
			],

			[
				new \Brizy_Admin_Rule( 2, $incl, $templ, '404', [] ),
				[ 'applyFor' => $templ, 'entityType' => '404', 'entityValues' => [] ],
				true
			],
			[
				new \Brizy_Admin_Rule( 2, $incl, $btempl, 'brizy_template', [] ),
				[ 'applyFor' => $btempl, 'entityType' => 'brizy_template', 'entityValues' => [] ],
				true
			],
			[
				new \Brizy_Admin_Rule( 1, $incl, Brizy_Admin_Rule::POSTS, 'post', [ "category|2" ] ),
				[ 'applyFor' => Brizy_Admin_Rule::POSTS, 'entityType' => 'post', 'entityValues' => [ 1 ] ],
				true
			],
			[
				new \Brizy_Admin_Rule( 1, $incl, Brizy_Admin_Rule::POSTS, 'post', [ "post_tag|2" ] ),
				[ 'applyFor' => Brizy_Admin_Rule::POSTS, 'entityType' => 'post', 'entityValues' => [ 1 ] ],
				true
			],
			[
				new \Brizy_Admin_Rule( 1, $incl, Brizy_Admin_Rule::POSTS, 'post', [ "post_tag|2" ] ),
				[ 'applyFor' => Brizy_Admin_Rule::POSTS, 'entityType' => 'page', 'entityValues' => [ 1 ] ],
				false
			],
		];
	}

	/**
	 * @param Brizy_Admin_Rule $rule
	 * @param $context
	 * @param $valid
	 *
	 * @dataProvider validMatches
	 */
	public function testIsMatching( \Brizy_Admin_Rule $rule, $context, $valid ) {

		/**
		 * @var string $applyFor
		 * @var string $entityType
		 * @var array $entityValues
		 */
		extract( $context );

		$validated = $rule->isMatching( $applyFor, $entityType, $entityValues );

		$this->tester->assertEquals( $validated, $valid, 'The context should match. ' . json_encode( $context ) );

	}
}