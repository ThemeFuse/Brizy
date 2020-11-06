<?php


class Brizy_Admin_Migrations_DeleteTemplateRulesMigration implements Brizy_Admin_Migrations_MigrationInterface {

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
		return '2.0.13';
	}

	/**
	 * Run this method when upgrading.
	 *
	 * @return mixed
	 */
	public function execute() {
		try {
			global $wpdb;
			$wpdb->query( "DELETE m FROM  `{$wpdb->prefix}postmeta` m
								 JOIN `{$wpdb->prefix}posts` p ON p.id=m.post_id and p.post_type NOT IN ('brizy-template','revision')
								 WHERE meta_key='brizy-rules'" );
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->critical( 'Filed migration Brizy_Admin_Migrations_DeletetemplateRulesMigration', [] );
			throw $e;
		}
	}
}
