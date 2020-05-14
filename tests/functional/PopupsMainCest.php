<?php


class PopupsMainCest {


	public function _before( FunctionalTester $I ) {
		wp_cache_flush();
		global $wpdb;
		@$wpdb->check_connection();

		$I->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Popups_Main::CP_POPUP,
			'post_title'  => 'Unused popup',
			'post_name'   => 'Unused popup',
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
				'brizy_post_uid'              => 'gffbf00297b0b4e9ee27af32a7b79c3333',
				'brizy-post-editor-version'   => '1.0.101',
				'brizy-post-compiler-version' => '1.0.101',
				'brizy-need-compile'          => 0,
				'brizy-rules'                 => serialize( [] ),
			],
		] );


		$I->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Popups_Main::CP_POPUP,
			'post_title'  => 'Popup',
			'post_name'   => 'Popup',
			'post_status' => 'publish',
			'meta_input'  => [
				'brizy'                       => serialize( [
						"brizy-post" => [
							'compiled_html'      => 'PCFET0NUWVBFIGh0bWw+CjxodG1sIGxhbmc9ImVuIj4KPGhlYWQ+CiAgICA8bWV0YSBjaGFyc2V0PSJVVEYtOCI+CiAgICA8dGl0bGU+VGl0bGU8L3RpdGxlPgogICAgPHN0eWxlPklOQ0xVREUgVEhJUyBDU1MgQ09ERTwvc3R5bGU+CjwvaGVhZD4KPGJvZHk+PGRpdj5JTkNMVURFIFRISVMgSFRNTCBDT0RFPC9kaXY+PC9ib2R5Pgo8L2h0bWw+',
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
				'brizy_post_uid'              => 'gffbf00297b0b4e9ee27af32a7b79c334556',
				'brizy-post-editor-version'   => '1.0.101',
				'brizy-post-compiler-version' => '1.0.101',
				'brizy-need-compile'          => 0,
				'brizy-rules'                 => serialize( [
					[
						"type"         => "1",
						"appliedFor"   => "1",
						"entityType"   => "page",
						"entityValues" => []
					]
				] ),
			],
		] );
	}

	public function checkIfCustomPostsRegistered( FunctionalTester $I ) {
		$I->wantToTest( 'Request with invalid editor version' );
		$I->assertTrue( post_type_exists( 'brizy-popup' ) ,'It should register popup post type');
	}


	public function testInsertPopupsHtml( FunctionalTester $I ) {

		global $wp_query;


		$postId = $I->havePostInDatabase( [
			'post_type'   => 'page',
			'post_title'  => 'Page title',
			'post_status' => 'publish',
			'meta_input'  => [
				'brizy'                       => serialize( [
						"brizy-post" => [
							'compiled_html'      => 'PCFET0NUWVBFIGh0bWw+CjxodG1sIGxhbmc9ImVuIj4KPGhlYWQ+CiAgICA8bWV0YSBjaGFyc2V0PSJVVEYtOCI+CiAgICA8dGl0bGU+VGl0bGU8L3RpdGxlPgo8L2hlYWQ+Cjxib2R5PjwvYm9keT4KPC9odG1sPg==',
							'compiled_html_body' => null,
							'compiled_html_head' => null,
							'editor_version'     => null,
							'compiler_version'   => null,
							'plugin_version'     => null,
							'brizy-use-brizy'    => true,
						],
					]
				),
				'brizy_post_uid'              => 'gffbf00297b0b4e9ee27af32a7b712',
				'brizy-post-editor-version'   => '1.0.101',
				'brizy-post-compiler-version' => '1.0.101',
				'brizy-need-compile'          => 1,
			],
		] );

		$wp_query->post              = $wp_query->queried_object = get_post( $postId );
		$wp_query->queried_object_id = $postId;

		$targetHtml = '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body class="test-class"></body>
</html>';

		$main    = new Brizy_Admin_Popups_Main();
		$content = $main->insertPopupsHtml( $targetHtml, null, null, 'document' );

		$compiledHtml = new Brizy_Editor_CompiledHtml( $content );
		$I->assertStringContainsString( 'INCLUDE THIS CSS CODE', $compiledHtml->get_head(), 'It should include styles in head' );
		$I->assertStringNotContainsString( 'INCLUDE THIS CSS CODE', $compiledHtml->get_body(), 'It should not include styles in body' );

		$I->assertStringNotContainsString( 'INCLUDE THIS HTML CODE', $compiledHtml->get_head(), 'It should not include HTML code in head' );
		$I->assertStringContainsString( 'INCLUDE THIS HTML CODE', $compiledHtml->get_body(), 'It should include HTML code in body' );
	}

	public function testExcludeRule( FunctionalTester $I ) {

		global $wp_query;

		$I->dontHavePostInDatabase(['post_type'=>Brizy_Admin_Popups_Main::CP_POPUP]);

		$postId = $I->havePostInDatabase( [
			'post_type'   => 'post',
			'post_title'  => 'Page title',
			'post_status' => 'publish',
			'meta_input'  => [
				'brizy'                       => serialize( [
						"brizy-post" => [
							'compiled_html'      => 'PCFET0NUWVBFIGh0bWw+CjxodG1sIGxhbmc9ImVuIj4KPGhlYWQ+CiAgICA8bWV0YSBjaGFyc2V0PSJVVEYtOCI+CiAgICA8dGl0bGU+VGl0bGU8L3RpdGxlPgo8L2hlYWQ+Cjxib2R5PjwvYm9keT4KPC9odG1sPg==',
							'compiled_html_body' => null,
							'compiled_html_head' => null,
							'editor_version'     => null,
							'compiler_version'   => null,
							'plugin_version'     => null,
							'brizy-use-brizy'    => true,
						],
					]
				),
				'brizy_post_uid'              => 'gffbf00297b0b4e9ee27af32a7b71234',
				'brizy-post-editor-version'   => '1.0.101',
				'brizy-post-compiler-version' => '1.0.101',
				'brizy-need-compile'          => 1,
			],
		] );

		$postId2 = $I->havePostInDatabase( [
			'post_type'   => 'post',
			'post_title'  => 'Page title 2',
			'post_status' => 'publish',
			'meta_input'  => [
				'brizy'                       => serialize( [
						"brizy-post" => [
							'compiled_html'      => 'PCFET0NUWVBFIGh0bWw+CjxodG1sIGxhbmc9ImVuIj4KPGhlYWQ+CiAgICA8bWV0YSBjaGFyc2V0PSJVVEYtOCI+CiAgICA8dGl0bGU+VGl0bGU8L3RpdGxlPgo8L2hlYWQ+Cjxib2R5PjwvYm9keT4KPC9odG1sPg==',
							'compiled_html_body' => null,
							'compiled_html_head' => null,
							'editor_version'     => null,
							'compiler_version'   => null,
							'plugin_version'     => null,
							'brizy-use-brizy'    => true,
						],
					]
				),
				'brizy_post_uid'              => 'gffbf00297b0b4e9ee27af32a7b7125467',
				'brizy-post-editor-version'   => '1.0.101',
				'brizy-post-compiler-version' => '1.0.101',
				'brizy-need-compile'          => 1,
			],
		] );


		/// have a popup that exclude the postId
		$I->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Popups_Main::CP_POPUP,
			'post_title'  => 'Popup Exclude',
			'post_name'   => 'Popup Exclude',
			'post_status' => 'publish',
			'meta_input'  => [
				'brizy'                       => serialize( [
						"brizy-post" => [
							'compiled_html'      => 'PCFET0NUWVBFIGh0bWw+CjxodG1sIGxhbmc9ImVuIj4KPGhlYWQ+CiAgICA8bWV0YSBjaGFyc2V0PSJVVEYtOCI+CiAgICA8dGl0bGU+VGl0bGU8L3RpdGxlPgogICAgPHN0eWxlPklOQ0xVREUgVEhJUyBDU1MgQ09ERTwvc3R5bGU+CjwvaGVhZD4KPGJvZHk+PGRpdj5JTkNMVURFIFRISVMgSFRNTCBDT0RFPC9kaXY+PC9ib2R5Pgo8L2h0bWw+',
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
				'brizy_post_uid'              => 'gffbf00297b0b4e9ee27af32a7b79c334556',
				'brizy-post-editor-version'   => '1.0.101',
				'brizy-post-compiler-version' => '1.0.101',
				'brizy-need-compile'          => 0,
				'brizy-rules'                 => serialize( [
					[
						"type"         => "1",
						"appliedFor"   => "1",
						"entityType"   => "post",
						"entityValues" => []
					],
					[
						"type"         => "2",
						"appliedFor"   => "1",
						"entityType"   => "post",
						"entityValues" => [ $postId ]
					]
				] ),
			],
		] );


		$wp_query->post              = $wp_query->queried_object = get_post( $postId );
		$wp_query->queried_object_id = $postId;

		$targetHtml = '<!DOCTYPE html>
						<html lang="en">
						<head>
						    <meta charset="UTF-8">
						    <title>Title</title>
						</head>
						<body class="test-class"></body>
						</html>';

		$main    = new Brizy_Admin_Popups_Main();

		// it should not be applied bacause of exclude rule
		$content = $main->insertPopupsHtml( $targetHtml, null, null, 'document' );

		$compiledHtml = new Brizy_Editor_CompiledHtml( $content );
		$I->assertStringNotContainsString( 'INCLUDE THIS CSS CODE', $compiledHtml->get_head(), 'It should not include styles in head' );
		$I->assertStringNotContainsString( 'INCLUDE THIS CSS CODE', $compiledHtml->get_body(), 'It should not include styles in body' );

		$I->assertStringNotContainsString( 'INCLUDE THIS HTML CODE', $compiledHtml->get_head(), 'It should not include HTML code in head' );
		$I->assertStringNotContainsString( 'INCLUDE THIS HTML CODE', $compiledHtml->get_body(), 'It should not include HTML code in body' );
	}

}