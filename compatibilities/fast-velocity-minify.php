<?php

/**
 * Compatibility with Fast Velocity Minify plugin: https://wordpress.org/plugins/fast-velocity-minify/
 */
class Brizy_Compatibilities_FastVelocityMinify {

	public function __construct() {
		add_action( 'init', array( $this, 'remove_actions' ), 9 );
	}

	public function remove_actions() {

		if ( ! isset( $_GET[ Brizy_Editor::prefix( '-edit' ) ] ) && ! isset( $_GET[ Brizy_Editor::prefix( '-edit-iframe' ) ] ) ) {
			return;
		}

		remove_action( 'wp_print_scripts', 'fastvelocity_min_merge_header_scripts', PHP_INT_MAX );
		remove_action( 'wp_print_footer_scripts', 'fastvelocity_min_merge_footer_scripts', 9.999999 );
		remove_action( 'wp_print_styles', 'fastvelocity_min_merge_header_css', PHP_INT_MAX );
		remove_action( 'wp_print_footer_scripts', 'fastvelocity_min_merge_footer_css', 9.999999 );
		remove_action( 'init', 'fastvelocity_min_disable_wp_emojicons' );
		remove_action( 'template_redirect', 'fastvelocity_min_html_compression_start', PHP_INT_MAX );
		remove_filter( 'style_loader_src', 'fastvelocity_remove_cssjs_ver', 10 );
		remove_filter( 'script_loader_tag', 'fastvelocity_min_defer_js', 10 );
		remove_filter( 'script_loader_tag', 'fastvelocity_min_defer_js_optimize', 10 );
	}
}