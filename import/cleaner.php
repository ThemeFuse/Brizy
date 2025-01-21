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
        $brzPostTypes = $this->getPostTypes();
        $placeholders = implode( ', ', array_fill( 0, count( $brzPostTypes ), '%s' ) );

        $this->deletePostRelationships( $brzPostTypes, $placeholders );
        $this->deletePostComments( $brzPostTypes, $placeholders );
        $this->deleteMedia();

        $this->project->setDataAsJson( json_encode( new stdClass() ) )->saveStorage();
        $this->project->cleanClassCache();
    }

    private function getPostTypes() {
        return [
            Brizy_Admin_Blocks_Main::CP_GLOBAL,
            Brizy_Admin_Blocks_Main::CP_SAVED,
            Brizy_Admin_Fonts_Main::CP_FONT,
            BrizyPro_Admin_Membership_Membership::CP_ROLE,
            Brizy_Admin_Layouts_Main::CP_LAYOUT,
            Brizy_Admin_Stories_Main::CP_STORY,
            Brizy_Admin_Popups_Main::CP_POPUP,
            Brizy_Admin_Templates::CP_TEMPLATE,
            Brizy_Admin_FormEntries::CP_FORM_ENTRY,

            // not deleted
            // Brizy_Editor_Project::BRIZY_PROJECT,
        ];
    }

    private function deletePostRelationships( $brzPostTypes, $placeholders ) {
        $post_ids = $this->wpdb->get_col(
            $this->wpdb->prepare(
                "SELECT ID FROM {$this->wpdb->posts} WHERE post_type IN ($placeholders)", ...$brzPostTypes
            )
        );

        if ( empty( $post_ids ) ) {
            return;
        }

        $id_placeholders = implode( ',', array_fill( 0, count( $post_ids ), '%d' ) );

        $this->wpdb->query(
            $this->wpdb->prepare(
                "DELETE p, m, tr, tt, t, tm
            FROM {$this->wpdb->posts} p
            LEFT JOIN {$this->wpdb->term_relationships} tr ON p.ID = tr.object_id
            LEFT JOIN {$this->wpdb->term_taxonomy} tt ON tt.term_taxonomy_id = tr.term_taxonomy_id
            LEFT JOIN {$this->wpdb->terms} t ON t.term_id = tt.term_id
            LEFT JOIN {$this->wpdb->termmeta} tm ON tm.term_id = t.term_id
            LEFT JOIN {$this->wpdb->postmeta} m ON p.ID = m.post_id
            WHERE p.ID IN ($id_placeholders) OR (p.post_type = 'revision' AND p.post_parent IN ($id_placeholders))",
                ...array_merge( $post_ids, $post_ids )
            )
        );
    }

    private function deletePostComments( $brzPostTypes, $placeholders ) {
        $this->wpdb->query(
            $this->wpdb->prepare(
                "DELETE c, cm
            FROM {$this->wpdb->comments} c
            INNER JOIN {$this->wpdb->posts} p ON c.comment_post_ID = p.ID
            LEFT JOIN {$this->wpdb->commentmeta} cm ON c.comment_ID = cm.comment_id
            WHERE p.post_type IN ($placeholders)",
                ...$brzPostTypes
            )
        );
    }

    private function deleteMedia() {
        $media_ids = $this->wpdb->get_col( "SELECT ID FROM {$this->wpdb->posts} WHERE post_type = 'attachment'" );

        foreach ( $media_ids as $media_id ) {
            wp_delete_attachment( $media_id, true );
        }
    }

}
