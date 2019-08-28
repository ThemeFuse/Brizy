<?php

class BrizyAdminFileSystemTest extends \Codeception\Test\Unit {

	/**
	 * @var \IntegrationTester
	 */
	protected $tester;


	public function testInstance() {

		$fs = Brizy_Admin_FileSystem::instance();

		$this->tester->assertInstanceOf( 'Brizy_Admin_FileSystem', $fs ,'It should return an instance of Brizy_Admin_FileSystem' );

	}


}