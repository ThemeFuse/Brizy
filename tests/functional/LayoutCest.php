<?php

class LayoutCest {
	/**
	 * @var \IntegrationTester
	 */
	protected $tester;

	/**
	 * @var int
	 */
	protected $layoutId;

	/**
	 * @var Brizy_Editor_Layout
	 */
	protected $layoutObject;


	/**
	 * @param FunctionalTester $I
	 *
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public function _before( FunctionalTester $I ) {
		wp_cache_flush();

		$I->dontHavePostInDatabase( [ 'post_type' => Brizy_Admin_Blocks_Main::CP_GLOBAL ] );
		$I->dontHavePostInDatabase( [ 'post_type' => Brizy_Admin_Blocks_Main::CP_SAVED ] );

		$this->layoutId = $I->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Blocks_Main::CP_SAVED,
			'post_name'   => 'Layout',
			'post_status' => 'publish',
		] );

		$this->layoutObject = Brizy_Editor_Block::get( $this->layoutId );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function createdMetaKeysTest( FunctionalTester $I ) {

		global $wpdb;

		$this->layoutObject->set_uses_editor( true );
		$this->layoutObject->set_needs_compile( true );
		$this->layoutObject->setDataVersion(1);
		$this->layoutObject->save();

		$I->seeInDatabase( $wpdb->postmeta, [
			'post_id'  => $this->layoutId,
			'meta_key' => 'brizy_post_uid',
		] );

		$I->seeInDatabase( $wpdb->postmeta, [
			'post_id'  => $this->layoutId,
			'meta_key' => 'brizy',
		] );
	}

	public function isCloudUpdateRequiredTest( FunctionalTester $I ) {
		$this->layoutObject->setSynchronized( 1, 2 );
		$I->seePostMetaInDatabase( [
			'post_id'    => $this->layoutObject->getWpPostId(),
			'meta_key'   => 'brizy-cloud-update-required',
			'meta_value' => 0,
		] );

		$expectedFlag = $this->layoutObject->isCloudUpdateRequired();
		$I->assertFalse( $expectedFlag, 'It should return the correct flag value for cloud update required field' );

		$this->layoutObject->setCloudUpdateRequired( true );
		$I->seePostMetaInDatabase( [
			'post_id'    => $this->layoutObject->getWpPostId(),
			'meta_key'   => 'brizy-cloud-update-required',
			'meta_value' => 1,
		] );

		$expectedFlag = $this->layoutObject->isCloudUpdateRequired();
		$I->assertTrue( $expectedFlag, 'It should return the correct flag value for cloud update required field' );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function metaTest( FunctionalTester $I ) {
		$I->wantToTest( 'Get and Set Meta' );
		$meta = json_encode( [ 1, 2, 3 ] );
		$this->layoutObject->setMeta( $meta );
		$this->layoutObject->saveStorage();
		$I->seePostMetaInDatabase( [
			'post_id'    => $this->layoutId,
			'meta_key'   => Brizy_Editor_Block::BRIZY_META,
			'meta_value' => $meta,
		] );

		$expectedMeta = $this->layoutObject->getMeta();
		$I->assertEquals( $expectedMeta, $meta, 'It should return the correct meta value' );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function mediaTest( FunctionalTester $I ) {
		$I->wantToTest( 'Get and Set Media' );
		$media = json_encode( [ 1, 2, 3 ] );
		$this->layoutObject->setMedia( $media );
		$this->layoutObject->saveStorage();
		$I->seePostMetaInDatabase( [
			'post_id'    => $this->layoutId,
			'meta_key'   => Brizy_Editor_Block::BRIZY_MEDIA,
			'meta_value' => $media,
		] );

		$expectedMedia = $this->layoutObject->getMedia();
		$I->assertEquals( $expectedMedia, $media, 'It should return the correct media value' );
	}
}
