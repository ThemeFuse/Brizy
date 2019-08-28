<?php

class BrizyAdminFileSystemUnitTest extends \Codeception\TestCase\Test {

	/**
	 * @var \UnitTester
	 */
	protected $tester;


	public function testSomeFeature() {

		$fs = Brizy_Admin_FileSystem::instance();

		$this->tester->assertInstanceOf( 'Brizy_Admin_FileSystem', $fs ,'It should return an instance of Brizy_Admin_FileSystem' );

	}


}