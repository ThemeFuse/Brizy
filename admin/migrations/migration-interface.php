<?php

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


	/**
	 * @return mixed
	 */
	public function getPriority();

}