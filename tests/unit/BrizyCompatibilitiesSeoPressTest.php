<?php

class BrizyCompatibilitiesSeoPressTest extends \Codeception\TestCase\WPTestCase {
	/**
	 * @var \UnitTester
	 */
	protected $tester;

	protected function _before() {
		wp_cache_flush();
	}

	public function testFixRewriteRules(  ) {
		$seoPress = new Brizy_Compatibilities_SeoPress();

		// ----------------------------------------------

		$newRules = $seoPress->fixRewriteRules( [
			'(weekly)(/page/(\d+))?(?:/bpage/([0-9]{1,}))/?$' => 'index.php?category_name=$matches[1]&paged=1&bpage=$matches[3]'
		] );

		$this->tester->assertCount( 1,$newRules,'It should return exact one rule' );
		$this->tester->assertArrayHasKey( '(weekly)(?:/page/(\d+))?(?:/bpage/([0-9]{1,}))/?$',$newRules,'It should return exact one rule' );


		// ----------------------------------------------

		$newRules = $seoPress->fixRewriteRules( [
			'(unkategorisiert)(/page/(\d+))?(?:/bpage/([0-9]{1,}))/?$' => 'index.php?category_name=$matches[1]&paged=1&bpage=$matches[3]'
		] );

		$this->tester->assertCount( 1,$newRules,'It should return exact one rule' );
		$this->tester->assertArrayHasKey( '(unkategorisiert)(?:/page/(\d+))?(?:/bpage/([0-9]{1,}))/?$',$newRules,'It should return exact one rule' );

		// ----------------------------------------------

		$newRules = $seoPress->fixRewriteRules( [
			'(unkategorisiert)(/page/(\d+))?(?:/bpage/([0-9]{1,}))/?$' => 'index.php?category_name=$matches[1]&paged=1&bpage=$matches[3]',
			'(weekly)(/page/(\d+))?(?:/bpage/([0-9]{1,}))/?$' => 'index.php?category_name=$matches[1]&paged=1&bpage=$matches[3]',
			'editor-popup/[^/]+/([^/]+)/embed(?:/bpage/([0-9]{1,}))/?$' => 'index.php?category_name=$matches[1]&paged=1&bpage=$matches[3]'
		] );

		$this->tester->assertCount( 3,$newRules,'It should return exact one rule' );
		$this->tester->assertArrayHasKey( '(unkategorisiert)(?:/page/(\d+))?(?:/bpage/([0-9]{1,}))/?$',$newRules,'It should return exact one rule' );
		$this->tester->assertArrayHasKey( '(weekly)(?:/page/(\d+))?(?:/bpage/([0-9]{1,}))/?$',$newRules,'It should return exact one rule' );
	}
}
