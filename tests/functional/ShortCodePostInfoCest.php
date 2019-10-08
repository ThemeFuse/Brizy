<?php


class ShortCodePostInfoCest {

	private $postId;


	public function _before( FunctionalTester $I ) {
		wp_cache_flush();

		$this->postId = $I->havePostInDatabase( [
			'post_content'   => 'field_post_content',
			'post_title'     => 'field_post_title',
			'post_excerpt'   => 'field_post_excerpt',
			'post_status'    => 'field_post_status',
			'comment_status' => 'field_comment_status',
			'ping_status'    => 'field_ping_status',
			'post_password'  => 'field_post_password',
			'post_name'      => 'field_post_name',
			'to_ping'        => 'field_to_ping',
			'pinged'         => 'field_pinged',
			'post_parent'    => '0',
			'guid'           => 'field_guid',
			'menu_order'     => '0',
			'post_type'      => 'field_post_type',
			'post_mime_type' => 'field_post_mime_type',
			'comment_count'  => '9999',
		] );

	}

	/**
	 * @param FunctionalTester $I
	 */
	public function checkIfShortCodeRegisteredTest( FunctionalTester $I ) {
		$I->assertTrue( shortcode_exists( 'brizy_post_info' ), 'The shortcode brizy_post_info should be registered' );
	}

	/**
	 * @param FunctionalTester $I
	 *
	 * @throws Exception
	 */
	public function checkPostInfoTest( FunctionalTester $I ) {
		$output = do_shortcode( '[brizy_post_info post="' . $this->postId . '" ]' );

		$post = get_post( $this->postId );

		$postDate = new \DateTime( $post->post_date );

		$author   = get_the_author_meta( 'nickname', $post->post_author );
		$date     = $postDate->format( 'd/m/Y' );
		$time     = $postDate->format( 'H:s' );
		$comments = get_comment_count( $post->ID );


		$I->assertStringContainsString( $author, $output, 'It should contain the author name' );
		$I->assertStringContainsString( $date, $output, 'It should contain the post date' );
		$I->assertStringContainsString( $time, $output, 'It should contain the post time' );
		$I->assertStringContainsString( $comments['approved'] . " comments", $output, 'It should contain the approved comment count' );

	}

	/**
	 * @param FunctionalTester $I
	 *
	 * @throws Exception
	 */
	public function checkPostInfoFromMainQueryTest( FunctionalTester $I ) {

		$post            = get_post( $this->postId );
		$GLOBALS['post'] = $post;

		$output = do_shortcode( '[brizy_post_info]' );

		$postDate = new \DateTime( $post->post_date );

		$author   = get_the_author_meta( 'nickname', $post->post_author );
		$date     = $postDate->format( 'd/m/Y' );
		$time     = $postDate->format( 'H:s' );
		$comments = get_comment_count( $post->ID );


		$I->assertStringContainsString( $author, $output, 'It should contain the author name' );
		$I->assertStringContainsString( $date, $output, 'It should contain the post date' );
		$I->assertStringContainsString( $time, $output, 'It should contain the post time' );
		$I->assertStringContainsString( $comments['approved'] . " comments", $output, 'It should contain the approved comment count' );

	}


}