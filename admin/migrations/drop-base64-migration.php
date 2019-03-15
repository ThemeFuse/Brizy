<?php

class Brizy_Admin_Migrations_DropBase64Migration implements Brizy_Admin_Migrations_MigrationInterface {

	/**
	 * Return the version
	 *
	 * @return mixed
	 */
	public function getVersion() {
		return '1.0.65';
	}

	/**
	 * @return bool|mixed
	 * @throws Exception
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

						$meta_value = maybe_unserialize( $row['meta_value'] );
						$meta_id    = (int) $row['meta_id'];
						$post_id    = (int) $row['post_id'];

						if ( is_null( $meta_value['globals'] ) || $meta_value['globals'] == '' ) {
							continue;
						}

						$globals_decode = base64_decode( $meta_value['globals'] );
						if ( $globals_decode ) {
							$meta_value['globals'] = $globals_decode;
						} else {
							throw new Exception( 'unable to base64 decode the global data' );
						}

						$meta_value = maybe_serialize( $meta_value );

						mysqli_stmt_bind_param( $statement, 'sii', $meta_value, $meta_id, $post_id );
						mysqli_stmt_execute( $statement );
					}
					mysqli_stmt_close( $statement );
				}
				@mysqli_free_result( $result );
			}

			$offset += 20;
		}

		$totalCount = $wpdb->get_var( "SELECT count(*) FROM {$wpdb->postmeta}  WHERE meta_key='brizy'" );
		$offset     = 0;
		$count      = 20;

		while ( $offset < $totalCount ) {
			$result = @mysqli_query( $wpdb->dbh, "SELECT meta_id,post_id,meta_value FROM {$wpdb->postmeta}  WHERE meta_key='brizy' LIMIT {$offset}, {$count}" );

			if ( $result ) {

				if ( $statement = mysqli_prepare( $wpdb->dbh, "UPDATE {$wpdb->postmeta} SET meta_value=?  WHERE meta_id=? and post_id=? and meta_key='brizy'" ) ) {

					while ( ( $row = @mysqli_fetch_array( $result, 1 ) ) ) {
						// do stuff here for each result ...
						$t = 0;

						$meta_value = maybe_unserialize( $row['meta_value'] );
						$meta_id    = (int) $row['meta_id'];
						$post_id    = (int) $row['post_id'];

						if ( is_null( $meta_value['brizy-post']['editor_data'] ) || $meta_value['brizy-post']['editor_data'] == '' ) {
							continue;
						}

						$editor_data_decode = base64_decode( $meta_value['brizy-post']['editor_data'] );

						if ( $editor_data_decode ) {
							$meta_value['brizy-post']['editor_data'] = $editor_data_decode;
						} else {
							throw new Exception( 'unable to base64 decode the editor data' );
						}

						$compiled_html_decode = base64_decode( $meta_value['brizy-post']['compiled_html'] );
						if ( $compiled_html_decode ) {
							$meta_value['brizy-post']['compiled_html'] = $compiled_html_decode;
						}

						if ( isset( $meta_value[0] ) ) {
							unset( $meta_value[0] );
						}

						$meta_value = maybe_serialize( $meta_value );

						mysqli_stmt_bind_param( $statement, 'sii', $meta_value, $meta_id, $post_id );
						mysqli_stmt_execute( $statement );
					}
					mysqli_stmt_close( $statement );
				}
				@mysqli_free_result( $result );
			}
			$offset += 20;
		}

		return true;
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