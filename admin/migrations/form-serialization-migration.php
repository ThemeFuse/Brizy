<?php

class Brizy_Admin_Migrations_FormSerializationMigration implements Brizy_Admin_Migrations_MigrationInterface {

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
		return '1.0.65';
	}

	/**
	 * @return int|mixed|WP_Error
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public function execute() {

		if ( $this->wasExecuted() ) {
			return;
		}

		global $wpdb;

		$totalCount = $wpdb->get_var( "SELECT count(*) FROM {$wpdb->postmeta}  WHERE meta_key='brizy-project'" );
		$offset     = 0;
		$count      = 20;

		while ( $offset < $totalCount ) {
			$result = @mysqli_query( $wpdb->dbh, "SELECT meta_id,post_id,meta_value FROM {$wpdb->postmeta}  WHERE meta_key='brizy-project' LIMIT {$offset}, {$count}" );

			if ( $result ) {
				if ( $statement = mysqli_prepare( $wpdb->dbh, "UPDATE {$wpdb->postmeta} SET meta_value=?  WHERE meta_id=? and post_id=? and meta_key='brizy-project'" ) ) {
					while ( ( $row = @mysqli_fetch_array( $result, 1 ) ) ) {
						// do stuff here for each result ...

						$projectData = maybe_unserialize( $row['meta_value'] );
						$meta_id    = (int) $row['meta_id'];
						$post_id    = (int) $row['post_id'];

						if ( isset( $projectData['forms'] ) ) {
							foreach ( $projectData['forms'] as $id => $form ) {
								if ( $form instanceof Brizy_Editor_Forms_Form ) {
									$projectData['forms'][ $id ] = $form->convertToOptionValue();
								} elseif ( ! is_null( $form ) ) {
									$projectData['forms'][ $id ] = $form;
								}
							}
						}

						$projectData = maybe_serialize( $projectData );

						mysqli_stmt_bind_param( $statement, 'sii', $projectData, $meta_id, $post_id );
						mysqli_stmt_execute( $statement );
					}
					mysqli_stmt_close( $statement );
				}
				@mysqli_free_result( $result );
			}

			$offset += 20;
		}

	}

	public function wasExecuted() {
		$storage    = new Brizy_Admin_Migrations_GlobalStorage();
		$migrations = $storage->getMigrations();

		foreach ( $migrations as $migration ) {
			if ( get_class( $migration ) == get_class( $this ) ) {
				return true;
			}
		}

		return false;
	}

}