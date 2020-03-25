<?php

class SiteSettingsMigrationCest {

	protected function _before( FunctionalTester $I ) {
		wp_cache_flush();
		global $wpdb;
		$wpdb->db_connect();
	}

	public function testExecute( FunctionalTester $I ) {
		$I->haveSiteOptionInDatabase('brizy-social-title','test_value');
		$I->haveSiteOptionInDatabase('brizy-social-description','test_value');
		$I->haveSiteOptionInDatabase('brizy-custom-css','test_value');
		$I->haveSiteOptionInDatabase('brizy-header-injection','test_value');
		$I->haveSiteOptionInDatabase('brizy-footer-injection','test_value');
		$I->haveSiteOptionInDatabase('brizy-social-thumbnail','test_value');
		$I->haveSiteOptionInDatabase('brizy-settings-favicon','test_value');

		$migration = new Brizy_Admin_Migrations_SiteSettingsMigration();
		$migration->execute();

		$I->dontSeeOptionInDatabase(['option_name'=>'brizy-social-title']);
		$I->dontSeeOptionInDatabase(['option_name'=>'brizy-social-description']);
		$I->dontSeeOptionInDatabase(['option_name'=>'brizy-custom-css']);
		$I->dontSeeOptionInDatabase(['option_name'=>'brizy-header-injection']);
		$I->dontSeeOptionInDatabase(['option_name'=>'brizy-footer-injection']);
		$I->dontSeeOptionInDatabase(['option_name'=>'brizy-social-thumbnail']);
		$I->dontSeeOptionInDatabase(['option_name'=>'brizy-settings-favicon']);
	}

}
