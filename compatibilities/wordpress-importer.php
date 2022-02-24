<?php

class Brizy_Compatibilities_WordpressImporter {

	public function __construct() {
		add_filter( 'wp_import_posts',         [ $this, 'handlePostsImport' ] );
		add_filter( 'wp_import_existing_post', [ $this, 'handleNewProjectPostImport' ], 10, 2 );
		add_filter( 'wp_import_post_meta',     [ $this, 'handleNewProjectMetaImport' ], 10, 3 );
	}

	public function handlePostsImport( $posts ) {

		$incompatibleBrizyPosts = array();

		foreach ( $posts as $i => &$post ) {
			if ( ! isset( $post['postmeta'] ) ) {
				continue;
			}

			foreach ( $post['postmeta'] as $meta ) {

				if ( $meta['key'] == Brizy_Editor_Constants::BRIZY_ENABLED && $meta['value'] == '1' && empty( $post['post_content'] ) ) {
					$post['post_content'] = 'brz-root__container';
				}

				if ( $meta['key'] == 'brizy-post-plugin-version' && ! Brizy_Editor_Data_ProjectMergeStrategy::checkVersionCompatibility( $meta['value'] ) ) {
					$incompatibleBrizyPosts[] = array(
						'post_title' => $post['post_title'],
						'version'    => $meta['value']
					);
					unset( $posts[ $i ] );
				}
			}
		}

		if ( count( $incompatibleBrizyPosts ) ) {
			foreach ( $incompatibleBrizyPosts as $brizy_post ) {
				printf( __( 'Importing Brizy post &#8220;%s&#8221; will be skipped due to incompatible version: %s ', 'brizy' ),
					esc_html( $brizy_post['post_title'] ), esc_html( $brizy_post['version'] ) );
				echo '<br />';
			}
		}

		return $posts;
	}

	public function handleNewProjectPostImport( $existing, $post ) {

		if ( $post['post_type'] == Brizy_Editor_Project::BRIZY_PROJECT ) {

			$currentProject        = Brizy_Editor_Project::get();
			$currentProjectGlobals = $currentProject->getDecodedData();
			$currentProjectPostId  = $currentProject->getWpPost()->ID;
			$currentProjectStorage = Brizy_Editor_Storage_Project::instance( $currentProjectPostId );

			$projectMeta = null;

			foreach ( $post['postmeta'] as $meta ) {
				if ( $meta['key'] == 'brizy-project' ) {
					$projectMeta = maybe_unserialize( $meta['value'] );
					break;
				}
			}

			if ( ! $projectMeta ) {
				return $existing;
			}

			$projectData   = json_decode( base64_decode( $projectMeta['data'] ) );
			$mergeStrategy = Brizy_Editor_Data_ProjectMergeStrategy::getMergerInstance( $projectMeta['pluginVersion'] );
			$mergedData    = $mergeStrategy->merge( $currentProjectGlobals, $projectData );

			// create project data backup
			$data = $currentProjectStorage->get_storage();
			update_post_meta( $currentProjectPostId, 'brizy-project-import-backup-' . md5( time() ), $data );
			//---------------------------------------------------------

			$currentProject->setDataAsJson( json_encode( $mergedData ) );
			$currentProject->saveStorage();

			return $currentProjectPostId;
		}

		return $existing;
	}

	/**
	 * @param $postMeta
	 * @param $post_id
	 * @param $post
	 *
	 * @return null
	 */
	public function handleNewProjectMetaImport( $postMeta, $post_id, $post ) {
		if ( $post['post_type'] == Brizy_Editor_Project::BRIZY_PROJECT ) {
			return null;
		}

		return $postMeta;
	}
}