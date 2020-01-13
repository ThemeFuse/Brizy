<?php

class BlockCest {

	/**
	 * @var int
	 */
	protected $savedBlockId;

	/**
	 * @var Brizy_Editor_Block
	 */
	protected $savedBlockObject;

	/**
	 * @var int
	 */
	protected $globalBlockId;

	/**
	 * @var Brizy_Editor_Block
	 */
	protected $globalBlockObject;


	public function _before( FunctionalTester $I ) {
		wp_cache_flush();

		Brizy_Admin_Popups_Main::registerCustomPosts();

		$I->dontHavePostInDatabase( [ 'post_type' => Brizy_Admin_Blocks_Main::CP_GLOBAL ] );
		$I->dontHavePostInDatabase( [ 'post_type' => Brizy_Admin_Blocks_Main::CP_SAVED ] );

		$this->savedBlockId = $I->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Blocks_Main::CP_SAVED,
			'post_name'   => 'Saved Brizy Block',
			'post_status' => 'publish',
		] );

		$this->savedBlockObject = Brizy_Editor_Block::get( $this->savedBlockId );

		$this->globalBlockId = $I->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Blocks_Main::CP_GLOBAL,
			'post_name'   => 'Global Brizy Block',
			'post_status' => 'publish',
		] );

		$this->globalBlockObject = Brizy_Editor_Block::get( $this->globalBlockId );

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
		$I->assertArrayNotHasKey( 'synchronized', $data, "It should not contain key 'synchronized'  " );
		$I->assertArrayNotHasKey( 'synchronizable', $data, "It should not contain key 'synchronizable'  " );
	}

	public function testCreateResponseSavedBlock( FunctionalTester $I ) {
		$id    = wp_insert_post( [ 'post_type' => Brizy_Admin_Blocks_Main::CP_SAVED, 'post_title' => 'Test' ] );
		$block = Brizy_Editor_Block::get( $id );
		$data  = $block->createResponse();

		$I->assertArrayHasKey( 'uid', $data, "It should contain key 'uid'    " );
		$I->assertArrayHasKey( 'status', $data, "It should contain key 'status'    " );
		$I->assertArrayHasKey( 'data', $data, "It should contain key 'data'  " );
		$I->assertArrayNotHasKey( 'position', $data, "It should contain key 'position'  " );
		$I->assertArrayNotHasKey( 'rules', $data, "It should contain key 'rules'  " );
		$I->assertArrayHasKey( 'dataVersion', $data, "It should contain key 'dataVersion'  " );
		$I->assertArrayHasKey( 'synchronized', $data, "It should contain key 'synchronized'  " );
		$I->assertArrayHasKey( 'synchronizable', $data, "It should contain key 'synchronizable'  " );
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


	public function isGlobalIsSavedTest( FunctionalTester $I ) {
		$I->assertTrue( $this->savedBlockObject->isSavedBlock(), 'isSavedBlock should return true for global blocks' );
		$I->assertFalse( $this->savedBlockObject->isGlobalBlock(), 'isGlobalBlock should return false for global blocks' );

		$I->assertTrue( $this->globalBlockObject->isGlobalBlock(), 'isGlobalBlock should return true for global blocks' );
		$I->assertFalse( $this->globalBlockObject->isSavedBlock(), 'isSavedBlock should return false for global blocks' );
	}

	public function createdMetaKeysTest( FunctionalTester $I ) {

		global $wpdb;

		$this->savedBlockObject->set_uses_editor( true );
		$this->savedBlockObject->set_needs_compile( true );
		$this->savedBlockObject->setDataVersion( 1 );
		$this->savedBlockObject->save();

		$I->seeInDatabase( $wpdb->postmeta, [
			'post_id'  => $this->savedBlockId,
			'meta_key' => 'brizy_post_uid',
		] );

		$I->seeInDatabase( $wpdb->postmeta, [
			'post_id'  => $this->savedBlockId,
			'meta_key' => 'brizy',
		] );
	}

	public function isCloudUpdateRequiredForGlobalBlockTest( FunctionalTester $I ) {
		$this->globalBlockObject->setSynchronized( 1, 2 );
		$I->dontSeePostMetaInDatabase( [
			'post_id'  => $this->savedBlockId,
			'meta_key' => 'brizy-cloud-update-required',
		] );

		$expectedFlag = $this->globalBlockObject->isCloudUpdateRequired();
		$I->assertFalse( $expectedFlag, 'It should always return false for global blocks' );
	}

	public function isCloudUpdateRequiredTest( FunctionalTester $I ) {
		$this->savedBlockObject->setSynchronized( 1, 2 );
		$I->seePostMetaInDatabase( [
			'post_id'    => $this->savedBlockId,
			'meta_key'   => 'brizy-cloud-update-required',
			'meta_value' => 0,
		] );

		$expectedFlag = $this->savedBlockObject->isCloudUpdateRequired();
		$I->assertFalse( $expectedFlag, 'It should return the correct flag value for cloud update required field' );

		$this->savedBlockObject->setCloudUpdateRequired( true );
		$I->seePostMetaInDatabase( [
			'post_id'    => $this->savedBlockId,
			'meta_key'   => 'brizy-cloud-update-required',
			'meta_value' => 1,
		] );

		$expectedFlag = $this->savedBlockObject->isCloudUpdateRequired();
		$I->assertTrue( $expectedFlag, 'It should return the correct flag value for cloud update required field' );
	}

	public function metaTest( FunctionalTester $I ) {
		$I->wantToTest( 'Get and Set Meta' );
		$meta = json_encode( [ 1, 2, 3 ] );
		$this->savedBlockObject->setMeta( $meta );
		$I->seePostMetaInDatabase( [
			'post_id'    => $this->savedBlockId,
			'meta_key'   => Brizy_Editor_Block::BRIZY_META,
			'meta_value' => $meta,
		] );

		$expectedMeta = $this->savedBlockObject->getMeta();
		$I->assertEquals( $expectedMeta, $meta, 'It should return the correct meta value' );
	}

	public function mediaTest( FunctionalTester $I ) {
		$I->wantToTest( 'Get and Set Media' );
		$media = json_encode( [ 1, 2, 3 ] );
		$this->savedBlockObject->setMedia( $media );
		$I->seePostMetaInDatabase( [
			'post_id'    => $this->savedBlockId,
			'meta_key'   => Brizy_Editor_Block::BRIZY_MEDIA,
			'meta_value' => $media,
		] );

		$expectedMedia = $this->savedBlockObject->getMedia();
		$I->assertEquals( $expectedMedia, $media, 'It should return the correct media value' );
	}
}
