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

		// check if the DB has traces of brizy plugin..
		// if yes then return version 0.0.1 to run all migrations
		// if no then return the current brizy version and no migration will be run

		$option = get_option( Brizy_Editor_Storage_Common::KEY, null );

		if ( is_null( $option ) ) {
			return BRIZY_VERSION;
		}

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