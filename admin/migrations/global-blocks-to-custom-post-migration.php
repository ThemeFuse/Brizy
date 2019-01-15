<?php

class Brizy_Admin_Migrations_GlobalBlocksToCustomPostMigration implements Brizy_Admin_Migrations_MigrationInterface {

	/**
	 * Return the version
	 *
	 * @return mixed
	 */
	public function getVersion() {
		return '1.0.70';
	}

	/**
	 * @return int|mixed|WP_Error
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public function execute() {

		$project              = Brizy_Editor_Project::get();
		$postMigrationStorage = new Brizy_Admin_Migrations_PostStorage( $project->getWpPost()->ID );
		$globals              = $project->getDecodedGlobals();

		if ( $globals && ! isset( $globals->project ) ) {
			return;
		}

		if ( ! $globals || ( isset( $globals->project ) && empty( $globals->project ) ) ) {
			$project->setGlobals( base64_encode( json_encode( (object) array() ) ) );
			$project->save();
			$postMigrationStorage->addMigration($this)->save();
			return;
		}

		if ( isset( $globals->project->globalBlocks ) ) {
			foreach ( get_object_vars( $globals->project->globalBlocks ) as $uid => $data ) {

				$post = wp_insert_post( array(
					'post_status' => 'publish',
					'post_type'   => Brizy_Admin_Blocks_Main::CP_GLOBAL
				) );

				if ( $post ) {
					$brizyPost = Brizy_Editor_Block::get( $post, $uid );
					$brizyPost->set_editor_data( json_encode( $data ) );
					$brizyPost->set_uses_editor( true );
					$brizyPost->set_needs_compile( true );
					$brizyPost->save();
				}

			}
		}

		if ( isset( $globals->project->savedBlocks ) ) {
			foreach ( $globals->project->savedBlocks as $data ) {

				$post = wp_insert_post( array(
					'post_status' => 'publish',
					'post_type'   => Brizy_Admin_Blocks_Main::CP_SAVED
				) );

				if ( $post ) {
					$brizyPost = Brizy_Editor_Block::get( $post );
					$brizyPost->set_editor_data( json_encode( $data ) );
					$brizyPost->set_uses_editor( true );
					$brizyPost->set_needs_compile( true );
					$brizyPost->save();
				}
			}
		}

		update_post_meta( $project->getWpPost()->ID, 'brizy-bk-' . get_class( $this ) . '-' . $this->getVersion(), $globals );

		unset( $globals->project->globalBlocks );
		unset( $globals->project->savedBlocks );
		
		$project->setGlobals( base64_encode( json_encode( $globals->project ) ) );
		$project->save();
		$postMigrationStorage->addMigration($this)->save();
	}
}