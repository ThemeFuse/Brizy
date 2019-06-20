<?php

class ComponentsTest extends \Codeception\Test\Unit {

	public function setUp(): void {
		// Before...
		parent::setUp();

		// Your set up methods here.
	}

	public function tearDown(): void {
		// Your tear down methods here.

		// Then...
		parent::tearDown();
	}

	public function invalidComponents() {
		return [ [ 1 ], [ '1' ], [ [] ], [ null ] ];
	}

	/**
	 * @dataProvider invalidComponents
	 *
	 * @param $component
	 */
	public function testAddComponent( $component ) {
		$this->expectException( 'Error' );
		$components = Brizy_Public_Components::instance();
		$components->addComponent( $component );
	}

	public function testInitialize() {

		add_action( 'brizy-editor-components', function ( $components ) {
			$filterComponent = $this->getMockBuilder( Brizy_Editor_Components_Abstract_Component::class )
			                        ->disableOriginalConstructor()
			                        ->setMethods( [ 'getAssets', 'getId' ] )
			                        ->getMockForAbstractClass();
			$filterComponent->expects( $this->once() )->method( 'getAssets' )->willReturn( [ 'filePath.css' ] );
			$filterComponent->expects( $this->any() )->method( 'getId' )->willReturn( 'FILTER_UID_String' );

			$components[] = $filterComponent;

			return $components;
		} );


		$component = $this->getMockBuilder( Brizy_Editor_Components_Abstract_Component::class )
		                  ->disableOriginalConstructor()
		                  ->setMethods( [ 'getAssets', 'getUid' ] )
		                  ->getMockForAbstractClass();
		$component->expects( $this->once() )->method( 'getAssets' )->willReturn( [ 'filePath.js', 'filePath.css' ] );
		$component->expects( $this->any() )->method( 'getId' )->willReturn( 'UID_String' );

		$components = Brizy_Public_Components::instance();
		$components->addComponent( $component );
		$components->initialize();

		// assert assets are enqueued
		$scripts = wp_scripts();
		$styles  = wp_styles();

		$this->assertNotNull( $scripts->registered[ "brizy_component_script_" . $component->getId() . "_0" ], 'The component script assets must be enqueued' );
		$this->assertNotNull( $styles->registered[ "brizy_component_style_" . $component->getId() . "_1" ], 'The component style assets must be enqueued' );
		$this->assertNotNull( $styles->registered["brizy_component_style_FILTER_UID_String_0"], 'The filter component style assets must be enqueued' );


		$aComponent = $components->getComponent( 'UID_String' );

		$this->assertSame( $aComponent, $component, 'It should return the correct component' );

	}
}
