<?php

class Brizy_Compatibilities_PageOptimize {

	public function __construct() {
		add_action( 'plugins_loaded', [ $this, 'disable_page_optimize_in_edit_mode' ], 1 );
		add_action( 'init', [ $this, 'remove_page_optimize_init_actions' ], 0 );
	}

	public function disable_page_optimize_in_edit_mode() {
		if ( ! Brizy_Public_Main::is_editing() ) {
			return;
		}
	
		if ( ! function_exists( 'page_optimize_bail' ) ) {
			return;
		}
	
		add_filter( 'page_optimize_bail', '__return_true', 999 );
	
		remove_action( 'plugins_loaded', 'page_optimize_init', 10 );
	
		add_filter( 'js_do_concat', '__return_false', 999 );
		add_filter( 'css_do_concat', '__return_false', 999 );
	
		add_filter( 'script_loader_tag', [ $this, 'prevent_script_tag_modifications' ], 999, 2 );
	
		add_filter( 'style_loader_tag', [ $this, 'prevent_style_tag_modifications' ], 999, 2 );
	}
	
	public function remove_page_optimize_init_actions() {
		if ( ! Brizy_Public_Main::is_editing() ) {
			return;
		}
	
		if ( ! function_exists( 'page_optimize_bail' ) ) {
			return;
		}
	
		if ( function_exists( 'page_optimize_js_concat_init' ) ) {
			remove_action( 'init', 'page_optimize_js_concat_init' );
		}
	
		if ( function_exists( 'page_optimize_css_concat_init' ) ) {
			remove_action( 'init', 'page_optimize_css_concat_init' );
		}
	}
	
	public function prevent_script_tag_modifications( $tag, $handle ) {
		return $tag;
	}
	
	public function prevent_style_tag_modifications( $tag, $handle ) {
		return $tag;
	}
}

