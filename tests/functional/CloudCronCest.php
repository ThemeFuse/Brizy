<?php


use Prophecy\Prophet;

class CloudCronCest {

	/**
	 * @param FunctionalTester $I
	 */
	public function _before( FunctionalTester $I ) {
		wp_cache_flush();
		@$I->cleanUploadsDir();
		$I->loginAs( 'admin', 'admin' );
		$I->dontHavePostInDatabase( [  ] );
		$I->dontHavePostMetaInDatabase( [] );
	}

	/**
	 * @param FunctionalTester $I
	 *
	 * @throws Exception
	 */
	public function createPostDataTest( FunctionalTester $I ) {
		Brizy_Admin_Cloud_Cron::_init();
		$I->assertTrue( has_action( 'brizy-cloud-synchronize' ), 'Synchronize action must be defined' );
		$I->assertIsInt( wp_next_scheduled( 'brizy-cloud-synchronize' ), 'Synchronize action must be scheduled' );
	}

	public function addBrizyCloudCronSchedulesTest( FunctionalTester $I ) {
		Brizy_Admin_Cloud_Cron::_init();
		$schedules = wp_get_schedules();
		$I->assertTrue( isset( $schedules['5minute'] ), 'It should register 5minute schedule interval' );
		$I->assertEquals( $schedules['5minute']['interval'], 300, 'It should have a 300 seconds interval' );
	}

	public function syncSaveBlockTest( FunctionalTester $I ) {

		// Given
		$I->haveManyPostsInDatabase( 2, [
			'post_type'   => Brizy_Admin_Blocks_Main::CP_SAVED,
			'post_title'  => 'Save {{n}}',
			'post_name'   => 'Save {{n}}',
			'post_status' => 'publish',
			'meta_input'  => [
				'brizy'                       => serialize( [
						"brizy-post" => [
							'compiled_html'      => '',
							'compiled_html_body' => null,
							'compiled_html_head' => null,
							'editor_version'     => null,
							'compiler_version'   => null,
							'plugin_version'     => null,
							'editor_data'        => 'eyJ0eXBlIjoiU2VjdGlvbiIsImJsb2NrSWQiOiJCbGFuazAwMExpZ2h0IiwidmFsdWUiOnsiX3N0eWxlcyI6WyJzZWN0aW9uIl0sIml0ZW1zIjpbeyJ0eXBlIjoiU2VjdGlvbkl0ZW0iLCJ2YWx1ZSI6eyJfc3R5bGVzIjpbInNlY3Rpb24taXRlbSJdLCJpdGVtcyI6W10sIl9pZCI6ImFsYWF5c3dlcnNxa3d0cmhxdGJxdmxjY2lqY3BzYXByaGxtcyJ9fV0sIl9pZCI6InljZ3dsd295d3l1bnRlb2NscWRkdGNyY3FxenVjeGpydWNnZSIsIl90aHVtYm5haWxTcmMiOiJxd2N2d2xzanRmdGR2cHh5Y2xkdXhqbnRkd25pcXR1aGZmaHkiLCJfdGh1bWJuYWlsV2lkdGgiOjYwMCwiX3RodW1ibmFpbEhlaWdodCI6NzAsIl90aHVtYm5haWxUaW1lIjoxNTU5ODkxMDY0OTQzfX0=',
							'brizy-use-brizy'    => true
						],
					]
				),
				'brizy_post_uid'              => 'sffbf00297b0b4e9ee27af32a7b79c333{{n}}',
				'brizy-meta'                  => '{"_thumbnailSrc": "","_thumbnailWidth": 0}',
				'brizy-media'                 => '{"fonts":[],"images":[]}',
				'brizy-post-editor-version'   => '1.0.101',
				'brizy-post-compiler-version' => '1.0.101',
				'brizy-need-compile'          => 0,
				'brizy-cloud-update-required' => 1
			],
		] );

		// When
		$client = $this->getCloudClientObserver( $I );
		$cron   = new Brizy_Admin_Cloud_Cron( $client->reveal() );
		$cron->syncBlocksAction();

		// Then
		$I->seePostMetaInDatabase( [ 'meta_key' => 'brizy-cloud-update-required', 'meta_value' => 0 ] );
	}

	public function syncGlobalBlockTest( FunctionalTester $I ) {

		// Given
		$I->haveManyPostsInDatabase( 2, [
			'post_type'   => Brizy_Admin_Blocks_Main::CP_GLOBAL,
			'post_title'  => 'Save {{n}}',
			'post_name'   => 'Save {{n}}',
			'post_status' => 'publish',
			'meta_input'  => [
				'brizy'                       => serialize( [
						"brizy-post" => [
							'compiled_html'      => '',
							'compiled_html_body' => null,
							'compiled_html_head' => null,
							'editor_version'     => null,
							'compiler_version'   => null,
							'plugin_version'     => null,
							'editor_data'        => 'eyJ0eXBlIjoiU2VjdGlvbiIsImJsb2NrSWQiOiJCbGFuazAwMExpZ2h0IiwidmFsdWUiOnsiX3N0eWxlcyI6WyJzZWN0aW9uIl0sIml0ZW1zIjpbeyJ0eXBlIjoiU2VjdGlvbkl0ZW0iLCJ2YWx1ZSI6eyJfc3R5bGVzIjpbInNlY3Rpb24taXRlbSJdLCJpdGVtcyI6W10sIl9pZCI6ImFsYWF5c3dlcnNxa3d0cmhxdGJxdmxjY2lqY3BzYXByaGxtcyJ9fV0sIl9pZCI6InljZ3dsd295d3l1bnRlb2NscWRkdGNyY3FxenVjeGpydWNnZSIsIl90aHVtYm5haWxTcmMiOiJxd2N2d2xzanRmdGR2cHh5Y2xkdXhqbnRkd25pcXR1aGZmaHkiLCJfdGh1bWJuYWlsV2lkdGgiOjYwMCwiX3RodW1ibmFpbEhlaWdodCI6NzAsIl90aHVtYm5haWxUaW1lIjoxNTU5ODkxMDY0OTQzfX0=',
							'brizy-use-brizy'    => true
						],
					]
				),
				'brizy_post_uid'              => 'sffbf00297b0b4e9ee27af32a7b79c333{{n}}',
				'brizy-meta'                  => '{"_thumbnailSrc": "","_thumbnailWidth": 0}',
				'brizy-media'                 => '{"fonts":[],"images":[]}',
				'brizy-post-editor-version'   => '1.0.101',
				'brizy-post-compiler-version' => '1.0.101',
				'brizy-need-compile'          => 0
			],
		] );


		// When
		$client = $this->getCloudClientObserver( $I );
		$client->createOrUpdateBlock()->shouldNotBeCalled();
		$cron = new Brizy_Admin_Cloud_Cron( $client->reveal() );
		$cron->syncBlocksAction();

		// Then
		$I->dontSeePostMetaInDatabase( [ 'meta_key' => 'brizy-cloud-update-required' ] );
	}


	/**
	 * @param FunctionalTester $I
	 *
	 * @return \Prophecy\Prophecy\ObjectProphecy
	 */
	private function getCloudClientObserver( FunctionalTester $I ) {
		$prophet             = new Prophet();
		$cloudClientObserver = $prophet->prophesize( Brizy_Admin_Cloud_Client::class );

		return $cloudClientObserver;
	}

}