<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 9/13/18
 * Time: 4:47 PM
 */

class Brizy_Admin_Migrations_ProjectToCustomPostMigration implements Brizy_Admin_Migrations_MigrationInterface {

	/**
	 * Return the version
	 *
	 * @return mixed
	 */
	public function getVersion() {
		return '1.0.30';
	}

	/**
	 * @return int|mixed|WP_Error
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public function execute() {

		$storage     = Brizy_Editor_Storage_Common::instance();
		$projectData = $storage->get( Brizy_Editor_Project::BRIZY_PROJECT );

		if ( is_array( $projectData ) ) {
			$projectData = unserialize( $projectData['api_project'] );
		} elseif ( $projectData instanceof Brizy_Editor_Project ) {
			$projectData            = $projectData->getApiProject()->get_data();
			$projectData['globals'] = base64_encode( $projectData['globals'] );
		} else {
			throw new Exception( 'Invalid project data encountered' );
		}

		$post_id = wp_insert_post( array(
			'post_type'      => Brizy_Editor_Project::BRIZY_PROJECT,
			'post_title'     => 'Brizy Project',
			'post_status'    => 'publish',
			'comment_status' => 'closed',
			'ping_status'    => 'closed'
		) );

		$newProjectData = array(
			'id'        => $projectData['id'],
			'title'     => $projectData['title'],
			'globals'   => $projectData['globals'],
			'name'      => $projectData['name'],
			'user'      => $projectData['user'],
			'template'  => $projectData['template'],
			'created'   => $projectData['created'],
			'updated'   => $projectData['updated'],
			'languages' => $projectData['signature'],
			'version'   => $projectData['version'],
			'signature' => $projectData['signature'],
		);

		$storage = Brizy_Editor_Storage_Project::instance( $post_id );
		$storage->loadStorage( $newProjectData );

		return $post_id;

	}
}