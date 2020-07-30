<?php

use \Prophecy\Argument;


class BrizyAdminPopupsManagerTest extends \Codeception\TestCase\WPTestCase {

	/**
	 * @var \IntegrationTester
	 */
	protected $tester;

	protected function _before() {
		wp_cache_flush();
		$this->tester->dontHavePostInDatabase( [] );
	}

	/**
	 * @return \Prophecy\Prophecy\ObjectProphecy
	 */
	private function getCloudClientObjserver() {
		$cloudClientObserver = $this->prophesize( Brizy_Admin_Cloud_Client::class );

		return $cloudClientObserver;
	}

	public function testGetGlobalBlocks() {

		// Having
		$popupUid = md5( time() );
		$popupId  = $this->tester->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Popups_Main::CP_GLOBAL_POPUP,
			'post_title'  => 'Global',
			'post_name'   => 'Global',
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
				'brizy_post_uid'              => $popupUid,
				'brizy-meta'                  => '{"_thumbnailSrc": "","_thumbnailWidth": 0}',
				'brizy-post-editor-version'   => '1.0.101',
				'brizy-post-compiler-version' => '1.0.101',
				'brizy-need-compile'          => 0
			],
		] );

		$clientObserver = $this->getCloudClientObjserver();
		$clientObserver->getPopups( Argument::any() )->shouldNotBeCalled();

		// WHen
		$manager = new Brizy_Admin_Popups_Manager( $clientObserver->reveal() );
		$popups  = $manager->getAllPopups( Brizy_Admin_Popups_Main::CP_GLOBAL_POPUP, [], [ 'uid', 'meta' ] );

		// Then
		foreach ( $popups as $popup ) {
			$this->assertEquals( $popupUid, $popup['uid'], 'It should return the correct popup uid' );
			$this->assertNotEmpty( $popup['meta'], 'It should return some data' );
		}

	}

	public function testGetSavedBlocks() {

		// Having
		$popupUid = md5( time() );
		$popupId  = $this->tester->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Popups_Main::CP_POPUP,
			'post_title'  => 'Global',
			'post_name'   => 'Global',
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
							'brizy-use-brizy'    => true,
						],
					]
				),
				'brizy_post_uid'              => $popupUid,
				'brizy-meta'                  => '{"_thumbnailSrc": "","_thumbnailWidth": 0}',
				'brizy-post-editor-version'   => '1.0.101',
				'brizy-post-compiler-version' => '1.0.101',
				'brizy-need-compile'          => 0,
			],
		] );


		$clientObserver = $this->getCloudClientObjserver();
		$clientObserver->getPopups( Argument::exact( [ 'fields' => [ 'uid', 'meta' ] ] ) )
		               ->willReturn( [
			               [ 'uid' => md5( 'uid' ), 'meta' => 'some meta info' ],
			               [ 'uid' => $popupUid, 'meta' => 'some meta info' ]
		               ] )
		               ->shouldBeCalled();

		// WHen
		$manager = new Brizy_Admin_Popups_Manager( $clientObserver->reveal() );
		$popups  = $manager->getAllPopups( Brizy_Admin_Popups_Main::CP_POPUP,  [], [ 'uid', 'meta' ] );

		// Then
		$this->assertCount( 2, $popups, 'It should return only two popups' );

		$this->assertEquals( $popupUid, $popups[0]['uid'], 'It should return the correct popup uid' );
		$this->assertNotEmpty( $popups[0]['meta'], 'It should return some meta data' );

		$this->assertEquals( md5( 'uid' ), $popups[1]['uid'], 'It should return the correct popup uid' );
		$this->assertEquals( 'some meta info', $popups[1]['meta'], 'It should return the correct popup meta' );
	}
}