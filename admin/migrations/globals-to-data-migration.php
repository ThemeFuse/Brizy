<?php

class Brizy_Admin_Migrations_GlobalsToDataMigration implements Brizy_Admin_Migrations_MigrationInterface {

	/**
	 * Return the version
	 *
	 * @return mixed
	 */
	public function getVersion() {
		return '1.0.76';
	}

	/**
	 * @return mixed|void
	 * @throws Exception
	 */
	public function execute() {

		try {
			$projectPost = Brizy_Editor_Project::getPost();

			if ( ! $projectPost ) {
				return;
			}

			$storage = Brizy_Editor_Storage_Project::instance( $projectPost->ID );

			if ( $globals = $storage->get( 'globals' ) ) {
				update_post_meta( $projectPost->ID, 'brizy-bk-' . get_class( $this ) . '-' . $this->getVersion(), $storage->get_storage() );

				$beforeMergeGlobals = json_decode( base64_decode( $globals ) );
				$editorBuildPath    = BRIZY_PLUGIN_PATH .
				                      DIRECTORY_SEPARATOR . "public" .
				                      DIRECTORY_SEPARATOR . "editor-build";
				$projectMigration   = new \Brizy\DataToProjectTransformer( $editorBuildPath );
				$mergedGlobals      = $projectMigration->execute( $beforeMergeGlobals );
				$storage->set( 'data', base64_encode( json_encode( $mergedGlobals ) ) );
				$storage->delete( 'globals' );
			}

		} catch ( Exception $e ) {
			return;
		}
	}

	public function getPriority() {
		return 10;
	}
}