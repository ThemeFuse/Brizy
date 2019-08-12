<?php


class ProjectTest extends \Codeception\TestCase\WPTestCase {
	/**
	 * @var \IntegrationTester
	 */
	protected $tester;

	public static function tearDownAfterClass(): void {
		global $wpdb;
		@$wpdb->check_connection();
		parent::tearDownAfterClass();
	}

	protected function _before() {
		wp_cache_flush();
	}

	public function testCreatedMetaKeys() {

		Brizy_Editor_Project::get();

		$this->tester->seePostInDatabase( [
			'post_type'      => Brizy_Editor_Project::BRIZY_PROJECT,
			'post_title'     => 'Brizy Project',
			'post_status'    => 'publish',
			'comment_status' => 'closed',
			'ping_status'    => 'closed'
		] );

		$this->tester->seePostMetaInDatabase( [
			'meta_key' => 'brizy-project',
		] );

	}

	public function test_create_post_data() {
		$project = Brizy_Editor_Project::get();
		$data    = $project->create_post_data();

		$this->assertArrayHasKey( 'id', $data, "It should contain key 'id'    " );
		$this->assertArrayHasKey( 'data', $data, "It should contain key 'data'  " );
	}
}