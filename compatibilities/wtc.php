<?php
/*
 * Compatibility with W3 Total Cache: https://wordpress.org/plugins/w3-total-cache/
 * Compatibility with A2 Fixed W3 Total Cache by a2hosting.com a plugin contains some bug fixes for W3 Total Cache ususally used only on a2hosting servers.
 */
class Brizy_Compatibilities_Wtc {

	public function __construct() {
		add_filter( 'wp_loaded', array( $this, 'action_disable_minify' ) );
	}

	public function action_disable_minify() {
		if ( isset( $GLOBALS['_w3tc_ob_callbacks']['minify'] ) ) {
			unset( $GLOBALS['_w3tc_ob_callbacks']['minify'] );
		}
	}
}