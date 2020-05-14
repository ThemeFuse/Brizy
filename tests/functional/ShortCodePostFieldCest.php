<?php


class ShortCodePostFieldCest {

	private $postId;


	public function _before( FunctionalTester $I ) {
		wp_cache_flush();

		$I->dontHavePostInDatabase( [] );
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
			'post_type'      => 'post',
			'post_mime_type' => 'field_post_mime_type',
			'comment_count'  => '10',
		] );

	}

	private function checkReturnTheCorrectDataParameters() {

		return [
			[
				'input'  => '[brizy_post_field post="' . $this->postId . '" property="post_content"]',
				'output' => "<p>field_post_content</p>\n"
			],
			[
				'input'  => '[brizy_post_field post="' . $this->postId . '" property="post_title"]',
				'output' => 'field_post_title'
			],
			[
				'input'  => '[brizy_post_field post="' . $this->postId . '" property="post_excerpt"]',
				'output' => 'field_post_excerpt'
			],
			[
				'input'  => '[brizy_post_field post="' . $this->postId . '" property="post_status"]',
				'output' => 'publish'
			],
			[
				'input'  => '[brizy_post_field post="' . $this->postId . '" property="comment_status"]',
				'output' => 'field_comment_status'
			],
			[
				'input'  => '[brizy_post_field post="' . $this->postId . '" property="ping_status"]',
				'output' => 'field_ping_status'
			],
			[
				'input'  => '[brizy_post_field post="' . $this->postId . '" property="post_password"]',
				'output' => ''
			],
			[
				'input'  => '[brizy_post_field post="' . $this->postId . '" property="post_name"]',
				'output' => 'field_post_name'
			],
			[
				'input'  => '[brizy_post_field post="' . $this->postId . '" property="to_ping"]',
				'output' => 'field_to_ping'
			],
			[
				'input'  => '[brizy_post_field post="' . $this->postId . '" property="pinged"]',
				'output' => 'field_pinged'
			],
			[
				'input'  => '[brizy_post_field post="' . $this->postId . '" property="post_parent"]',
				'output' => '0'
			],
			[
				'input'  => '[brizy_post_field post="' . $this->postId . '" property="guid"]',
				'output' => 'field_guid'
			],
			[
				'input'  => '[brizy_post_field post="' . $this->postId . '" property="menu_order"]',
				'output' => '0'
			],
			[
				'input'  => '[brizy_post_field post="' . $this->postId . '" property="post_type"]',
				'output' => 'post'
			],
			[
				'input'  => '[brizy_post_field post="' . $this->postId . '" property="post_mime_type"]',
				'output' => 'field_post_mime_type'
			],
			[
				'input'  => '[brizy_post_field post="' . $this->postId . '" property="comment_count"]',
				'output' => '10'
			]
		];
	}

	private function checkReturnTheCorrectDataParametersWithoutPost() {

		return [
			[
				'input'  => '[brizy_post_field property="post_content"]',
				'output' => "<p>field_post_content</p>\n"
			],
			[
				'input'  => '[brizy_post_field property="post_title"]',
				'output' => 'field_post_title'
			],
			[
				'input'  => '[brizy_post_field property="post_excerpt"]',
				'output' => 'field_post_excerpt'
			],
			[
				'input'  => '[brizy_post_field property="post_status"]',
				'output' => 'publish'
			],
			[
				'input'  => '[brizy_post_field property="comment_status"]',
				'output' => 'field_comment_status'
			],
			[
				'input'  => '[brizy_post_field property="ping_status"]',
				'output' => 'field_ping_status'
			],
			[
				'input'  => '[brizy_post_field property="post_password"]',
				'output' => ''
			],
			[
				'input'  => '[brizy_post_field property="post_name"]',
				'output' => 'field_post_name'
			],
			[
				'input'  => '[brizy_post_field property="to_ping"]',
				'output' => 'field_to_ping'
			],
			[
				'input'  => '[brizy_post_field property="pinged"]',
				'output' => 'field_pinged'
			],
			[
				'input'  => '[brizy_post_field property="post_parent"]',
				'output' => '0'
			],
			[
				'input'  => '[brizy_post_field property="guid"]',
				'output' => 'field_guid'
			],
			[
				'input'  => '[brizy_post_field property="menu_order"]',
				'output' => '0'
			],
			[
				'input'  => '[brizy_post_field property="post_type"]',
				'output' => 'post'
			],
			[
				'input'  => '[brizy_post_field property="post_mime_type"]',
				'output' => 'field_post_mime_type'
			],
			[
				'input'  => '[brizy_post_field property="comment_count"]',
				'output' => '10'
			]
		];
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function checkIfShortCodeRegisteredTest( FunctionalTester $I ) {
		$I->assertTrue( shortcode_exists( 'brizy_post_field' ), 'The shortcode brizy_post should be registered' );
	}

	/**
	 * @param FunctionalTester $I
	 * @param \Codeception\Example $example
	 */
//	public function checkReturnWhenAjaxRequest( FunctionalTester $I ) {
//
//		define( 'DOING_AJAX', true );
//		$output = do_shortcode( '[brizy_post_field property="post_content"]' );
//		$I->assertEquals( "<p>field_post_content</p>\n", $output, 'The short code should return the correct field value' );
//	}

	/**
	 * @param FunctionalTester $I
	 * @param \Codeception\Example $example
	 */
	public function checkReturnTheCorrectDataTest( FunctionalTester $I ) {

		foreach ( $this->checkReturnTheCorrectDataParameters() as $example ) {
			$output = do_shortcode( $example['input'] );
			$I->assertEquals( $example['output'], $output, 'The short code should return the correct field value' );
		}
	}

	/**
	 * @param FunctionalTester $I
	 * @param \Codeception\Example $example
	 */
	public function checkReturnTheCorrectDataFromMainQueryTest( FunctionalTester $I ) {

		$post            = get_post( $this->postId );
		$GLOBALS['post'] = $post;

		foreach ( $this->checkReturnTheCorrectDataParametersWithoutPost() as $example ) {
			$output = do_shortcode( $example['input'] );
			$I->assertEquals( $example['output'], $output, 'The short code should return the correct field value' );
		}
	}

}