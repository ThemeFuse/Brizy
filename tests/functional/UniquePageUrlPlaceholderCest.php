<?php


class UniquePageUrlPlaceholderCest {

	private $wpBackup;
	private $wpQueryBackup;

	public function _before( FunctionalTester $I ) {
		global $wp, $wp_query;
		$this->wpBackup      = $wp;
		$this->wpQueryBackup = $wp_query;
	}

	public function _after( FunctionalTester $I ) {
		$GLOBALS['wp']       = $this->wpBackup;
		$GLOBALS['wp_query'] = $this->wpQueryBackup;
	}

	private function getValue() {
		$placeholder = new Brizy_Content_Placeholders_UniquePageUrl( 'Unique page url' );
		$context     = Brizy_Content_ContextFactory::createContext( Brizy_Editor_Project::get(), null );

		return $placeholder->getValue( $context, new \BrizyPlaceholders\ContentPlaceholder( 'brizy_dc_current_page_unique_url', '{{brizy_dc_current_page_unique_url}}', [] ) );
	}

	/**
	 * Request supplied query vars must not break out of the HTML attribute the value is printed in.
	 *
	 * @param FunctionalTester $I
	 */
	public function archiveUrlIsEscapedTest( FunctionalTester $I ) {
		$GLOBALS['wp']                        = new WP();
		$GLOBALS['wp']->query_vars            = [ 'year' => '2026', 'sentence' => '\"><svg onload=alert(1)>' ];
		$GLOBALS['wp_query']                  = new WP_Query();
		$GLOBALS['wp_query']->is_archive      = true;
		$GLOBALS['wp_query']->is_year         = true;
		$GLOBALS['wp_query']->queried_object  = null;

		$value = $this->getValue();

		$I->assertStringNotContainsString( '"', $value, 'The value should not contain double quotes' );
		$I->assertStringNotContainsString( '<', $value, 'The value should not contain markup' );
		$I->assertStringNotContainsString( '>', $value, 'The value should not contain markup' );
		$I->assertStringContainsString( 'year=2026', $value, 'The value should keep the query vars' );
		$I->assertStringContainsString( 'sentence=%5C%22%3E%3Csvg', $value, 'The query var values should be url encoded' );
	}
}
