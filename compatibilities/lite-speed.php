<?php

/**
 * Compatibility with LiteSpeed plugin: https://wordpress.org/plugins/litespeed-cache/
 */
class Brizy_Compatibilities_LiteSpeed {

	public function __construct() {
		if ( isset( $_GET['brizy-edit'] ) || isset( $_GET['brizy-edit-iframe'] ) ) {
			add_action( 'litespeed_option_html_minify', '__return_false' );
			add_action( 'litespeed_option_js_minify', '__return_false' );
			add_action( 'litespeed_option_js_inline_minify', '__return_false' );
			add_action( 'litespeed_option_js_combine', '__return_false' );
			add_action( 'litespeed_option_css_minify', '__return_false' );
			add_action( 'litespeed_option_css_inline_minify', '__return_false' );
			add_action( 'litespeed_option_css_combine', '__return_false' );
			add_action( 'litespeed_option_js_http2', '__return_false' );
		}
	}
}