<?php

class Brizy_Admin_Migrations_CleanLogsMigration implements Brizy_Admin_Migrations_MigrationInterface {

	/**
	 * Return the version
	 *
	 * @return mixed
	 */
	public function getVersion() {
		return '1.0.93';
	}

	/**
	 * @return mixed|void
	 * @throws Exception
	 */
	public function execute() {

		try {
			Brizy_Logger::clean();
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->critical( 'Filed migration Brizy_Admin_Migrations_CleanLogsMigration', [] );
			throw $e;
		}
	}

	public function getPriority() {
		return 10;
	}
}