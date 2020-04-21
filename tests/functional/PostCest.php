<?php

class PostCest {


	protected function _before( FunctionalTester $I ) {
		wp_cache_flush();
		global $wpdb;
		$wpdb->db_connect();
	}

	protected function _after( FunctionalTester $I ) {

	}

	public function testCreateResponse( FunctionalTester $I ) {
		$id    = wp_insert_post( [ 'post_type' => Brizy_Admin_Blocks_Main::CP_GLOBAL, 'post_title' => 'Test' ] );
		$block = Brizy_Editor_Block::get( $id );
		$data  = $block->createResponse();

		$I->assertArrayHasKey( 'uid', $data, "It should contain key 'uid'    " );
		$I->assertArrayHasKey( 'status', $data, "It should contain key 'status'    " );
		$I->assertArrayHasKey( 'data', $data, "It should contain key 'data'  " );
		$I->assertArrayHasKey( 'position', $data, "It should contain key 'position'  " );
		$I->assertArrayHasKey( 'rules', $data, "It should contain key 'rules'  " );
		$I->assertArrayHasKey( 'dataVersion', $data, "It should contain key 'dataVersion'  " );
	}

	/**
	 * @param FunctionalTester $I
	 *
	 * @throws Exception
	 */
	public function saveTest( FunctionalTester $I ) {

		$data         = base64_encode( 'test' );
		$data_decoded = 'test';

		$id = wp_insert_post( [ 'post_type' => Brizy_Admin_Blocks_Main::CP_GLOBAL, 'post_title' => 'Test' ] );

		$block = new Brizy_Editor_Block( $id );
		$block->setPosition( new Brizy_Editor_BlockPosition( "left", 1 ) );
		$block->set_editor_data( $data );
		$block->set_needs_compile( true );
		$block->set_uses_editor( false );
		$block->set_compiler_version( '1' );
		$block->set_editor_version( '2' );
		$block->setDataVersion( 1 );
		$block->save();

		$I->assertTrue( $block->uses_editor(), 'Block should always return true for uses_editor' );

		unset( $block );

		$block = new Brizy_Editor_Block( $id );

		$I->assertInstanceOf( "Brizy_Editor_BlockPosition", $block->getPosition(), "setPosition should return a Brizy_Editor_BlockPosition instance " );
		$I->assertEquals( $data_decoded, $block->get_editor_data(), "It should return decoded data" );
		$I->assertEquals( "1", $block->get_compiler_version() );
		$I->assertEquals( "2", $block->get_editor_version() );
	}

	/**
	 * @param FunctionalTester $I
	 *
	 * @throws Exception
	 */
	public function saveWrongDataVersionTest( FunctionalTester $I ) {

		$data         = base64_encode( 'test' );
		$data_decoded = 'test';

		$id = wp_insert_post( [ 'post_type' => Brizy_Admin_Blocks_Main::CP_GLOBAL, 'post_title' => 'Test' ] );

		$block = new Brizy_Editor_Block( $id );
		$block->setPosition( new Brizy_Editor_BlockPosition( "left", 1 ) );
		$block->set_editor_data( $data );
		$block->set_needs_compile( true );
		$block->set_uses_editor( false );
		$block->set_compiler_version( '1' );
		$block->set_editor_version( '2' );
		$block->setDataVersion( 4 );

		$I->expectThrowable( Brizy_Editor_Exceptions_DataVersionMismatch::class, function () use ( $block ) {
			$block->save();
		} );
	}


	/**
	 * @param FunctionalTester $I
	 *
	 * @throws Exception
	 */
	public function autoSaveTest( FunctionalTester $I ) {

		$data         = base64_encode( 'test' );
		$data_decoded = 'test';

		$id    = wp_insert_post( [ 'post_type' => Brizy_Admin_Blocks_Main::CP_GLOBAL, 'post_title' => 'Test' ] );
		$block = new Brizy_Editor_Block( $id );
		$block->setPosition( new Brizy_Editor_BlockPosition( "left", 1 ) );
		$block->set_editor_data( $data );
		$block->set_compiler_version( '1' );
		$block->set_editor_version( '2' );
		$block->setDataVersion( 1 );
		$block->save( 1 );

		unset( $block );

		$block = new Brizy_Editor_Block( $id );

		$I->assertNotInstanceOf( "Brizy_Editor_BlockPosition", $block->getPosition(), "setPosition should return a Brizy_Editor_BlockPosition instance " );
		$I->assertNotEquals( $data_decoded, $block->get_editor_data(), "It should return decoded data" );
		$I->assertNotEquals( "1", $block->get_compiler_version() );
		$I->assertNotEquals( "2", $block->get_editor_version() );
	}

