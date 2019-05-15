<?php

use \Prophecy\Argument;
use Prophecy\Prophet;

class BlockBridgeCest {

	protected function _before( FunctionalTester $I ) {
		wp_cache_flush();
		$I->dontHavePostInDatabase( [] );
	}


	/**
	 * @return \Prophecy\Prophecy\ObjectProphecy
	 */
	private function getCloudClientObserver() {
		$prophet             = new Prophet();
		$cloudClientObserver = $prophet->prophesize( Brizy_Admin_Cloud_Client::class );

		return $cloudClientObserver;
	}

	public function testImport( FunctionalTester $I ) {


		$blockId   = md5( 'block' );
		$client    = $this->getCloudClientObserver();
		$fakeBlock = [
			'uid'  => $blockId,
			'id'   => $blockId,
			'meta' => 'some data',
			'data' => 'some data'
		];
		$client->getBlocks( [ 'filter' => [ 'uid' => $blockId ] ] )
		       ->willReturn( [
			       $fakeBlock
		       ] )
		       ->shouldBeCalled();

		$bridge = new Brizy_Admin_Cloud_BlockBridge( $client->reveal() );
		$bridge->import( $blockId );

		$I->seePostInDatabase( [
			'post_type' => Brizy_Admin_Blocks_Main::CP_SAVED
		] );

		$I->seePostMetaInDatabase( [
			'meta_key'   => 'brizy_post_uid',
			'meta_value' => $blockId
		] );


	}

	public function testImportInvalidMediaBlock( FunctionalTester $I ) {
		$prophet       = new Prophet();
		$blockObserver = $prophet->prophesize( Brizy_Editor_Block::class );
		$blockObserver->getMedia()->willReturn( json_encode( (object) [] ) )->shouldBeCalled();
		$client = $this->getCloudClientObserver();

		$bridge = new Brizy_Admin_Cloud_BlockBridge( $client->reveal() );

		$I->expectThrowable( 'Exception', function () use ( $bridge, $blockObserver ) {
			$bridge->export( $blockObserver->reveal() );
		} );


	}

	public function testExport( FunctionalTester $I ) {

		$blockId = $I->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Blocks_Main::CP_SAVED,
			'post_title'  => 'Save',
			'post_name'   => 'Save',
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
				'brizy_post_meta'             => 'sffbf00297b0b4e9ee27af32a7b79c333',
				'brizy_post_uid'              => 'sffbf00297b0b4e9ee27af32a7b79c333',
				'brizy-post-editor-version'   => '1.0.101',
				'brizy-post-compiler-version' => '1.0.101',
				'brizy-need-compile'          => 0,
				'brizy-cloud-update-required' => 1
			],
		] );

		$block = Brizy_Editor_Block::get( $blockId );

		$file           = codecept_data_dir( 'images/cat.jpeg' );
		$attachmentId   = (int) $I->haveAttachmentInDatabase( $file, null, [
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
					'tmp_name' => $I->makeTemporaryFile( codecept_data_dir( 'fonts/pn-regular-webfont.eot' ) ),
					'error'    => 0,
					'size'     => filesize( codecept_data_dir( 'fonts/pn-regular-webfont.eot' ) )
				],
				'woff' => [
					'name'     => basename( codecept_data_dir( 'fonts/pn-medium-webfont.woff' ) ),
					'type'     => 'application/font-woff',
					'tmp_name' => $I->makeTemporaryFile( codecept_data_dir( 'fonts/pn-medium-webfont.woff' ) ),
					'error'    => 0,
					'size'     => filesize( codecept_data_dir( 'fonts/pn-medium-webfont.woff' ) )
				]
			],
			'700' => [
				'eot'  => [
					'name'     => basename( codecept_data_dir( 'fonts/pn-regular-webfont.eot' ) ),
					'type'     => 'application/vnd.ms-fontobject',
					'tmp_name' => $I->makeTemporaryFile( codecept_data_dir( 'fonts/pn-regular-webfont.eot' ) ),
					'error'    => 0,
					'size'     => filesize( codecept_data_dir( 'fonts/pn-regular-webfont.eot' ) )
				],
				'woff' => [
					'name'     => basename( codecept_data_dir( 'fonts/pn-bold-webfont.woff' ) ),
					'type'     => 'application/font-woff',
					'tmp_name' => $I->makeTemporaryFile( codecept_data_dir( 'fonts/pn-bold-webfont.woff' ) ),
					'error'    => 0,
					'size'     => filesize( codecept_data_dir( 'fonts/pn-bold-webfont.woff' ) )
				]
			]
		];

		$fontManager = new Brizy_Admin_Fonts_Manager();
		$fontManager->createFont( $fontUid, $family, $fontWeights, $fontType );

		$block->setMeta( json_encode( (object) [] ) );
		$block->setMedia( json_encode( [ 'images' => [ $mediaUid ], 'fonts' => [ $fontUid ] ] ) );

		$font = $fontManager->getFontForExport( $fontUid );


		$client = $this->getCloudClientObserver();
		//$client->isMediaUploaded( Argument::exact( $mediaUid ) )->shouldBeCalled();
		$client->uploadMedia( Argument::exact( $mediaUid ), Argument::exact( $attachmentPath ) )->shouldBeCalled();
		$client->createFont( $font )->willReturn( true )->shouldBeCalled();
		$client->createOrUpdateBlock( $block )->willReturn( true )->shouldBeCalled();

		$bridge = new Brizy_Admin_Cloud_BlockBridge( $client->reveal() );
		$bridge->export( $block );
	}
}