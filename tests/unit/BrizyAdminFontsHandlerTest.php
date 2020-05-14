<?php

class BrizyAdminFontsHandlerTest extends\Codeception\TestCase\WPTestCase {
	/**
	 * @var \UnitTester
	 */
	protected $tester;

	protected function _before() {
		wp_cache_flush();
		global $wpdb;
		$wpdb->db_connect();
	}

	public function testQueryVars() {
		$urlBuilder = $this->createMock( 'Brizy_Editor_UrlBuilder' );
		$handler    = new Brizy_Admin_Fonts_Handler( $urlBuilder, [] );
		$this->tester->assertContains( Brizy_Editor::prefix(Brizy_Admin_Fonts_Handler::ENDPOINT), $handler->query_vars( [] ), 'It should add endpoint brizy_font' );
	}

	public function testAddFontTypes() {
		$urlBuilder = $this->createMock( 'Brizy_Editor_UrlBuilder' );
		$handler    = new Brizy_Admin_Fonts_Handler( $urlBuilder, [] );
		$this->tester->assertContains( Brizy_Editor::prefix(Brizy_Admin_Fonts_Handler::ENDPOINT), $handler->query_vars( [] ), 'It should add endpoint brizy_font' );
	}

}