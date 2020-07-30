<?php


class Brizy_Editor_PostCest {

	/**
	 * @param FunctionalTester $I
	 */
	public function _before( FunctionalTester $I ) {
		wp_cache_flush();
		$I->dontHavePostInDatabase( [ 'post_type' => 'page', ] );
		$I->dontHavePostInDatabase( [ 'post_type' => 'revision', ] );

		$I->loginAs( 'admin', 'admin' );
	}

	public function testCreateResponse( FunctionalTester $I ) {
		$id    = wp_insert_post( [ 'post_type' => 'page', 'post_title' => 'Test' ] );
		$block = Brizy_Editor_Post::get( $id );
		$data  = $block->createResponse();

		$I->assertArrayHasKey( 'title', $data, "It should contain key 'title'    " );
		$I->assertArrayHasKey( 'slug', $data, "It should contain key 'slug'    " );
		$I->assertArrayHasKey( 'status', $data, "It should contain key 'status'    " );
		$I->assertArrayHasKey( 'url', $data, "It should contain key 'url'    " );
		$I->assertArrayHasKey( 'data', $data, "It should contain key 'data'  " );
		$I->assertArrayHasKey( 'is_index', $data, "It should contain key 'is_index'  " );
		$I->assertArrayHasKey( 'template', $data, "It should contain key 'template'  " );
		$I->assertArrayHasKey( 'dataVersion', $data, "It should contain key 'dataVersion'  " );
	}

	/**
	 * @throws Exception
	 */
	public function testPostSettersAndDBData( FunctionalTester $I ) {

		$postId = $I->havePostInDatabase( [
			'post_title'  => 'Test',
			'post_type'   => 'page',
			'post_status' => 'publish'
		] );

		$decoded_editor_data = json_encode( [ 'test' => 1 ] );
		$editor_data         = base64_encode( $decoded_editor_data );

		$stub = Brizy_Editor_Post::get( $postId );
		$I->dontSeePostMetaInDatabase( [ 'post_id' => $postId, 'meta_key' => 'brizy' ] );
		$stub->set_needs_compile( true );
		$stub->set_plugin_version( BRIZY_VERSION );
		$stub->set_editor_version( BRIZY_VERSION );
		$stub->set_compiler_version( BRIZY_VERSION );
		$stub->set_uses_editor( true );
		$stub->set_editor_data( $editor_data );
		$stub->set_compiled_html( "<b></b>" );
		$stub->set_template( "atemplate" );
		$stub->setDataVersion( 1 );
		$stub->save();

		$storage = Brizy_Editor_Storage_Post::instance( $postId );


		// check meta values after save
		$I->canSeePostMetaInDatabase( [ 'post_id' => $postId, 'meta_key' => 'brizy' ] );

		$I->canSeePostMetaInDatabase( [
			'post_id'    => $postId,
			'meta_key'   => Brizy_Editor_Post::BRIZY_POST_NEEDS_COMPILE_KEY,
			'meta_value' => 1
		] );
		$I->canSeePostMetaInDatabase( [
			'post_id'    => $postId,
			'meta_key'   => Brizy_Editor_Post::BRIZY_POST_PLUGIN_VERSION,
			'meta_value' => BRIZY_VERSION
		] );
		$I->canSeePostMetaInDatabase( [
			'post_id'    => $postId,
			'meta_key'   => Brizy_Editor_Post::BRIZY_POST_EDITOR_VERSION,
			'meta_value' => BRIZY_VERSION
		] );
		$I->canSeePostMetaInDatabase( [
			'post_id'    => $postId,
			'meta_key'   => Brizy_Editor_Post::BRIZY_POST_COMPILER_VERSION,
			'meta_value' => BRIZY_VERSION
		] );
		$I->canSeePostMetaInDatabase( [
			'post_id'    => $postId,
			'meta_key'   => '_wp_page_template',
			'meta_value' => 'atemplate'
		] );
		$I->canSeePostMetaInDatabase( [
			'post_id'    => $postId,
			'meta_key'   => 'brizy_post_uid',
			'meta_value' => $stub->getUid()
		] );

		// check meta data values after save
		$data = $storage->get( Brizy_Editor_Post::BRIZY_POST );

		$I->assertEquals( $data['brizy-use-brizy'], true, 'It should have brizy-use-brizy equal to 1' );
		$I->assertEquals( $data['compiled_html'], base64_encode( "<b></b>" ), 'It should have correct value for compiled_html' );
		$I->assertEquals( $data['compiled_html_body'], "", 'It should have correct value for compiled_html_body' );
		$I->assertEquals( $data['compiled_html_head'], "", 'It should have correct value for compiled_html_head' );
		$I->assertEquals( $data['editor_data'], $editor_data, 'It should have correct value for editor_data' );
		$I->assertEquals( $data['compiler_version'], BRIZY_VERSION, 'It should have correct value for compiler_version' );
		$I->assertEquals( $data['editor_version'], BRIZY_VERSION, 'It should have correct value for editor_version' );
		$I->assertEquals( $data['plugin_version'], BRIZY_VERSION, 'It should have correct value for plugin_version' );
	}

