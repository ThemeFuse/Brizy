<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 9/12/18
 * Time: 3:47 PM
 */

interface Brizy_Admin_Migrations_MigrationInterface {

	/**
	 * Return the version
	 *
	 * @return mixed
	 */
	public function getVersion();

	/**
	 * Run this method when upgrading.
	 *
	 * @return mixed
	 */
	public function execute();

}