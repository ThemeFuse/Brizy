<?php

class Brizy_Admin_Migrations_SiteSettingsMigration implements Brizy_Admin_Migrations_MigrationInterface  {

	/**
	 * @return int|mixed
	 */
	public function getPriority() {
		return 0;
	}

	/**
	 * Return the version
	 *
	 * @return mixed
	 */
	public function getVersion() {
		return '1.0.118';
	}

	/**
	 * @return int|mixed|WP_Error
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public function execute() {

		delete_option('brizy-social-title');
		delete_option('brizy-social-description');
		delete_option('brizy-custom-css');
		delete_option('brizy-header-injection');
		delete_option('brizy-footer-injection');
		delete_option('brizy-social-thumbnail');
		delete_option('brizy-settings-favicon');
	}
}
