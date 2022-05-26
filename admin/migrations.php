<?php

class Brizy_Admin_Migrations {

	const BRIZY_MIGRATIONS = 'brizy_migrations';

	/**
	 * @var Brizy_Admin_Migrations_GlobalStorage
	 */
	private $globalStorage;

	/**
	 * @var Brizy_Admin_Migrations_MigrationInterface[]
	 */
	private $existinMigrations;

	/**
	 * Brizy_Admin_Migrations constructor.
	 */
	public function __construct() {
		$this->existinMigrations = array();
		$this->globalStorage     = new Brizy_Admin_Migrations_GlobalStorage();
	}

	/**
	 * @param $version
	 */
	public function runMigrations( $version ) {

		$migrations = $this->getExistingMigrations();

		$latestExecutedMigration = $this->getLatestRunMigration();
		$latestExecutedVersion   = $latestExecutedMigration->getVersion();
		$latestMigrationVersion  = end( $migrations );

		$version_compare = version_compare( $version, $latestExecutedVersion );

		if ( $version_compare === 1 && $latestMigrationVersion->getVersion() != $latestExecutedMigration->getVersion() ) {
			$this->upgradeTo( $version );
		}
	}


	/**
	 * @return Brizy_Admin_Migrations_MigrationInterface[]
	 */
	private function getExistingMigrations() {

		if ( count( $this->existinMigrations ) ) {
			return $this->existinMigrations;
		}

		$migrations = array(
			new Brizy_Admin_Migrations_BlockPostTitleMigration,
			new Brizy_Admin_Migrations_CleanInvalidBlocksMigration,
			new Brizy_Admin_Migrations_CleanLogsMigration,
			new Brizy_Admin_Migrations_FormSerializationMigration,
			new Brizy_Admin_Migrations_GlobalBlocksToCustomPostMigration,
			new Brizy_Admin_Migrations_GlobalVersionsMigration,
			new Brizy_Admin_Migrations_GlobalsToDataMigration,
			new Brizy_Admin_Migrations_NullMigration,
			new Brizy_Admin_Migrations_ProjectToCustomPostMigration,
			new Brizy_Admin_Migrations_RulesMigration,
			new Brizy_Admin_Migrations_ShortcodesMobileOneMigration,
			new Brizy_Admin_Migrations_FixGlobalsToDataMigration,
			new Brizy_Admin_Migrations_ScreenshotMigration,
			new Brizy_Admin_Migrations_UseEditorMigration,
			new Brizy_Admin_Migrations_AttachmentUidMigration,
			new Brizy_Admin_Migrations_ChangePostTypesNames,
		);

		usort( $migrations, function ( $a, $b ) {
			return version_compare( $a->getVersion(), $b->getVersion() );
		} );

		$migrations = array_filter( $migrations, function ( $migration ) {
			return in_array( version_compare( $migration->getVersion(), BRIZY_VERSION ), array( - 1, 0 ) );
		} );

		return $this->existinMigrations = $migrations;
	}


	/**
	 * @return Brizy_Admin_Migrations_MigrationInterface|mixed
	 */
	private function getLatestRunMigration() {

		$latest = $this->globalStorage->latestMigration();

		if ( ! $latest instanceof Brizy_Admin_Migrations_MigrationInterface ) {
			$latest = new Brizy_Admin_Migrations_NullMigration();
		}

		return $latest;
	}


	/**
	 * @param string $version
	 */
	private function upgradeTo( $version ) {
		global $wpdb;

		wp_raise_memory_limit( 'image' );

		Brizy_Logger::instance()->debug( 'Starting migration process: [upgrading]' );

		/**
		 * @var Brizy_Admin_Migrations_MigrationInterface
		 */
		$latestExecutedVersion   = BRIZY_VERSION;
		$latestExecutedMigration = $this->getLatestRunMigration();
		if ( $latestExecutedMigration ) {
			$latestExecutedVersion = $latestExecutedMigration->getVersion();
		}
		Brizy_Logger::instance()->debug( "Upgrading to version [{$version}] from version: [{$latestExecutedVersion}]: ", array( $version ) );

		/**
		 * @var Brizy_Admin_Migrations_MigrationInterface[]
		 */
		$migrationsToRun = $this->getExistingMigrations();

		if ( $latestExecutedMigration ) {
			$migrationsToRun = array_filter( $migrationsToRun, function ( $migration ) use ( $latestExecutedMigration, $version ) {
				$version_compare1 = version_compare( $latestExecutedMigration->getVersion(), $migration->getVersion() );
				$version_compare2 = version_compare( $migration->getVersion(), $version );

				return $version_compare1 == - 1 && ( $version_compare2 == - 1 || $version_compare2 == 0 );
			} );
		}

		$migrations = array();

		foreach ( $migrationsToRun as $m ) {
			$migrations[ $m->getVersion() ][] = $m;
		}

		foreach ( $migrations as $v => $m ) {
			//prioritise migrations
			usort( $migrations[ $v ], function ( $a, $b ) {
				$p1 = $a->getPriority();
				$p2 = $b->getPriority();

				if ( $p1 == $p2 ) {
					return 0;
				}

				return ( $p1 < $p2 ) ? - 1 : 1;
			} );
		}

		// run migrations
		foreach ( $migrations as $versionMigrations ) {
			try {
				$wpdb->query( 'START TRANSACTION ' );

				foreach ( $versionMigrations as $migration ) {
					$migrationClass = get_class( $migration );

					$migration->execute();

					Brizy_Logger::instance()->debug( 'Run migration: ' . $migrationClass, array( $migrationClass ) );

					$this->globalStorage->addMigration( $migration )->save();

					Brizy_Editor_Project::cleanClassCache();
					Brizy_Editor_Post::cleanClassCache();
					Brizy_Editor_Block::cleanClassCache();
				}

				$wpdb->query( 'COMMIT' );
			} catch ( Exception $e ) {
				$wpdb->query( 'ROLLBACK' );
				Brizy_Logger::instance()->critical( 'Migration process ERROR', [ $migrationClass, $e->getTraceAsString() ] );
				break;
			}
		}

		Brizy_Logger::instance()->debug( 'Migration process successful' );
	}
}
