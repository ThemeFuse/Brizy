<?php

class BrizyAdminFontsHandlerTest extends \Codeception\TestCase\Test {
	/**
	 * @var \UnitTester
	 */
	protected $tester;

	public function testSomeFeature() {
		$urlBuilder = $this->createMock( 'Brizy_Editor_UrlBuilder' );
		$handler    = new Brizy_Admin_Fonts_Handler( $urlBuilder, [] );

		$this->tester->assertContains( Brizy_Admin_Fonts_Handler::ENDPOINT, $handler->query_vars( [] ), 'It should add endpoint brizy_font' );
	}

}