	/**
	 * @param FunctionalTester $I
	 *
	 * @throws Exception
	 */
	public function jsonSerializeTest( FunctionalTester $I ) {

		$data         = base64_encode( 'test' );
		$data_decoded = 'test';

		$id = wp_insert_post( [ 'post_type' => Brizy_Admin_Blocks_Main::CP_GLOBAL, 'post_title' => 'Test 2' ] );

		$block = new Brizy_Editor_Block( $id );
		$block->setPosition( new Brizy_Editor_BlockPosition( "left", 1 ) );
		$block->set_editor_data( $data );
		$block->setDataVersion( 1 );
		$block->save();

		unset( $block );

		$block = new Brizy_Editor_Block( $id );

		// getting data that is going to be in json string
		$json_serialize = $block->jsonSerialize();

		$I->assertTrue( isset( $json_serialize['rules'] ), 'Rule data is not returned in json serialize data' );
		$I->assertTrue( isset( $json_serialize['position'] ), 'Position data is not returned in json serialize data' );
		$I->assertTrue( isset( $json_serialize['editor_data'] ), 'Editor data is not returned in json serialize data' );
		$I->assertEquals( $json_serialize['editor_data'], $data_decoded, 'Editor data is not decoded' );
	}

	public function duplicateFail1Test( FunctionalTester $I ) {

		$postId    = $I->havePostInDatabase( [
			'post_type'   => 'page',
			'post_title'  => 'Page',
			'post_name'   => 'Page',
			'post_status' => 'publish',
		] );

		$newPostId = wp_insert_post( [ 'post_type' => 'page', 'post_title' => 'Duplicate Test' ] );
		$newPostId2 = wp_insert_post( [ 'post_type' => 'post', 'post_title' => 'Duplicate Post Test' ] );

		$I->expectThrowable( \Exception::class, function () use ($newPostId, $postId) {
			$page = Brizy_Editor_Entity::get( $postId );
			$page->duplicateTo( $newPostId );
		} );

		$I->expectThrowable( \Exception::class, function () use ($newPostId2, $postId) {
			$page = Brizy_Editor_Entity::get( $postId );
			$page->duplicateTo( $newPostId2 );
		} );

	}

	public function duplicateFail2Test( FunctionalTester $I ) {

		$brizyData = serialize( [
				"brizy-post" => [
					'compiled_html'      => '',
					'compiled_html_body' => null,
					'compiled_html_head' => null,
					'editor_version'     => '1',
					'compiler_version'   => '2',
					'plugin_version'     => '3',
					'editor_data'        => 'eyJ0eXBlIjoiU2VjdGlvbiIsImJsb2NrSWQiOiJCbGFuazAwMExpZ2h0IiwidmFsdWUiOnsiX3N0eWxlcyI6WyJzZWN0aW9uIl0sIml0ZW1zIjpbeyJ0eXBlIjoiU2VjdGlvbkl0ZW0iLCJ2YWx1ZSI6eyJfc3R5bGVzIjpbInNlY3Rpb24taXRlbSJdLCJpdGVtcyI6W10sIl9pZCI6ImFsYWF5c3dlcnNxa3d0cmhxdGJxdmxjY2lqY3BzYXByaGxtcyJ9fV0sIl9pZCI6InljZ3dsd295d3l1bnRlb2NscWRkdGNyY3FxenVjeGpydWNnZSIsIl90aHVtYm5haWxTcmMiOiJxd2N2d2xzanRmdGR2cHh5Y2xkdXhqbnRkd25pcXR1aGZmaHkiLCJfdGh1bWJuYWlsV2lkdGgiOjYwMCwiX3RodW1ibmFpbEhlaWdodCI6NzAsIl90aHVtYm5haWxUaW1lIjoxNTU5ODkxMDY0OTQzfX0=',
					'brizy-use-brizy'    => true
				],
			]
		);

		$postId    = $I->havePostInDatabase( [
			'post_type'   => 'page',
			'post_title'  => 'Page',
			'post_name'   => 'Page',
			'post_status' => 'publish',
			'meta_input'  => [
				'brizy'                       => $brizyData,
				'brizy_post_uid'              => 'sffbf00297b0b4e9ee27af32a7b79c3331',
				'brizy-post-editor-version'   => '1.0.101',
				'brizy-post-compiler-version' => '1.0.101',
				'brizy-need-compile'          => 0,
			],
		] );

		$postId2    = $I->havePostInDatabase( [
			'post_type'   => 'page',
			'post_title'  => 'Page 2',
			'post_name'   => 'Page 2',
			'post_status' => 'publish',
			'meta_input'  => [
				'brizy'                       => $brizyData,
				'brizy_post_uid'              => 'sffbf00297b0b4e9ee27af32a7b79c3332',
				'brizy-post-editor-version'   => '1.0.101',
				'brizy-post-compiler-version' => '1.0.101',
				'brizy-need-compile'          => 0,
			],
		] );

		$I->expectThrowable( \Exception::class, function () use ($postId2, $postId) {
			$page = Brizy_Editor_Entity::get( $postId );
			$page->duplicateTo( $postId2 );
		} );

	}

