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

	private function processProjectData($row) {
		$meta_value = maybe_unserialize( $row['meta_value'] );

		if ( is_null( $meta_value['globals'] ) || $meta_value['globals'] == '' ) {
			return null;
		}

		$globals_decode = base64_decode( $meta_value['globals'] );
		if ( $globals_decode ) {
			$meta_value['globals'] = $globals_decode;
		} else {
			throw new Exception( 'unable to base64 decode the global data' );
		}

		return maybe_serialize( $meta_value );
	}

	private function processPageData($row) {
		$meta_value = maybe_unserialize( $row['meta_value'] );

		if ( is_null( $meta_value['brizy-post']['editor_data'] ) || $meta_value['brizy-post']['editor_data'] == '' ) {
			return null;
		}

		$editor_data_decode = base64_decode( $meta_value['brizy-post']['editor_data'], true );

		if ( base64_encode( $editor_data_decode ) ===  $meta_value['brizy-post']['editor_data'] ) {
			$meta_value['brizy-post']['editor_data'] = $editor_data_decode;
		}

		$compiled_html_decode = base64_decode( trim( $meta_value['brizy-post']['compiled_html']) );

		if ( base64_encode( $compiled_html_decode ) ===  $meta_value['brizy-post']['compiled_html'] ) {
			$meta_value['brizy-post']['compiled_html'] = $compiled_html_decode;
		}

		if ( isset( $meta_value[0] ) ) {
			unset( $meta_value[0] );
		}

		return maybe_serialize( $meta_value );
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

						$meta_value = $this->processProjectData($row);

						if($meta_value===null) continue;

						$meta_id    = (int) $row['meta_id'];
						$post_id    = (int) $row['post_id'];

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

						$meta_value = $meta_value = $this->processPageData($row);
						$meta_id    = (int) $row['meta_id'];
						$post_id    = (int) $row['post_id'];

						$k = mysqli_stmt_bind_param( $statement, 'sii', $meta_value, $meta_id, $post_id );
						$v = mysqli_stmt_execute( $statement );
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