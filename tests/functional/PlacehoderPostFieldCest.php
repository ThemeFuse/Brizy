<?php


class PlacehoderPostFieldCest {

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
				'input'  => "{{brizy_dc_post_loop taxonomy='template' value='main_query'}}{{brizy_dc_post_field property='post_title'}}{{end_brizy_dc_post_loop}}",
				'output' => "field_post_title"
			],[
				'input'  => "{{brizy_dc_post_loop taxonomy='template' value='main_query'}}{{brizy_dc_post_field property='post_author'}}{{end_brizy_dc_post_loop}}",
				'output' => "admin"
			],

		];
	}

	/**
	 * @param FunctionalTester $I
	 *
	 * @throws Exception
	 */
	public function checkReturnTheCorrectDataTest( FunctionalTester $I ) {

		foreach ( $this->checkReturnTheCorrectDataParameters() as $example ) {
			$output = apply_filters( 'brizy_content', $example['input'], Brizy_Editor_Project::get(), null );
			$I->assertEquals( $example['output'], $output, 'The short code should return the correct field value' );
		}
	}



}
