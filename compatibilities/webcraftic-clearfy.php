<?php
/**
 * Compatibility with Webcraftic Clearfy – WordPress optimization plugin: https://wordpress.org/plugins/clearfy/
 */
class Brizy_Compatibilities_WebcrafticClearfy {

	public function __construct() {
		add_action( 'wbcr/factory/populate_option_js_optimize',  array( $this, 'disable_js_optimize' ), 10, 1 );
	}

	/**
	 * @param $is_minify
	 *
	 * @return bool
	 */
	public function disable_js_optimize( $is_minify ) {

		if (  isset( $_GET[Brizy_Editor::prefix('-edit')] ) || isset( $_GET[Brizy_Editor::prefix('-edit-iframe')] ) ) {
			return false;
		}

		return $is_minify;
	}
}