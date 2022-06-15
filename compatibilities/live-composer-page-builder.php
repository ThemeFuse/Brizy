<?php
/**
 * Compatibility with Page Builder: Live Composer plugin: https://wordpress.org/plugins/live-composer-page-builder/
 */
class Brizy_Compatibilities_LiveComposerPageBuilder {

	public function __construct() {
		add_action( 'wp', [ $this, 'wp' ] );
	}

	public function wp() {
		if (
			! isset( $_GET[ Brizy_Editor::prefix( '-edit' ) ] )
			&&
			isset( $_GET[ Brizy_Editor::prefix( '-edit-iframe' ) ] )
			&&
			! Brizy_Editor_Entity::isBrizyEnabled( get_the_ID() )
			&&
			! Brizy_Admin_Templates::getTemplate()
		) {
			return;
		}

		// Conflict with Live Composer builder when it has set a template for single post.
		remove_filter( 'the_content', 'dslc_filter_content', 101 );
		// Remove button "Edit Template" from single when it is builded with brizy.
		remove_filter( 'wp_footer', [ 'DSLC_EditorInterface', 'show_lc_button_on_front' ] );
	}
}
