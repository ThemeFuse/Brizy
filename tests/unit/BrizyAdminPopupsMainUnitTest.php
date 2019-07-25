<?php


class BrizyAdminPopupsMainUnitTest extends \Codeception\Test\Unit {
	/**
	 * @var \UnitTester
	 */
	protected $tester;

	protected function _before() {
	}

	protected function _after() {
	}

	public function testPopulateSupportedPosts() {
		$main  = new Brizy_Admin_Popups_Main();
		$posts = $main->populateSupportedPosts([]);


		$this->assertEquals([Brizy_Admin_Popups_Main::CP_POPUP],$posts,'It should insert the supported popup post type');
	}
}