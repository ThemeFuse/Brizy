<?php

class Brizy_Admin_Migrations_GlobalVersionsMigration implements Brizy_Admin_Migrations_MigrationInterface {

	/**
	 * @return int|mixed
	 */
	public function getPriority() {
		return 0;
	}

	/**
	 * Return the version
	 *
	 * @return mixed
	 */
	public function getVersion() {
		return '1.0.45';
	}

	/**
	 * @return int|mixed|WP_Error
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public function execute() {

		try {
			$postProjectId  = Brizy_Editor_Project::get()->getWpPost()->ID;
			$projectStorage = Brizy_Editor_Storage_Project::instance( $postProjectId );

			$pluginVersion = $projectStorage->get( 'pluginVersion', false );

			if ( ! $pluginVersion ) {
				// this is going to fix the plugin and editor version
				$projectStorage->set( 'pluginVersion', BRIZY_VERSION );
				$projectStorage->set( 'editorVersion', BRIZY_EDITOR_VERSION );
				$projectStorage->delete( 'version' );
			}

		} catch ( Exception $e ) {
			return;
		}
	}

}