	public function testEditorDataSetters( FunctionalTester $I ) {
		$postId = $I->havePostInDatabase( [
			'post_title'  => 'Test',
			'post_type'   => 'page',
			'post_status' => 'publish'
		] );

		$html                = "<b></b>";
		$encoded_html        = base64_encode( $html );
		$decoded_editor_data = json_encode( [ 'test' => 1 ] );
		$editor_data         = base64_encode( $decoded_editor_data );
		$stub                = Brizy_Editor_Post::get( $postId );

		$stub->set_editor_data( $decoded_editor_data );
		$I->assertEquals( $decoded_editor_data, $stub->get_editor_data(), 'It should have correct value for editor_data' );

		$stub->set_encoded_compiled_html( $encoded_html );
		$I->assertEquals( $encoded_html, $stub->get_encoded_compiled_html(), 'It should have correct value for encoded compiled html' );
		$I->assertEquals( $html, $stub->get_compiled_html(), 'It should have correct value for compiled html' );

		$stub->set_compiled_html( $html );
		$I->assertEquals( $encoded_html, $stub->get_encoded_compiled_html(), 'It should have correct value for encoded compiled html' );
		$I->assertEquals( $html, $stub->get_compiled_html(), 'It should have correct value for compiled html' );
	}

	public function testWPSave( FunctionalTester $I ) {
		$postId = $I->havePostInDatabase( [
			'post_title'  => 'Test',
			'post_type'   => 'page',
			'post_status' => 'publish'
		] );

		$html                = "<html><head></head><body><b>test</b></body></html>";
		$htmlBody            = "<b>test</b>";
		$decoded_editor_data = json_encode( [ 'test' => 1 ] );
		$editor_data         = base64_encode( $decoded_editor_data );
		$stub                = Brizy_Editor_Post::get( $postId );

		$stub->set_editor_data( $decoded_editor_data );
		$stub->set_needs_compile( true );
		$stub->set_plugin_version( BRIZY_VERSION );
		$stub->set_editor_version( BRIZY_VERSION );
		$stub->set_compiler_version( BRIZY_VERSION );
		$stub->set_uses_editor( true );
		$stub->set_editor_data( $editor_data );
		$stub->set_compiled_html( $html );
		$stub->set_template( "atemplate" );
		$stub->setDataVersion( 1 );
		$stub->savePost();

		$I->canSeePostInDatabaseContainingContent( $postId, $htmlBody );

		$I->canSeePostMetaInDatabase( [
			'post_id'    => $postId,
			'meta_key'   => 'brizy_post_uid',
			'meta_value' => $stub->getUid()
		] );

		$I->canSeePostInDatabase( [
			'post_parent' => $postId,
			'post_type'   => 'revision',
		] );
	}


