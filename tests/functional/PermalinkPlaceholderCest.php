<?php


class PermalinkPlaceholderCest {

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
			'comment_count'  => '10',
		] );

	}

	private function checkReturnTheCorrectDataParameters() {

		return [
			[
				'input'  => '{{brizy_dc_permalink post_id=\'' . $this->postId . '\'}}',
				'output' => 'http://brizy.local/?p=5'
			],
			[
				'input'  => '{{brizy_dc_permalink post_id=\'\'}}',
				'output' => ''
			],
			[
				'input'  => '{{brizy_dc_permalink post_id=\'456\'}}',
				'output' => ''
			],
			[
				'input'  => '{{brizy_dc_permalink post_id=\'rfghfgh\'}}',
				'output' => ''
			],
			[
				'input'  => '{{brizy_dc_permalink}}',
				'output' => ''
			]
		];
	}


	/**
	 *
	 * @param FunctionalTester $I
	 * @param \Codeception\Example $example
	 *
	 * @throws Exception
	 */
	public function checkReturnTheCorrectDataFromMainQueryTest( FunctionalTester $I ) {

		$post = get_post( $this->postId );

		foreach ( $this->checkReturnTheCorrectDataParameters() as $example ) {
			$output = apply_filters( 'brizy_content', $example['input'], Brizy_Editor_Project::get(), $post );
			$I->assertEquals( $example['output'], $output, 'The short code should return the correct field value' );
		}
	}

}