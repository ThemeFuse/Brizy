<?php


class TwigLoaderTest extends \Codeception\Test\Unit {


	public function test_getSource() {
		$component = $this->prophesize( Brizy_Editor_Components_Abstract_Component::class );
		$component->getConfig()->willReturn( [ 'html' => 'HTML_TEMPLATE_STRING' ] );

		$loader  = new Brizy_Editor_Components_TwigLoader( $component->reveal() );
		$source1 = $loader->getSource( 'template' );
		$source2 = $loader->getSource( 'random string' );

		$this->assertEquals( $source1, 'HTML_TEMPLATE_STRING', 'I should return the component html template' );
		$this->assertEquals( $source1, $source2, 'It should return the same template for any keys' );
	}


	public function test_getCacheKey() {

		$component = $this->prophesize( Brizy_Editor_Components_Abstract_Component::class );
		$component->getConfig()->willReturn( [ 'html' => 'HTML_TEMPLATE_STRING' ] );

		$loader = new Brizy_Editor_Components_TwigLoader( $component->reveal() );

		$this->assertEquals( md5( 'template' ), $loader->getCacheKey( 'template' ), 'It should return md5 of the provided key' );
		$this->assertEquals( md5( 'test' ), $loader->getCacheKey( 'test' ), 'It should return md5 of the provided key' );
	}

	public function test_isFresh() {
		$component = $this->prophesize( Brizy_Editor_Components_Abstract_Component::class );
		$component->getConfig()->willReturn( [ 'html' => 'HTML_TEMPLATE_STRING' ] );

		$loader = new Brizy_Editor_Components_TwigLoader( $component->reveal() );

		$this->assertFalse( $loader->isFresh( 'template', time() ), 'It should always return false' );
		$this->assertFalse( $loader->isFresh( 'test', time() ), 'It should always return false' );
	}
}
