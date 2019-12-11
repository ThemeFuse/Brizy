<?php


class RestApiExtendCest {

	private $pageId;

	/**
	 * @param FunctionalTester $I
	 *
	 * @throws \Gumlet\ImageResizeException
	 */
	public function _before( FunctionalTester $I ) {
		wp_cache_flush();
		@$I->cleanUploadsDir();
		$I->loginAs( 'admin', 'admin' );

		$this->pageId = $I->havePostInDatabase( [
			'post_type'   => 'page',
			'post_title'  => 'Unused page',
			'post_name'   => 'Unused page',
			'post_status' => 'publish',
			'meta_input'  => [
				'brizy'                       => serialize( [
						"brizy-post" => [
							'compiled_html'      => 'PCFET0NUWVBFIGh0bWw+CjxodG1sIGxhbmc9ImVuIj4KPGhlYWQ+CiAgICA8bWV0YSBjaGFyc2V0PSJVVEYtOCI+CiAgICA8dGl0bGU+VGl0bGU8L3RpdGxlPgogICAgPHN0eWxlPlVOVVNFRCBDU1MgQ09ERTwvc3R5bGU+CjwvaGVhZD4KPGJvZHk+PGRpdj5VTlVTRUQgSFRNTCBDT0RFPC9kaXY+PC9ib2R5Pgo8L2h0bWw+',
							'compiled_html_body' => null,
							'compiled_html_head' => null,
							'editor_version'     => null,
							'compiler_version'   => null,
							'plugin_version'     => null,
							'brizy-use-brizy'    => true,
							'editor_data'        => 'ewogICJ0eXBlIjogIlNlY3Rpb24iLAogICJibG9ja0lkIjogIkJsYW5rMDAwTGlnaHQiLAogICJ2YWx1ZSI6IHsKICAgICJfc3R5bGVzIjogWwogICAgICAic2VjdGlvbiIKICAgIF0sCiAgICAiaXRlbXMiOiBbCiAgICAgIHsKICAgICAgICAidHlwZSI6ICJTZWN0aW9uSXRlbSIsCiAgICAgICAgInZhbHVlIjogewogICAgICAgICAgIl9zdHlsZXMiOiBbCiAgICAgICAgICAgICJzZWN0aW9uLWl0ZW0iCiAgICAgICAgICBdLAogICAgICAgICAgIml0ZW1zIjogW10gICAgICAgICAgCiAgICAgICAgfQogICAgICB9CiAgICBdICAgIAogIH0KfQ=='
						],
					]
				),
				'brizy_post_uid'              => 'post_uid',
				'brizy-post-editor-version'   => '1.0.101',
				'brizy-post-compiler-version' => '1.0.101',
				'brizy-need-compile'          => 0,
			],
		] );

		$attachmentId = $I->haveAttachmentInDatabase( codecept_data_dir( 'dump.sql' ), null, [] );
		$I->havePostmetaInDatabase( $attachmentId, 'brizy_attachment_uid', 'attachment_uid1' );
		$I->havePostmetaInDatabase( $attachmentId, 'brizy_post_uid', 'post_uid' );

		$attachmentId = $I->haveAttachmentInDatabase( codecept_data_dir( 'favico.jpg' ), null, [] );
		$I->havePostmetaInDatabase( $attachmentId, 'brizy_attachment_uid', 'attachment_uid2' );
		$I->havePostmetaInDatabase( $attachmentId, 'brizy_post_uid', 'post_uid' );
	}


	/**
	 * @param FunctionalTester $I
	 *
	 * @throws Exception
	 */
	public function brizyMetaDataInResponseTest( FunctionalTester $I ) {

		$I->haveHttpHeader( 'Content-Type', 'application/json' );
		$I->sendGET( '/index.php?rest_route=/wp/v2/pages/' . $this->pageId );
		$response = $I->grabResponse();
		$I->seeResponseIsJson();
		$I->seeResponseContainsJson( [
			'brizy_media' => [
				[
					'name' => 'dump.sql',
					'meta' => [
						'brizy_attachment_uid' => 'attachment_uid1',
						'brizy_post_uid'       => ['post_uid']
					]
				],
				[
					'name' => 'favico.jpg',
					'meta' => [
						'brizy_attachment_uid' => 'attachment_uid2',
						'brizy_post_uid'       => ['post_uid']
					]
				],
			]
		] );

	}
}