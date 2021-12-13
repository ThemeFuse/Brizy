<?php

class Brizy_Admin_Migrations_AttachmentUidMigration implements Brizy_Admin_Migrations_MigrationInterface {

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
		return '2.3.21';
	}

	/**
	 * @return mixed|void
	 */
	public function execute() {

		try {
			global $wpdb;
			$invalidAttachments = $wpdb->get_results(
				"SELECT
						    p.ID as post_id,
       						'brizy_attachment_uid' as meta_key,
       						wp.meta_value as meta_value
						FROM {$wpdb->posts} p
						         JOIN {$wpdb->postmeta} wp on p.ID = wp.post_id and wp.meta_key='brizy_post_uid'
						         LEFT JOIN {$wpdb->postmeta} wp2 on p.ID = wp2.post_id and wp2.meta_key='brizy_attachment_uid'
						WHERE post_type='attachment' and wp2.meta_value is NULL", ARRAY_A );

			if ( is_array( $invalidAttachments ) ) {
				foreach ( $invalidAttachments as $id => $insertData ) {
					$wpdb->insert($wpdb->postmeta,$insertData);
				}
			}
		} catch ( Exception $e ) {
			return;
		}
	}
}
