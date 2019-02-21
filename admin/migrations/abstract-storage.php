<?php

abstract class Brizy_Admin_Migrations_AbstractStorage {

	const KEY = 'brizy-migrations';

	/**
	 * @var Brizy_Admin_Migrations_MigrationInterface[]
	 */
	protected $data;

	/**
	 * Brizy_Admin_Migations_AbstractStorage constructor.
	 */
	public function __construct() {
		$this->data = array();
		$this->loadData();
	}

	/**
	 * Save run migrations
	 *
	 * @return mixed
	 */
	abstract protected function storeData();

	/**
	 * @return mixed
	 */
	abstract protected function loadData();

	/**
	 * @return $this
	 */
	public function save() {
		$this->storeData();

		return $this;
	}

	/**
	 * @param Brizy_Admin_Migrations_MigrationInterface $migration
	 *
	 * @return $this
	 */
	public function addMigration( Brizy_Admin_Migrations_MigrationInterface $migration ) {

		if ( ! $this->hasMigration( $migration ) ) {
			$this->data[] = $migration;
		}

		return $this;
	}

	/**
	 * @@return Brizy_Admin_Migrations_MigrationInterface[]
	 */
	public function getMigrations() {
		return $this->data;
	}

	/**
	 * @param Brizy_Admin_Migrations_MigrationInterface $amigratoin
	 *
	 * @return bool
	 */
	public function hasMigration( Brizy_Admin_Migrations_MigrationInterface $amigratoin ) {
		$aMigrationClass = get_class( $amigratoin );
		foreach ( $this->data as $migration ) {
			if ( get_class( $migration ) == $aMigrationClass ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * @return Brizy_Admin_Migrations_MigrationInterface|mixed
	 */
	public function latestMigration() {
		return end( $this->data );
	}
}