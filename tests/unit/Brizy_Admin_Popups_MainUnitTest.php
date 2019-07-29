<?php


class Brizy_Admin_Popups_MainUnitTest extends \Codeception\Test\Unit {
	/**
	 * @var \UnitTester
	 */
	protected $tester;

	public function testPopulateSupportedPosts() {
		$main  = new Brizy_Admin_Popups_Main();
		$posts = $main->populateSupportedPosts( [] );

		$this->assertEquals( [ Brizy_Admin_Popups_Main::CP_POPUP ], $posts, 'It should insert the supported popup post type' );
	}
}