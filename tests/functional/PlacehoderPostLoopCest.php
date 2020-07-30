<?php


class PlacehoderPostLoopCest {

	private $postId;


	public function _before( FunctionalTester $I ) {
		wp_cache_flush();

		$I->haveManyPostsInDatabase( 5, [
			'post_status' => 'publish',
			'post_type'   => 'test-post-type',
			'post_title'  => 'SampleTitle{{n}}'
		] );
	}

	private function checkReturnTheCorrectDataParameters() {

		return [
			[
				'input'  => "{{brizy_dc_post_loop query='post_type=test-post-type'}}{{brizy_dc_post_title}}{{end_brizy_dc_post_loop}}",
				'output' => "SampleTitle0SampleTitle1SampleTitle2"
			],[
				'input'  => "{{brizy_dc_post_loop query='post_type=test-post-type&posts_per_page=10'}}{{brizy_dc_post_title}}{{end_brizy_dc_post_loop}}",
				'output' => "SampleTitle0SampleTitle1SampleTitle2SampleTitle3SampleTitle4"
			],
			[
				'input'  => "{{brizy_dc_post_loop query='post_type=unknown-type'}}{{brizy_dc_post_title}}{{end_brizy_dc_post_loop}}",
				'output' => ""
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
