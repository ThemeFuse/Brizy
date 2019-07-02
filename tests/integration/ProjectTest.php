<?php


class ProjectTest extends \Codeception\Test\Unit {
	/**
	 * @var \WpunitTester
	 */
	protected $tester;

	protected function _before() {
		global $wpdb;
		@$wpdb->check_connection();
	}

	public function testCreatedMetaKeys() {

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

		$this->tester->seePostMetaInDatabase( [
			'meta_key' => 'brizy-project-globals',
		] );
	}

	public function test_create_post_data() {
		$project = Brizy_Editor_Project::get();
		$data    = $project->create_post_data();

		$this->assertArrayHasKey( 'id', $data, "It should contain key 'id'    " );
		$this->assertArrayHasKey( 'data', $data, "It should contain key 'data'  " );
		$this->assertArrayHasKey( 'fonts', $data, "It should contain key 'fonts' " );
		$this->assertArrayHasKey( 'styles', $data, "It should contain key 'styles'" );

	}

}