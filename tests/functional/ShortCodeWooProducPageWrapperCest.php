<?php


class ShortCodeWooProducPageWrapperCest {

	private $postId;


	public function _before( FunctionalTester $I ) {
		wp_cache_flush();

		$I->dontHavePostInDatabase( [] );
		$I->dontHavePostMetaInDatabase( [] );

		$this->postId = $I->havePostInDatabase( [
			'post_content'   => 'field_post_content',
			'post_title'     => 'field_post_title',
			'post_excerpt'   => 'field_post_excerpt',
			'post_status'    => 'publish',
			'comment_status' => 'field_comment_status',
			'ping_status'    => 'field_ping_status',
			'post_password'  => '',
			'post_name'      => 'field_post_name',
			'to_ping'        => 'field_to_ping',
			'pinged'         => 'field_pinged',
			'post_parent'    => '0',
			'guid'           => 'field_guid',
			'menu_order'     => '0',
			'post_type'      => 'product',
			'post_mime_type' => 'field_post_mime_type',
			'comment_count'  => '10',
		] );

	}


	/**
	 * @param FunctionalTester $I
	 */
	public function checkIfShortCodeRegisteredTest( FunctionalTester $I ) {
		$I->assertTrue( shortcode_exists( 'brizy_product_page' ), 'The shortcode brizy_product_page should be registered' );
	}

	/**
	 * @param FunctionalTester $I
	 * @param \Codeception\Example $example
	 */
	public function checkReturnWithoutIdRequest( FunctionalTester $I ) {
		$output = do_shortcode( '[brizy_product_page]' );
		$I->assertEquals( '[product_page id="' . $this->postId . '"]', $output, 'The short code should return the page for the first product found.' );
	}

	/**
	 * @param FunctionalTester $I
	 * @param \Codeception\Example $example
	 */
	public function checkReturnWithGlobalPostRequest( FunctionalTester $I ) {

		$GLOBALS['post'] = (object) [ 'ID' => 10 ];

		$output = do_shortcode( '[brizy_product_page]' );
		$I->assertEquals( '[product_page id="10"]', $output, 'The short code should return the page for the first product found.' );
	}

	/**
	 * @param FunctionalTester $I
	 * @param \Codeception\Example $example
	 */
	public function checkReturnWithIdRequest( FunctionalTester $I ) {

		$aProductId = $I->havePostInDatabase( [
			'post_content'   => 'field_post_content',
			'post_title'     => 'field_post_title',
			'post_excerpt'   => 'field_post_excerpt',
			'post_status'    => 'publish',
			'comment_status' => 'field_comment_status',
			'ping_status'    => 'field_ping_status',
			'post_password'  => '',
			'post_name'      => 'field_post_name',
			'to_ping'        => 'field_to_ping',
			'pinged'         => 'field_pinged',
			'post_parent'    => '0',
			'guid'           => 'field_guid',
			'menu_order'     => '0',
			'post_type'      => 'product',
			'post_mime_type' => 'field_post_mime_type',
			'comment_count'  => '10',
		] );

		$output = do_shortcode( '[brizy_product_page id="' . $aProductId . '"]' );
		$I->assertEquals( '[product_page id="' . $aProductId . '"]', $output, 'The short code should return the page for the first product found.' );
	}
}