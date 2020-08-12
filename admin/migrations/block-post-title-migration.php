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
		return '1.0.82';
	}

	/**
	 * @return mixed|void
	 */
	public function execute() {

		try {
			global $wpdb;
			$invalidBlocks = $wpdb->get_results(
				"SELECT p.ID, p.post_title FROM {$wpdb->posts} p 
						WHERE p.post_type='brizy-global-block' OR p.post_type='brizy-saved-block'" );

			if ( is_array( $invalidBlocks ) ) {
				foreach ( $invalidBlocks as $id => $block ) {
					if ( $block->post_title != '' ) {
						continue;
					}

					$name = md5( time() . $id );
					$wpdb->query(
						$wpdb->prepare( "UPDATE {$wpdb->posts} 
												SET `post_title` = %s, `post_name` = %s 
												WHERE ID=%d ", array( $name, $name, $block->ID ) )
					);
				}
			}
		} catch ( Exception $e ) {
			return;
		}
	}
}
