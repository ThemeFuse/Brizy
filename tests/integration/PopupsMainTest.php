<?php


class PopupsMainTest {

	protected function _before( IntegrationTester $I ) {
		wp_cache_flush();
		global $wpdb;
		$wpdb->db_connect();

		$I->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Popups_Main::CP_POPUP,
			'post_title'  => 'Global {{n}}',
			'post_name'   => 'Global {{n}}',
			'post_status' => 'publish',
			'meta_input'  => [
				'brizy'                       => serialize( [
						"brizy-post" => [
							'compiled_html'      => 'PCFET0NUWVBFIGh0bWw+CjxodG1sIGxhbmc9ImVuIj4KPGhlYWQ+CiAgICA8bWV0YSBjaGFyc2V0PSJVVEYtOCI+CiAgICA8dGl0bGU+VGl0bGU8L3RpdGxlPgogIDxzdHlsZT4qe2JvcmRlcjoxcHggc29saWQgcmVkO308L3N0eWxlPgo8L2hlYWQ+Cjxib2R5PgogIDxwPlRoaXMgaXMgYW4gaW5zZXJ0ZWQgcG9wdXA8cD4KPC9ib2R5Pgo8L2h0bWw+',
							'compiled_html_body' => null,
							'compiled_html_head' => null,
							'editor_version'     => null,
							'compiler_version'   => null,
							'plugin_version'     => null,
							'brizy-use-brizy'    => true,
						],
					]
				),
				'brizy_post_uid'              => 'gffbf00297b0b4e9ee27af32a7b79c333{{n}}',
				'brizy-post-editor-version'   => '1.0.101',
				'brizy-post-compiler-version' => '1.0.101',
				'brizy-need-compile'          => 0,
				'brizy-rules'                 => '{}',
			],
		] );
	}

	protected function _after( IntegrationTester $I ) {

	}

	public function sampleTest( IntegrationTester $I ) {

	}

}