<?php


class Brizy_Admin_Migrations_UseEditorMigration implements Brizy_Admin_Migrations_MigrationInterface {

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
		return '2.2.6';
	}

	/**
	 * Run this method when upgrading.
	 *
	 * @return mixed
	 */
	public function execute() {
		try {
			global $wpdb;

			$brizyEnabled = Brizy_Editor_Constants::BRIZY_ENABLED;

			$var = (int)$wpdb->get_var("SELECT count(meta_id) FROM {$wpdb->postmeta} WHERE meta_key='brizy_enabled'");

			if($var > 0) return;

			$wpdb->query( "INSERT INTO {$wpdb->postmeta} (post_id,meta_key,meta_value) 
SELECT post_id,'brizy_enabled',POSITION('\"brizy-use-brizy\";b:1;' IN meta_value)>0 FROM {$wpdb->postmeta} where meta_key='brizy'" );
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->critical( 'Filed migration Brizy_Admin_Migrations_DeletetemplateRulesMigration', [] );
			throw $e;
		}
	}
}
