<?php

class Brizy_Admin_Migrations_CleanInvalidBlocksMigration implements Brizy_Admin_Migrations_MigrationInterface {

	/**
	 * Return the version
	 *
	 * @return mixed
	 */
	public function getVersion() {
		return '1.0.74';
	}

	/**
	 * @return mixed|void
	 */
	public function execute() {

		// disable this migration because of suspected data loss
		return;
	}

	public function getPriority() {
		return 0;
	}

}