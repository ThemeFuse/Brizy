<?php


class Brizy_EditorTest extends \Codeception\TestCase\WPTestCase {
	/**
	 * @var \UnitTester
	 */
	protected $tester;

	public function testPrefix() {
		$prefix = Brizy_Editor::prefix();
		$this->tester->assertEquals( 'brizy', $prefix, 'It should return the default prefix' );

		$prefix = Brizy_Editor::prefix( '_string' );
		$this->tester->assertEquals( 'brizy_string', $prefix, 'It should return brizy_string' );

		$prefix = get_option('brizy_prefix');
		$this->tester->assertEquals( 'brizy', $prefix, 'We should see an option ion database containing the default prefix' );
	}

}