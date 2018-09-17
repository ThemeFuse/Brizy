<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 9/13/18
 * Time: 4:47 PM
 */

class Brizy_Admin_Migrations_NullMigration implements Brizy_Admin_Migrations_MigrationInterface {

	/**
	 * Return the version
	 *
	 * @return mixed
	 */
	public function getVersion() {
		return '0.0.1';
	}

	/**
	 * Run this method when upgrading.
	 *
	 * @return mixed
	 */
	public function execute() {
		// this is a null migration
	}
}