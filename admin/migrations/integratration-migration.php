<?php

class Brizy_Admin_Migrations_IntegrationMigration implements Brizy_Admin_Migrations_MigrationInterface {

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
		return '1.0.124';
	}

	/**
	 * @return int|mixed|WP_Error
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public function execute() {
		$manager = new Brizy_Editor_Forms_FormManager( Brizy_Editor_Project::get() );
		$forms   = $manager->getAllForms();

		foreach ( $forms as $form ) {
			foreach ( $form->getIntegrations() as $integration ) {

				if ( $integration->isCompleted() ) {
					$integration->setEnabled( true );
					$form->updateIntegration( $integration );
				}
			}
			$manager->addForm( $form );
		}
	}
}
