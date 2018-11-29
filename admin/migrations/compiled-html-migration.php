<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 11/29/18
 * Time: 4:47 PM
 */

class Brizy_Admin_Migrations_CompiledHtmlMigration implements Brizy_Admin_Migrations_MigrationInterface {

	/**
	 * Return the version
	 *
	 * @return mixed
	 */
	public function getVersion() {
		return '1.0.48';
	}

	/**
	 * @return int|mixed|WP_Error
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public function execute() {

		$result = $this->get_posts_and_meta();

		foreach ( $result as $data ) {

			$postMigrationStorage = new Brizy_Admin_Migrations_PostStorage( $data->ID );
			if ( $postMigrationStorage->hasMigration( $this ) ) {
				continue;
			}

			$instance       = Brizy_Editor_Storage_Post::instance( $data->ID );
			$metaValueArray = $instance->get_storage();

			if ( ! $metaValueArray[ Brizy_Editor_Post::BRIZY_POST ] ) {
				throw new Exception( 'Invalid post data' );
			}

			update_post_meta( $data->ID, 'brizy-bk-' . get_class( $this ) . '-' . $this->getVersion(), $metaValueArray );

			if ( base64_encode( base64_decode( $metaValueArray[ Brizy_Editor_Post::BRIZY_POST ]['compiled_html'], true ) )
			     !==
			     $metaValueArray[ Brizy_Editor_Post::BRIZY_POST ]['compiled_html'] ) {
				$metaValueArray[ Brizy_Editor_Post::BRIZY_POST ]['compiled_html'] = base64_encode( $metaValueArray[ Brizy_Editor_Post::BRIZY_POST ]['compiled_html'] );
			}

			if ( base64_encode( base64_decode( $metaValueArray[ Brizy_Editor_Post::BRIZY_POST ]['compiled_html_body'], true ) )
			     !==
			     $metaValueArray[ Brizy_Editor_Post::BRIZY_POST ]['compiled_html_body'] ) {
				$metaValueArray[ Brizy_Editor_Post::BRIZY_POST ]['compiled_html_body'] = base64_encode( $metaValueArray[ Brizy_Editor_Post::BRIZY_POST ]['compiled_html_body'] );
			}

			if ( base64_encode( base64_decode( $metaValueArray[ Brizy_Editor_Post::BRIZY_POST ]['compiled_html_head'], true ) )
			     !==
			     $metaValueArray[ Brizy_Editor_Post::BRIZY_POST ]['compiled_html_head'] ) {
				$metaValueArray[ Brizy_Editor_Post::BRIZY_POST ]['compiled_html_head'] = base64_encode( $metaValueArray[ Brizy_Editor_Post::BRIZY_POST ]['compiled_html_head'] );
			}

			$storage = Brizy_Editor_Storage_Post::instance( $data->ID );
			$storage->loadStorage( $metaValueArray );

			// set that migration was successful executed
			$postMigrationStorage->addMigration($this)->save();
		}


	}

	public function get_posts_and_meta() {
		global $wpdb;

		// query all posts (all post_type, all post_status) that have meta_key = 'brizy' and is not 'revision'
		return $wpdb->get_results( "
			SELECT p.ID, pm.meta_value FROM {$wpdb->postmeta} pm
			LEFT JOIN {$wpdb->posts} p ON p.ID = pm.post_id
			WHERE pm.meta_key = 'brizy'
			AND p.post_type != 'attachment'
		" );
	}

}