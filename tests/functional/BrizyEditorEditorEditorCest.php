<?php


class BrizyEditorEditorEditorCest {

	/**
	 * @var int
	 */
	protected $postId1;

	/**
	 * @var int
	 */
	protected $postId2;

	/**
	 * @Override
	 */
	public function _before( FunctionalTester $I ) {

		$this->postId1 = $I->havePostInDatabase( [
			'post_type'   => 'post',
			'post_title'  => 'Page1',
			'post_name'   => 'Page1',
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
				'brizy-need-compile'          => 0
			],
		] );

		$this->postId2 = $I->havePostInDatabase( [
			'post_type'   => 'page',
			'post_title'  => 'Page2',
			'post_name'   => 'Page2',
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
				'brizy-post-editor-version'   => '1.0.125',
				'brizy-post-compiler-version' => '1.0.125',
				'brizy-need-compile'          => 1
			],
		] );

		$I->loginAs( 'admin', 'admin' );
	}

	public function testConfigSingleton( FunctionalTester $I ) {
		$editor = new Brizy_Editor_Editor_Editor( Brizy_Editor_Project::get(), Brizy_Editor_Post::get( $this->postId1 ) );
		$config1 = $editor->config();

		$editor = new Brizy_Editor_Editor_Editor( Brizy_Editor_Project::get(), Brizy_Editor_Post::get( $this->postId2 ) );
		$config2 = $editor->config();


		$I->assertNotSame($config1,$config2,'It should return different configs');

		$editor = new Brizy_Editor_Editor_Editor( Brizy_Editor_Project::get(), Brizy_Editor_Post::get( $this->postId1 ) );
		$config1_2 = $editor->config();

		$I->assertEquals($config1,$config1_2,'It should not create anew config for the same post id');
	}


	public function testRoles( FunctionalTester $I ) {

		$editor = new Brizy_Editor_Editor_Editor( Brizy_Editor_Project::get(), Brizy_Editor_Post::get( $this->postId1 ) );
		$config = $editor->config();
		$I->assertArrayHasKey( 'availableRoles', $config['wp'], 'It should contain availableRoles key.' );

		$all_roles = wp_roles()->roles;
		$all_roles = apply_filters( 'editable_roles', $all_roles );
		$roles     = [];
		foreach ( $all_roles as $role => $details ) {
			$sub['role'] = esc_attr( $role );
			$sub['name'] = translate_user_role( $details['name'] );
			$roles[]     = $sub;
		}

		$I->assertEquals( $roles, $config['wp']['availableRoles'], 'It should contain the available roles' );
	}
}
