<?php


class LatestCommentsTest extends \Codeception\Test\Unit {

	/**
	 * @return mixed
	 */
	public function test_getConfig() {
		$context   = new Brizy_Editor_Components_Context();
		$component = new Brizy_Editor_Components_LatestComments_Main();
		$component->setContext( $context );
		$config = $component->getConfig();

		$this->assertArrayHasKey( 'id', $config, 'Config should contain property "id"' );
		$this->assertArrayHasKey( 'title', $config, 'Config should contain property "title"' );
		$this->assertArrayHasKey( 'icon', $config, 'Config should contain property "icon"' );
		$this->assertArrayHasKey( 'html', $config, 'Config should contain property "html"' );
		$this->assertArrayHasKey( 'css', $config, 'Config should contain property "css"' );
		$this->assertArrayHasKey( 'defaultValue', $config, 'Config should contain property "defaultValue"' );
		$this->assertArrayHasKey( 'dataKeys', $config, 'Config should contain property "dataKeys"' );
		$this->assertArrayHasKey( 'hasData', $config, 'Config should contain property "hasData"' );
		$this->assertEquals( 'LatestComments', $config['id'], 'Config should contain correct id' );

	}

}