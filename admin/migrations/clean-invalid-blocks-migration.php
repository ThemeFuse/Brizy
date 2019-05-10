<?php

class Brizy_Admin_Migrations_CleanInvalidBlocksMigration implements Brizy_Admin_Migrations_MigrationInterface {

	/**
	 * Return the version
	 *
	 * @return mixed
	 */
	public function getVersion() {
		return '1.0.74';
	}

	/**
	 * @return mixed|void
	 */
	public function execute() {

		try {
			global $wpdb;

			$invalidBlocks = $wpdb->get_results(
				"SELECT ID FROM {$wpdb->posts} p 
						LEFT JOIN {$wpdb->postmeta} m ON m.post_id=p.id and m.meta_key='brizy'
						WHERE p.post_type='brizy-global-block' and m.meta_value is NULL" );

			if ( is_array( $invalidBlocks ) ) {
				foreach ( $invalidBlocks as $block ) {
					$wpdb->query( "DELETE FROM {$wpdb->posts} WHERE ID={$block->ID}" );
					$wpdb->query( "DELETE FROM {$wpdb->postmeta} WHERE post_id={$block->ID}" );
				}
			}

		} catch ( Exception $e ) {
			return;
		}
	}

}