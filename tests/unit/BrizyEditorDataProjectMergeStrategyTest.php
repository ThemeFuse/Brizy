<?php

class BrizyEditorDataProjectMergeStrategyTest extends \Codeception\TestCase\WPTestCase {
	/**
	 * @var \UnitTester
	 */
	protected $tester;

	protected function _before() {
		wp_cache_flush();
		global $wpdb;
		$wpdb->db_connect();
	}

	public function testGetMergerInstance() {

		$this->assertInstanceOf( Brizy_Editor_Data_ProjectMerge81::class,
			\Brizy_Editor_Data_ProjectMergeStrategy::getMergerInstance( '1.0.70' ),
			'It should return an instance of  Brizy_Editor_Data_ProjectMerger81' );

		$this->assertInstanceOf( Brizy_Editor_Data_ProjectMerge81::class,
			\Brizy_Editor_Data_ProjectMergeStrategy::getMergerInstance( '1.0.81' ),
			'It should return an instance of  Brizy_Editor_Data_ProjectMerger81' );

		$this->assertInstanceOf( Brizy_Editor_Data_ProjectMerge81::class,
			\Brizy_Editor_Data_ProjectMergeStrategy::getMergerInstance( '1.0.81-beta1' ),
			'It should return an instance of  Brizy_Editor_Data_ProjectMerger81' );

		$this->assertInstanceOf( Brizy_Editor_Data_ProjectMerge82::class,
			\Brizy_Editor_Data_ProjectMergeStrategy::getMergerInstance( '1.0.82' ),
			'It should return an instance of  Brizy_Editor_Data_ProjectMerger82' );

		$this->assertInstanceOf( Brizy_Editor_Data_ProjectMerge82::class,
			\Brizy_Editor_Data_ProjectMergeStrategy::getMergerInstance( '1.0.82-beta' ),
			'It should return an instance of  Brizy_Editor_Data_ProjectMerger82' );

		$this->assertInstanceOf( Brizy_Editor_Data_ProjectMerge82::class,
			\Brizy_Editor_Data_ProjectMergeStrategy::getMergerInstance( '1.0.83' ),
			'It should return an instance of  Brizy_Editor_Data_ProjectMerger82' );
	}

}