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
	 * Brizy_Admin_Migrations constructor.
	 */
	public function __construct() {

	}

	/**
	 * @param $version
	 */
	public function migrateTo( $version ) {

		$latestExecutedMigration = $this->getLatestRunMigration();

		if ( $latestExecutedMigration ) {
			$latestVersion = $latestExecutedMigration->getVersion();
		} else {
			$latestVersion = BRIZY_VERSION;
		}


		if ( version_compare( $version, $latestVersion ) === 1 ) {
			// upgrade
			// execute all migration that were not run
			$this->upgradeTo( $version );
		}
	}

	/**
	 * @param string $version
	 */
	private function upgradeTo( $version ) {

		global $wpdb;

		$wpdb->query( 'START TRANSACTION ' );

		Brizy_Logger::instance()->debug( 'Starting migration process: [upgrading]' );


		try {

			/**
			 * @var Brizy_Admin_Migrations_MigrationInterface
			 */
			$latestExecutedMigration = $this->getLatestRunMigration();
			$latestExecutedVersion   = BRIZY_VERSION;
			if ( $latestExecutedMigration ) {
				$latestExecutedVersion = $latestExecutedMigration->getVersion();
			}
			Brizy_Logger::instance()->debug( "Upgrading to version [{$version}] from version: [{$latestExecutedVersion}]: ", array( $version ) );

			/**
			 * @var Brizy_Admin_Migrations_MigrationInterface[]
			 */
			$existingMigrations = $this->getExistingMigrations();

			$completedMigrations = array();

			foreach ( $existingMigrations as $migration ) {

				$vc  = version_compare( $migration->getVersion(), $latestExecutedMigration->getVersion() );
				$vc2 = version_compare( $migration->getVersion(), $version );
				if ( $vc == 1 && in_array( $vc2, [ - 1, 0 ] ) && ! $this->itWasExecuted( $migration )
				) {
					$migrationClass = get_class( $migration );

					$migration->execute();

					$completedMigrations[] = clone $migration;

					Brizy_Logger::instance()->debug( 'Run migration: ' . $migrationClass, array( $migrationClass ) );
				}

			}

			$wpdb->query( 'COMMIT' );

			$this->addExecutedMigrations( $completedMigrations );

			Brizy_Logger::instance()->debug( 'Migration process successful' );

		} catch ( Exception $e ) {
			$wpdb->query( 'ROLLBACK' );
			Brizy_Logger::instance()->debug( 'Migration process ERROR', $e );
		}
	}

	/**
	 * @return Brizy_Admin_Migrations_MigrationInterface[]
	 */
	private function getExistingMigrations() {

		$path = BRIZY_PLUGIN_PATH . DIRECTORY_SEPARATOR . 'admin' . DIRECTORY_SEPARATOR . 'migrations' . DIRECTORY_SEPARATOR . '*-migration.php';

		$migrations = array();

		foreach ( glob( $path ) as $file ) {
			$baseName  = basename( $file );
			$className = $this->getMigrationClassName( $baseName );

			$migrations[] = new $className;
		}

		return $migrations;
	}

	/**
	 * @return Brizy_Admin_Migrations_MigrationInterface[]
	 */
	private function getExecutedMigrations() {
		$executed   = get_option( self::BRIZY_MIGRATIONS, array() );
		$migrations = array();
		foreach ( $executed as $migration ) {
			$className    = $migration['class'];
			$migrations[] = new $className;
		}

		return $migrations;
	}

	/**
	 * @param $migrations
	 */
	private function addExecutedMigrations( $migrations ) {

		if ( count( $migrations ) == 0 ) {
			return;
		}

		$savedMigrations = $this->getExecutedMigrations();

		$all = array_merge( $savedMigrations, $migrations );

		$data = array();

		foreach ( $all as $migration ) {
			$data[] = array( 'version' => $migration->getVersion(), 'class' => get_class( $migration ) );
		}

		update_option( self::BRIZY_MIGRATIONS, $data );
	}

	/**
	 * @return Brizy_Admin_Migrations_MigrationInterface|mixed|void
	 */
	private function getLatestRunMigration() {
		$migrations = $this->getExecutedMigrations();

		if ( count( $migrations ) == 0 ) {
			return;
		}

		return end( $migrations );
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
	 * @param $migration
	 *
	 * @return bool
	 */
	public function itWasExecuted( $migration ) {
		$migrationClass  = get_class( $migration );
		$savedMigrations = $this->getExecutedMigrations();

		foreach ( $savedMigrations as $amigration ) {
			$aMigrationClass = get_class( $amigration );
			if ( $aMigrationClass == $migrationClass ) {
				return true;
			}
		}

		return false;
	}
}