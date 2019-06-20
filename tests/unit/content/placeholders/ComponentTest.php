<?php


class ComponentTest extends \Codeception\Test\Unit {

	public function test_scenario() {

		// Replace protected self reference with mock object
		$context   = new Brizy_Content_Context( null, null, null, '' );
		$processor = new Brizy_Content_DynamicContentProcessor();

		$content = $processor->process( "{{brizy_dc_third_party id='LatestComments' v='{\"numComments\":1}'}}", $context );

		$this->assertStringNotContainsString( 'brizy_dc_third_party', $content, 'It should replace the content placeholder' );
		$this->assertNotEmpty( $content, 'It should not be empty string' );
	}
}