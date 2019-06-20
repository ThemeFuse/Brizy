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
		$this->assertArrayHasKey( 'dataApiKeys', $config, 'Config should contain property "dataApiKeys"' );
		$this->assertEquals( 'LatestComments', $config['id'], 'Config should contain correct id' );

	}

	/**
	 * @return mixed
	 */
	public function test_getData() {
		$context   = new Brizy_Editor_Components_Context();
		$component = new Brizy_Editor_Components_LatestComments_Main();
		$component->setContext( $context );
	}

	/**
	 * @return string[]
	 */
	public function test_getAssets() {
		$context   = new Brizy_Editor_Components_Context();
		$component = new Brizy_Editor_Components_LatestComments_Main();
		$component->setContext( $context );
	}

	/**
	 * @return string
	 */
	protected function test_getHtmlTemplate() {
		$context   = new Brizy_Editor_Components_Context();
		$component = new Brizy_Editor_Components_LatestComments_Main();
		$component->setContext( $context );
	}

	/**
	 * @return string
	 */
	protected function test_getCssTemplate() {
		$context   = new Brizy_Editor_Components_Context();
		$component = new Brizy_Editor_Components_LatestComments_Main();
		$component->setContext( $context );
	}
}