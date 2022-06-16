<?php

class Brizy_Admin_Migrations_ChangePostTypesNames implements Brizy_Admin_Migrations_MigrationInterface {

	/**
	 * @return int
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
		return '2.4.0';
	}

	/**
	 * @return mixed|void
	 */
	public function execute() {

		global $wpdb;

		$types = [
			'brizy_template'     => 'editor-template',
			'brizy-popup'        => 'editor-popup',
			'brizy-form-entry'   => 'editor-form-entry',
		];

		foreach ( $types as $old => $new ) {
			$wpdb->update( $wpdb->posts, [ 'post_type' => $new ], [ 'post_type' => $old ] );
			$wpdb->query( "UPDATE {$wpdb->posts} SET guid = REPLACE(guid, '{$old}', '{$new}') WHERE guid LIKE '%{$old}%'" );
		}

		// Update display conditions for global blocks and popups
		$rows = $wpdb->get_results( "SELECT post_id, meta_value FROM {$wpdb->postmeta} WHERE meta_key = 'brizy-rules' AND meta_value LIKE '%brizy_template%'", ARRAY_A );

		foreach ( $rows as $row ) {
			if ( ! ( $rules = maybe_unserialize( $row['meta_value'] ) ) ) {
				continue;
			}

			foreach ( $rules as &$rule ) {
				if ( isset( $rule['entityType'] ) && $rule['entityType'] == 'brizy_template' ) {
					$rule['entityType'] = 'editor-template';
				}
			}

			update_metadata( 'post', $row['post_id'], 'brizy-rules', $rules );
		}
	}
}
