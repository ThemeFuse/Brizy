<?php defined( 'ABSPATH' ) or die();

class Brizy_Import_Cleaner {

	/**
	 * @var wpdb
	 */
	private $wpdb;

	/**
	 * @var Brizy_Editor_Project
	 */
	private $project;

	/**
	 * @var WP_Filesystem_Base
	 */
	private $fileSystem;

	/**
	 * @var Brizy_Editor_UrlBuilder
	 */
	private $urlBuilder;

	public function __construct() {
		global $wpdb, $wp_filesystem;

		if ( ! $wp_filesystem ) {
			if ( ! function_exists( 'WP_Filesystem' ) ) {
				require_once wp_normalize_path( ABSPATH . '/wp-admin/includes/file.php' );
			}

			WP_Filesystem();
		}

		$this->fileSystem = $wp_filesystem;
		$this->wpdb       = $wpdb;
		$this->project    = Brizy_Editor_Project::get();
		$this->urlBuilder = new Brizy_Editor_UrlBuilder( $this->project );
	}

	/**
	 * @throws Exception
	 */
	public function clean() {
		$this->deleteFiles();
		$this->cleanTables();
	}

	private function deleteFiles() {

		$ids = $this->wpdb->get_results( "SELECT p.ID FROM {$this->wpdb->posts} p WHERE p.post_type = 'attachment'", ARRAY_N );

		foreach ( $ids as $id ) {
			wp_delete_attachment( $id, true );
		}

		$this->fileSystem->delete( $this->urlBuilder->brizy_upload_path(), true );
	}

	/**
	 * @throws Exception
	 */
	private function cleanTables() {

		$this->wpdb->query(
			$this->wpdb->prepare(
				"DELETE p, m, tr, tt, t, tm
				    FROM {$this->wpdb->posts} p
				    LEFT JOIN {$this->wpdb->term_relationships} tr ON p.ID = tr.object_id
				    LEFT JOIN {$this->wpdb->term_taxonomy} tt ON tt.term_taxonomy_id = tr.term_taxonomy_id
				    LEFT JOIN {$this->wpdb->terms} t ON t.term_id = tt.term_id
				    LEFT JOIN {$this->wpdb->termmeta} tm ON tm.term_id = t.term_id
				    LEFT JOIN {$this->wpdb->postmeta} m ON p.ID = m.post_id
				    WHERE p.post_type <> %s AND p.post_type <> %s",
				Brizy_Editor_Project::BRIZY_PROJECT,
				'wp_global_styles'
			)
		);

		$this->wpdb->query( "DELETE FROM {$this->wpdb->commentmeta}" );
		$this->wpdb->query( "DELETE FROM {$this->wpdb->comments}" );

		$this->project->setDataAsJson( json_encode( new stdClass() ) )->saveStorage();

		$this->project->cleanClassCache();
	}
}