	public function duplicateTest( FunctionalTester $I ) {

		$brizyData = serialize( [
				"brizy-post" => [
					'compiled_html'      => '',
					'compiled_html_body' => null,
					'compiled_html_head' => null,
					'editor_version'     => '1',
					'compiler_version'   => '2',
					'plugin_version'     => '3',
					'editor_data'        => 'eyJ0eXBlIjoiU2VjdGlvbiIsImJsb2NrSWQiOiJCbGFuazAwMExpZ2h0IiwidmFsdWUiOnsiX3N0eWxlcyI6WyJzZWN0aW9uIl0sIml0ZW1zIjpbeyJ0eXBlIjoiU2VjdGlvbkl0ZW0iLCJ2YWx1ZSI6eyJfc3R5bGVzIjpbInNlY3Rpb24taXRlbSJdLCJpdGVtcyI6W10sIl9pZCI6ImFsYWF5c3dlcnNxa3d0cmhxdGJxdmxjY2lqY3BzYXByaGxtcyJ9fV0sIl9pZCI6InljZ3dsd295d3l1bnRlb2NscWRkdGNyY3FxenVjeGpydWNnZSIsIl90aHVtYm5haWxTcmMiOiJxd2N2d2xzanRmdGR2cHh5Y2xkdXhqbnRkd25pcXR1aGZmaHkiLCJfdGh1bWJuYWlsV2lkdGgiOjYwMCwiX3RodW1ibmFpbEhlaWdodCI6NzAsIl90aHVtYm5haWxUaW1lIjoxNTU5ODkxMDY0OTQzfX0=',
					'brizy-use-brizy'    => true
				],
			]
		);

		$postId    = $I->havePostInDatabase( [
			'post_type'   => 'page',
			'post_title'  => 'Page',
			'post_name'   => 'Page',
			'post_status' => 'publish',
			'meta_input'  => [
				'brizy'                       => $brizyData,
				'brizy_post_uid'              => 'sffbf00297b0b4e9ee27af32a7b79c333',
				'brizy-post-editor-version'   => '1.0.101',
				'brizy-post-compiler-version' => '1.0.101',
				'brizy-need-compile'          => 0,
			],
		] );

		$newPostId = wp_insert_post( [ 'post_type' => 'page', 'post_title' => 'Duplicate Test' ] );

		$page = Brizy_Editor_Entity::get( $postId );
		$page->duplicateTo( $newPostId );

		$newPost = Brizy_Editor_Entity::get( $newPostId );
		$uid = $newPost->getUid();

		$I->seePostMetaInDatabase( [
			'post_id'=>$newPostId,
			'meta_key'=>'brizy',
			'meta_value'=>$brizyData
		] );

		$I->seePostMetaInDatabase( [
			'post_id'=>$newPostId,
			'meta_key'=>'brizy_post_uid',
			'meta_value'=>$uid
		] );

		$I->seePostMetaInDatabase( [
			'post_id'=>$newPostId,
			'meta_key'=>'brizy-post-editor-version',
			'meta_value'=>'1'
		] );

		$I->seePostMetaInDatabase( [
			'post_id'=>$newPostId,
			'meta_key'=>'brizy-post-compiler-version',
			'meta_value'=>'2'
		] );

		$I->seePostMetaInDatabase( [
			'post_id'=>$newPostId,
			'meta_key'=>'brizy-need-compile',
			'meta_value'=>'1'
		] );


	}

}
