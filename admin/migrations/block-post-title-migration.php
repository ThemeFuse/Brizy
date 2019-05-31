<?php

class Brizy_Admin_Migrations_BlockPostTitleMigration implements Brizy_Admin_Migrations_MigrationInterface {

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
		return '1.0.91';
	}

	/**
	 * @return int|mixed|WP_Error
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public function execute() {

			try {
				global $wpdb;

				$invalidBlocks = $wpdb->get_results(
					"SELECT p.ID FROM {$wpdb->posts} p  
					WHERE (p.post_type='brizy-global-block' or p.post_type='brizy-saved-block'");

				if ( is_array( $invalidBlocks ) ) {
					foreach ( $invalidBlocks as $id=>$block ) {

						$name = md5(time().$id);
						$wpdb->query( "UPDATE  {$wpdb->posts} SET post_title=  WHERE ID={$block->ID}" );
					}
				}

			} catch ( Exception $e ) {
				return;
			}
	}
}