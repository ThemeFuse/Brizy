<?php

class BrizyAdminBlocksCookieBannerRuleSetsTest extends \Codeception\TestCase\WPTestCase {
	/**
	 * @var \UnitTester
	 */
	protected $tester;

	/**
	 * [ rule set method, expected rule type ]. Type 1 is include, type 2 is exclude.
	 *
	 * @return array
	 */
	public function ruleSetsData() {
		return [
			'include-all' => [ 'includeAllRules', 1 ],
			'exclude-all' => [ 'excludeAllRules', 2 ],
		];
	}

	/**
	 * @param string $method
	 *
	 * @return Brizy_Admin_Rule[]
	 */
	private function getRuleSet( $method ) {
		$banner = new Brizy_Admin_Blocks_CookieBanner();

		return $banner->$method();
	}

	/**
	 * @dataProvider ruleSetsData
	 */
	public function testRuleSetContainsExactlyOneRule( $method, $type ) {
		$rules = $this->getRuleSet( $method );

		$this->assertTrue( is_array( $rules ), 'The rule set should be a list of rules' );
		$this->assertCount( 1, $rules, 'The rule set should contain exactly one rule' );
		$this->assertInstanceOf( Brizy_Admin_Rule::class, $rules[0] );
	}

	/**
	 * @dataProvider ruleSetsData
	 */
	public function testRuleType( $method, $type ) {
		$rules = $this->getRuleSet( $method );

		$this->assertSame( $type, $rules[0]->getType(), 'The rule type should be ' . $type );
	}

	/**
	 * @dataProvider ruleSetsData
	 */
	public function testRuleAppliedForIsNull( $method, $type ) {
		$rules = $this->getRuleSet( $method );

		$this->assertNull( $rules[0]->getAppliedFor(), 'The rule should apply for everything' );
	}

	/**
	 * @dataProvider ruleSetsData
	 */
	public function testRuleEntityTypeIsEmptyString( $method, $type ) {
		$rules = $this->getRuleSet( $method );

		$this->assertSame( '', $rules[0]->getEntityType(), 'The rule entity type should be an empty string' );
	}

	/**
	 * @dataProvider ruleSetsData
	 */
	public function testRuleEntityValuesIsEmptyList( $method, $type ) {
		$rules = $this->getRuleSet( $method );

		$this->assertSame( [], $rules[0]->getEntityValues(), 'The rule entity values should be an empty list' );
	}

	/**
	 * Applying the same set twice must write the same value, so the rule id is stable.
	 *
	 * @dataProvider ruleSetsData
	 */
	public function testRuleIdIsStable( $method, $type ) {
		$first  = $this->getRuleSet( $method );
		$second = $this->getRuleSet( $method );

		$this->assertNotEmpty( $first[0]->getId() );
		$this->assertSame( $first[0]->getId(), $second[0]->getId(), 'The rule id should not change between calls' );
		$this->assertSame( $first[0]->convertToOptionValue(), $second[0]->convertToOptionValue() );
	}

	public function testIncludeAndExcludeRulesAreDifferent() {
		$include = $this->getRuleSet( 'includeAllRules' );
		$exclude = $this->getRuleSet( 'excludeAllRules' );

		$this->assertNotSame( $include[0]->getId(), $exclude[0]->getId() );
		$this->assertNotSame( $include[0]->getType(), $exclude[0]->getType() );
	}
}
