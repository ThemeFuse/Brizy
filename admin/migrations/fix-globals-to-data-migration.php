<?php

class Brizy_Admin_Migrations_FixGlobalsToDataMigration implements Brizy_Admin_Migrations_MigrationInterface {

	use Brizy_Admin_Migrations_PostsTrait;

	/**
	 * Return the version
	 *
	 * @return mixed
	 */
	public function getVersion() {
		return '1.0.97';
	}

	/**
	 * @return mixed|void
	 * @throws Exception
	 */
	public function execute() {

		try {
			$projectPost = $this->getProjectPost();

			if ( ! $projectPost ) {
				Brizy_Logger::instance()->critical( 'Filed migration Brizy_Admin_Migrations_FixGlobalsToDataMigration. We did not found any projects.', [] );
				return;
			}

			$storage = Brizy_Editor_Storage_Project::instance( $projectPost->ID );

			if ( $data = $storage->get( 'data', false ) ) {
				update_post_meta( $projectPost->ID, 'brizy-bk-' . get_class( $this ) . '-' . $this->getVersion(), $storage->get_storage() );

				$beforeMergeGlobals = json_decode( base64_decode( $data ) );
				$editorBuildPath    = Brizy_Editor_UrlBuilder::editor_build_path();

				$context          = new \Brizy\DataToProjectContext( $beforeMergeGlobals, $editorBuildPath );
				$projectMigration = new \Brizy\FixDataToProjectTransformer();
				$mergedGlobals    = $projectMigration->execute( $context );
				$storage->set( 'data', base64_encode( json_encode( $mergedGlobals ) ) );
			}

		} catch ( Exception $e ) {
			Brizy_Logger::instance()->critical( 'Filed migration Brizy_Admin_Migrations_GlobalsToDataMigration', [ $e ] );
			throw $e;
		}
	}

	public function getPriority() {
		return 0;
	}
}
