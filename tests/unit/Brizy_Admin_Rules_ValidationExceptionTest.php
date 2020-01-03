<?php


class Brizy_Admin_Rules_ValidationExceptionTest extends \Codeception\TestCase\WPTestCase{

	/**
	 * @var \UnitTester
	 */
	protected $tester;

	protected function _before() {
		wp_cache_flush();
		global $wpdb;
		$wpdb->db_connect();
	}

	public function testExceptionRuleId() {
		$exception = new Brizy_Admin_Rules_ValidationException( 1, "test", 100 );

		$this->assertEquals( 1, $exception->getRuleId(), 'It should return the correct rule id' );
		$this->assertEquals( 'test', $exception->getMessage(), 'It should return the correct message' );
		$this->assertEquals( 100, $exception->getCode(), 'It should return the correct code' );
	}
}
