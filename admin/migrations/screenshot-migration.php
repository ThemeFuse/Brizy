<?php


class Brizy_Admin_Migrations_ScreenshotMigration implements Brizy_Admin_Migrations_MigrationInterface {

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
		return '1.0.123';
	}

	/**
	 * Run this method when upgrading.
	 *
	 * @return mixed
	 */
	public function execute() {
		// this is a null migration

		global $wpdb;

		if ( ! class_exists( 'Brizy\BlockScreenshotContext' ) || ! class_exists( 'Brizy\BlockScreenshotTransformer' ) ) {
			throw new Exception();
		}

		$entities = $wpdb->get_results(
			"SELECT 
							p.id as ID
						FROM {$wpdb->posts} p
						LEFT JOIN {$wpdb->posts} pp ON pp.id=p.post_parent
						WHERE IF(pp.post_type IS NOT NULL,pp.post_type,p.post_type) in ('brizy-global-block','brizy-saved-block')
						
						" );

		foreach ( $entities as $row ) {
			if ( metadata_exists( 'post', $row->ID, Brizy_Editor_Block::BRIZY_META ) ) {
				continue;
			}
			try {
				$this->migrateEntity( $row->ID );
			} catch ( Brizy_Editor_Exceptions_NotFound $e ) {
				continue;
			}
		}
	}

	/**
	 * @param $postId
	 */
	private function migrateEntity( $postId ) {
		$storage      = Brizy_Editor_Storage_Post::instance( $postId );
		$storage_post = $storage->get( Brizy_Editor_Post::BRIZY_POST, true );

		if ( ! isset( $storage_post['editor_data'] ) ) {
			throw new Exception( 'editor_data not found on block: ' . $postId );
		}

		if ( ( $dataJson = base64_decode( $storage_post['editor_data'], true ) ) === false ) {
			$dataJson = $storage_post['editor_data'];
		}

		$dataObject = json_decode( $dataJson );

		$transformerContext = new \Brizy\BlockScreenshotContext( $dataObject );
		$transformer        = new \Brizy\BlockScreenshotTransformer();
		$transformer->execute( $transformerContext );


		$metaJson = json_encode( $transformerContext->getMeta() );
		update_metadata( 'post', $postId, Brizy_Editor_Block::BRIZY_META, $metaJson );
	}
}
