<?php

use \Prophecy\Argument;


class BrizyAdminLayoutManagerTest extends \Codeception\TestCase\WPTestCase {

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

	public function testGetLayouts() {

		// Having
		$layoutUid = md5( time() );
		$layoutId  = $this->tester->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Layouts_Main::CP_LAYOUT,
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
				'brizy_post_uid'              => $layoutUid,
				'brizy-meta'                  => '{"_thumbnailSrc": "","_thumbnailWidth": 0}',
				'brizy-post-editor-version'   => '1.0.101',
				'brizy-post-compiler-version' => '1.0.101',
				'brizy-need-compile'          => 0,
			],
		] );


		$clientObserver = $this->getCloudClientObjserver();
		$clientObserver->getLayouts( Argument::exact( [ 'fields' => [ 'uid', 'meta' ] ] ) )
		               ->willReturn( [
			               [ 'uid' => md5( 'uid' ), 'meta' => 'some meta info' ],
			               [ 'uid' => $layoutUid, 'meta' => 'some meta info' ]
		               ] )
		               ->shouldBeCalled();

		// WHen
		$manager = new Brizy_Admin_Layouts_Manager();
		$entities = $manager->getEntities( [] );
		$layouts = $manager->createResponseForEntities( $entities, [ 'uid', 'meta' ] );

		// Then
		$this->assertCount( 2, $layouts, 'It should return only two layouts' );

		$this->assertEquals( $layoutUid, $layouts[0]['uid'], 'It should return the correct layout uid' );
		$this->assertNotEmpty( $layouts[0]['meta'], 'It should return some meta data' );

		$this->assertEquals( md5( 'uid' ), $layouts[1]['uid'], 'It should return the correct layout uid' );
		$this->assertEquals( 'some meta info', $layouts[1]['meta'], 'It should return the correct layout meta' );
	}
}