	public function testAutoSave( FunctionalTester $I ) {
		$postId = $I->havePostInDatabase( [
			'post_title'  => 'Test',
			'post_type'   => 'page',
			'post_status' => 'publish'
		] );

		$html                 = "<html><head></head><body><b>test</b></body></html>";
		$htmlBody             = "<b>test</b>";
		$decoded_editor_data  = json_encode( [ 'test' => 1 ] );
		$decoded_editor_data2 = json_encode( [ 'test' => 2 ] );
		$editor_data          = base64_encode( $decoded_editor_data );
		$editor_data2         = base64_encode( $decoded_editor_data2 );

		$stub = Brizy_Editor_Post::get( $postId );
		$stub->set_needs_compile( true );
		$stub->set_plugin_version( BRIZY_VERSION );
		$stub->set_editor_version( BRIZY_VERSION );
		$stub->set_compiler_version( BRIZY_VERSION );
		$stub->set_uses_editor( true );
		$stub->set_editor_data( $editor_data );
		$stub->set_compiled_html( "<b></b>" );
		$stub->set_template( "atemplate" );
		$stub->setDataVersion( 1 );
		$stub->save( 0 );


		$stub->set_needs_compile( true );
		$stub->set_plugin_version( BRIZY_VERSION );
		$stub->set_editor_version( BRIZY_VERSION );
		$stub->set_compiler_version( BRIZY_VERSION );
		$stub->set_uses_editor( true );
		$stub->set_editor_data( $editor_data2 );
		$stub->set_compiled_html( "<b>autosav</b>" );
		$stub->set_template( "atemplate2" );
		$stub->setDataVersion( 2 );

		$stub->save( 1 );

		$I->canSeePostInDatabase( [
			'post_parent' => $postId,
			'post_type'   => 'revision',
			'post_name'   => $postId . '-autosave-v1'
		] );

		$I->dontSeePostInDatabase( [
			'post_parent' => $postId,
			'post_type'   => 'revision',
			'post_name'   => $postId . '-revision-v1'
		] );
	}

	public function testLoadInstanceFromSavedPost( FunctionalTester $I ) {
		/**
		 * @throws Exception
		 */

		$postId = $I->havePostInDatabase( [
			'post_title'  => 'Test',
			'post_type'   => 'page',
			'post_status' => 'publish'
		] );

		$html                = "<html><head></head><body><b>test</b></body></html>";
		$decoded_editor_data = json_encode( [ 'test' => 1 ] );
		$editor_data         = base64_encode( $decoded_editor_data );
		$stub                = Brizy_Editor_Post::get( $postId );

		$stub->set_editor_data( $decoded_editor_data );
		$stub->set_needs_compile( true );
		$stub->set_plugin_version( BRIZY_VERSION );
		$stub->set_editor_version( BRIZY_VERSION );
		$stub->set_compiler_version( BRIZY_VERSION );
		$stub->set_uses_editor( true );
		$stub->set_editor_data( $editor_data );
		$stub->set_compiled_html( $html );
		$stub->set_template( "atemplate" );
		$stub->setDataVersion( 1 );
		$stub->save();
		$stub->savePost();

		$stub = Brizy_Editor_Post::get( $postId );

		$data = $stub->convertToOptionValue();

		$I->assertEquals( $data['brizy-use-brizy'], true, 'It should have brizy-use-brizy equal to 1' );
		$I->assertEquals( $data['compiled_html'], base64_encode( $html ), 'It should have correct value for compiled_html' );
		$I->assertEquals( $data['compiled_html_body'], "", 'It should have correct value for compiled_html_body' );
		$I->assertEquals( $data['compiled_html_head'], "", 'It should have correct value for compiled_html_head' );
		$I->assertEquals( $data['editor_data'], $editor_data, 'It should have correct value for editor_data' );
		$I->assertEquals( $data['compiler_version'], BRIZY_VERSION, 'It should have correct value for compiler_version' );
		$I->assertEquals( $data['editor_version'], BRIZY_VERSION, 'It should have correct value for editor_version' );
		$I->assertEquals( $data['plugin_version'], BRIZY_VERSION, 'It should have correct value for plugin_version' );
	}
}
