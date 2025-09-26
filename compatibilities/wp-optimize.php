<?php
/**
 *  WP-Optimize – Cache, Clean, Compress plugin: https://wordpress.org/plugins/wp-optimize/
 */
class Brizy_Compatibilities_WpOptimize {

	public function __construct() {
		if ( Brizy_Public_Main::is_editing() ) {
			add_filter( 'option_wpo_minify_config',      [ $this, 'changeWpOptimizeConfig' ] );
			add_filter( 'site_option_wpo_minify_config', [ $this, 'changeWpOptimizeConfig' ] );
		}
	}

	public function changeWpOptimizeConfig( $config ) {
		$config['enable_js']               = false;
		$config['enable_css']              = false;
		$config['html_minification']       = false;
		$config['enable_css_minification'] = false;
		$config['enable_merging_of_css']   = false;
		$config['inline_css']              = false;
		$config['enable_js_minification']  = false;
		$config['enable_merging_of_js']    = false;
		$config['enabled_css_preload']     = false;
		$config['enabled_js_preload']      = false;

		return $config;
	}
}
