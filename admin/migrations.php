<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 9/12/18
 * Time: 4:37 PM
 */

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
	 * @param Brizy_Editor_Post $post
	 * @param string $version
	 */
	public function runMigrationsBasedOnPost( Brizy_Editor_Post $post, $version ) {

		$migrations = $this->getExistingMigrations();

		$postMigrationStorage    = new Brizy_Admin_Migrations_PostStorage( $post->get_parent_id() );
		$latestExecutedMigration = $postMigrationStorage->latestMigration();
		$latestMigrationVersion  = end( $migrations );

		// decide if we need to run the migrations
		// if there is no executed migrations we have two cases..
		// 1. the post is new and no migration should be run
		// 2. the post is old and we need to run the migrations
		// if the latest executed migrations is old that the $version we need to run the migrations
		$runMigrations = false;

		if ( ! $latestExecutedMigration ) {
			if ( $post->get_editor_data() ) {
				$runMigrations = true;
			}
		} else {
			$runMigrations = version_compare( $version, $latestExecutedMigration->getVersion() ) == 1 &&
			                 $latestMigrationVersion->getVersion() != $latestExecutedMigration->getVersion();
		}

		if ( $runMigrations ) {
			$this->runAllMigrations( $postMigrationStorage );
		}
	}


	/**
	 * @return Brizy_Admin_Migrations_MigrationInterface[]
	 */
	private function getExistingMigrations() {

		if ( count( $this->existinMigrations ) ) {
			return $this->existinMigrations;
		}

		$path = BRIZY_PLUGIN_PATH . DIRECTORY_SEPARATOR . 'admin' . DIRECTORY_SEPARATOR . 'migrations' . DIRECTORY_SEPARATOR . '*-migration.php';

		$migrations = array();

		foreach ( glob( $path ) as $file ) {
			$baseName  = basename( $file );
			$className = $this->getMigrationClassName( $baseName );

			$migrations[] = new $className;
		}

		usort( $migrations, function ( $a, $b ) {
			return version_compare( $a->getVersion(), $b->getVersion() );
		} );

		$migrations = array_filter( $migrations, function ( $migration ) {
			return in_array( version_compare( $migration->getVersion(), BRIZY_VERSION ), array( - 1, 0 ) );
		} );

		return $this->existinMigrations = $migrations;
	}

	/**
	 * @param $file
	 *
	 * @return string
	 */
	private function getMigrationClassName( $file ) {
		$matches = array();
		preg_match( "/^(.*)-migration\.php$/", $file, $matches );

		$classNamePart = '';
		foreach ( explode( '-', $matches['1'] ) as $part ) {
			$classNamePart .= ucfirst( $part );
		}

		return sprintf( 'Brizy_Admin_Migrations_%sMigration', $classNamePart );
	}

	/**
	 * @return Brizy_Admin_Migrations_MigrationInterface|mixed
	 */
	private function getLatestRunMigration() {

		$latest = $this->globalStorage->latestMigration();

		if ( ! $latest ) {
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

		foreach ( $migrationsToRun as $migration ) {

			try {
				$wpdb->query( 'START TRANSACTION ' );

				$migrationClass = get_class( $migration );

				$migration->execute();

				Brizy_Logger::instance()->debug( 'Run migration: ' . $migrationClass, array( $migrationClass ) );

				$this->globalStorage->addMigration( $migration )->save();

				$wpdb->query( 'COMMIT' );

			} catch ( Exception $e ) {
				$wpdb->query( 'ROLLBACK' );
				Brizy_Logger::instance()->debug( 'Migration process ERROR', $e );
			}
		}

		Brizy_Logger::instance()->debug( 'Migration process successful' );
	}


	public function runAllMigrations( Brizy_Admin_Migrations_PostStorage $postMigrationStorage ) {
		global $wpdb;

		wp_raise_memory_limit( 'image' );

		Brizy_Logger::instance()->debug( 'Starting migration process: [upgrading]' );

		/**
		 * @var Brizy_Admin_Migrations_MigrationInterface[]
		 */
		$migrationsToRun = $this->getExistingMigrations();

		foreach ( $migrationsToRun as $migration ) {

			try {
				$wpdb->query( 'START TRANSACTION ' );

				$migrationClass = get_class( $migration );

				$migration->execute();

				Brizy_Logger::instance()->debug( 'Run migration: ' . $migrationClass, array( $migrationClass ) );

				$postMigrationStorage->addMigration( $migration )->save();

				$wpdb->query( 'COMMIT' );

			} catch ( Exception $e ) {
				$wpdb->query( 'ROLLBACK' );
				Brizy_Logger::instance()->debug( 'Migration process ERROR', $e );
			}
		}

		Brizy_Logger::instance()->debug( 'Migration process successful' );
	}


}