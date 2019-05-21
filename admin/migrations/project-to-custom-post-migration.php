<?php

class Brizy_Admin_Migrations_ProjectToCustomPostMigration implements Brizy_Admin_Migrations_MigrationInterface {


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
		return '1.0.30';
	}

	/**
	 * @return int|mixed|WP_Error
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public function execute() {

		if ( $this->isGlobalProjectCreated() ) {
			return;
		}

		$storage     = Brizy_Editor_Storage_Common::instance();
		$projectData = $storage->get( Brizy_Editor_Project::BRIZY_PROJECT, false );

		if ( is_array( $projectData ) ) {
			$projectData = unserialize( $projectData['api_project'] );
		} elseif ( $projectData instanceof Brizy_Editor_Project ) {
			$projectData            = $projectData->getApiProject()->get_data();
		} else {
			return;
		}

		if ( base64_encode( base64_decode( $projectData['globals'] ) ) !== $projectData['globals'] ) {
			$projectData['globals'] = base64_encode( $projectData['globals'] );
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

	public function isGlobalProjectCreated() {
		global $wpdb;

		$projectId = $wpdb->get_var( $wpdb->prepare( " SELECT ID FROM {$wpdb->posts} WHERE post_type=%s", Brizy_Editor_Project::BRIZY_PROJECT ) );

		return ! is_null( $projectId ) && $projectId > 0;

	}
}