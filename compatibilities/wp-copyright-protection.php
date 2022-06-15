<?php
/**
 * Compatibility with LiteSpeed plugin: https://wordpress.org/plugins/wp-copyright-protection/
 * This plugin loads a script js which disable the right click on frontend.
 * Its purpose is to prevent users from copying the text from the site, a way to prevent copyright.
 */
class Brizy_Compatibilities_WpCopyrightProtection {

	public function __construct() {
		add_action( 'wp', [ $this, 'disable_js_optimize' ] );
	}

	public function disable_js_optimize() {
		if ( isset( $_GET[ Brizy_Editor::prefix( '-edit' ) ] ) || isset( $_GET[ Brizy_Editor::prefix( '-edit-iframe' ) ] ) ) {
			remove_action('wp_head', 'wp_copyright_protection');
		}
	}
}
