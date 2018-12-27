<?php
/**
 * Compatibility with LiteSpeed plugin: https://wordpress.org/plugins/litespeed-cache/
 */
class Brizy_Compatibilities_LiteSpeed {

	public function __construct() {
		add_action( 'litespeed_option_js_minify',  array( $this, 'disable_js_minify' ), 10, 1 );
	}

	/**
	 * @param $is_minify
	 *
	 * @return bool
	 */
	public function disable_js_minify( $is_minify ) {

		if (  isset( $_GET['brizy-edit'] ) || isset( $_GET['brizy-edit-iframe'] ) ) {
			return false;
		}

		return $is_minify;
	}
}