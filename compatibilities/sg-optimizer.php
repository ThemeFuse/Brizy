<?php
/**
 * Compatibility with LiteSpeed plugin: https://wordpress.org/plugins/sg-cachepress/
 */
class Brizy_Compatibilities_SgOptimizer {

	public function __construct() {
		add_filter( 'option_siteground_optimizer_optimize_html', array( $this, 'disable' ) );
		add_filter( 'option_siteground_optimizer_optimize_javascript', array( $this, 'disable' ) );
		add_filter( 'option_siteground_optimizer_optimize_css', array( $this, 'disable' ) );
		add_filter( 'option_siteground_optimizer_optimize_javascript_async', array( $this, 'disable' ) );
		add_filter( 'option_siteground_optimizer_lazyload_images', array( $this, 'disable' ) );
		add_filter( 'option_siteground_optimizer_combine_css', array( $this, 'disable' ) );
	}

	/**
	 * @param $is_minify
	 *__return_true
	 * @return bool
	 */
	public function disable( $is_minify ) {

		if ( isset( $_GET['brizy-edit'] ) || isset( $_GET['brizy-edit-iframe'] ) ) {
			return false;
		}

		return $is_minify;
	}
}