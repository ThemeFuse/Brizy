<?php

use \Prophecy\Argument;

class BrizyAdminCloudPopupBridgeTest extends \Codeception\TestCase\WPTestCase {

	/**
	 * @var \IntegrationTester
	 */
	protected $tester;

	protected function _before() {
		wp_cache_flush();
		$this->tester->dontHavePostInDatabase( [ ] );
	}


	/**
	 * @return \Prophecy\Prophecy\ObjectProphecy
	 */
	private function getCloudClientObserver() {
		$cloudClientObserver = $this->prophesize( Brizy_Admin_Cloud_Client::class );

		return $cloudClientObserver;
	}

	public function testImportInvalidMediaPopup() {

		$this->expectException( \Exception::class );

		$popupObserver = $this->prophesize( Brizy_Editor_Popup::class );
		$popupObserver->getMedia()->willReturn( json_encode( (object) [] ) )->shouldBeCalled();
		$client = $this->getCloudClientObserver();

		$bridge = new Brizy_Admin_Cloud_BlockBridge( $client->reveal() );
		$bridge->export( $popupObserver->reveal() );
	}

	public function testExport() {

		$popupId = $this->tester->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Popups_Main::CP_POPUP,
			'post_title'  => 'Save',
			'post_name'   => 'Save',
			'post_status' => 'publish',
			'meta_input'  => [
				'brizy'                             => serialize( [
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
				'brizy_post_meta'                   => 'sffbf00297b0b4e9ee27af32a7b79c333',
				'brizy_post_uid'                    => 'sffbf00297b0b4e9ee27af32a7b79c333',
				'brizy-post-editor-version'         => '1.0.101',
				'brizy-post-compiler-version'       => '1.0.101',
				'brizy-need-compile'                => 0,
				'brizy-cloud-update-required' => 1
			],
		] );


		$popup = Brizy_Editor_Popup::get( $popupId );

		$file           = codecept_data_dir( 'images/cat.jpeg' );
		$attachmentId   = (int) $this->tester->haveAttachmentInDatabase( $file, null, [
			'meta_input' => [
				'brizy_attachment_uid' => $mediaUid = md5( time() )
			],
		] );
		$attachmentPath = get_attached_file( $attachmentId );

		$fontUid  = md5( 'fontUid' );
		$family   = 'font-family';
		$fontType = 'uploaded';

		$fontWeights = [
			'400' => [
				'eot'  => [
					'name'     => basename( codecept_data_dir( 'fonts/pn-regular-webfont.eot' ) ),
					'type'     => 'application/x-font-ttf',
					'tmp_name' => $this->tester->makeTemporaryFile( codecept_data_dir( 'fonts/pn-regular-webfont.eot' ) ),
					'error'    => 0,
					'size'     => filesize( codecept_data_dir( 'fonts/pn-regular-webfont.eot' ) )
				],
				'woff' => [
					'name'     => basename( codecept_data_dir( 'fonts/pn-medium-webfont.woff' ) ),
					'type'     => 'application/font-woff',
					'tmp_name' => $this->tester->makeTemporaryFile( codecept_data_dir( 'fonts/pn-medium-webfont.woff' ) ),
					'error'    => 0,
					'size'     => filesize( codecept_data_dir( 'fonts/pn-medium-webfont.woff' ) )
				]
			],
			'700' => [
				'eot'  => [
					'name'     => basename( codecept_data_dir( 'fonts/pn-regular-webfont.eot' ) ),
					'type'     => 'application/vnd.ms-fontobject',
					'tmp_name' => $this->tester->makeTemporaryFile( codecept_data_dir( 'fonts/pn-regular-webfont.eot' ) ),
					'error'    => 0,
					'size'     => filesize( codecept_data_dir( 'fonts/pn-regular-webfont.eot' ) )
				],
				'woff' => [
					'name'     => basename( codecept_data_dir( 'fonts/pn-bold-webfont.woff' ) ),
					'type'     => 'application/font-woff',
					'tmp_name' => $this->tester->makeTemporaryFile( codecept_data_dir( 'fonts/pn-bold-webfont.woff' ) ),
					'error'    => 0,
					'size'     => filesize( codecept_data_dir( 'fonts/pn-bold-webfont.woff' ) )
				]
			]
		];

		$fontManager = new Brizy_Admin_Fonts_Manager();
		$fontManager->createFont( $fontUid, $family, $fontWeights, $fontType );

		$popup->setMeta( json_encode( (object) [] ) );
		$popup->setMedia( json_encode( [ 'images' => [ $mediaUid ], 'fonts' => [ $fontUid ] ] ) );

		$font = $fontManager->getFontForExport( $fontUid );


		$client = $this->getCloudClientObserver();
		//$client->isMediaUploaded( Argument::exact( $mediaUid ) )->shouldBeCalled();
		$client->uploadMedia( Argument::exact( $mediaUid ), Argument::exact( $attachmentPath ) )->shouldBeCalled();
		$client->createFont( $font )->willReturn(true)->shouldBeCalled();
		$client->createOrUpdatePopup( $popup )->willReturn(true)->shouldBeCalled();

		$bridge = new Brizy_Admin_Cloud_PopupBridge( $client->reveal() );
		$bridge->export( $popup );
	}
}