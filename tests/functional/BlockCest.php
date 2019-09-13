<?php


class BlockCest {
	/**
	 * @var \IntegrationTester
	 */
	protected $tester;

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
		$this->globalBlockObject->setCloudUpdateRequired( true );
		$I->dontSeePostMetaInDatabase( [
			'post_id'    => $this->savedBlockId,
			'meta_key'   => Brizy_Editor_Block::BRIZY_CLOUD_UPDATE_REQUIRED,
		] );

		$expectedFlag = $this->globalBlockObject->isCloudUpdateRequired();
		$I->assertFalse( $expectedFlag, 'It should always return false for global blocks' );
	}

	public function isCloudUpdateRequiredTest( FunctionalTester $I ) {
		$this->savedBlockObject->setCloudUpdateRequired( true );
		$I->seePostMetaInDatabase( [
			'post_id'    => $this->savedBlockId,
			'meta_key'   => Brizy_Editor_Block::BRIZY_CLOUD_UPDATE_REQUIRED,
			'meta_value' => 1,
		] );

		$expectedFlag = $this->savedBlockObject->isCloudUpdateRequired();
		$I->assertTrue( $expectedFlag, 'It should return the correct flag value for cloud update required field' );

		$this->savedBlockObject->setCloudUpdateRequired( false );
		$I->seePostMetaInDatabase( [
			'post_id'    => $this->savedBlockId,
			'meta_key'   => Brizy_Editor_Block::BRIZY_CLOUD_UPDATE_REQUIRED,
			'meta_value' => 0,
		] );

		$expectedFlag = $this->savedBlockObject->isCloudUpdateRequired();
		$I->assertFalse( $expectedFlag, 'It should return the correct flag value for cloud update required field' );
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