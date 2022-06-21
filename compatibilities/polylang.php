<?php
/*
 * https://wordpress.org/plugins/polylang/
 */
class Brizy_Compatibilities_Polylang {

	public function __construct() {
		add_action( 'brizy_post_loop_args', [ $this, 'post_loop_args' ] );
		add_filter( 'pll_home_url_white_list', [ $this, 'home_url_white_list' ] );
	}

	public function post_loop_args( $args ) {
		$args['lang'] = '';

		return $args;
	}

	/**
	 * Filters home url
	 *
	 * @param array $arr
	 * @return array
	 */
	public function home_url_white_list( $arr ) {
		return array_merge( $arr, [ [ 'file' => 'brizy-pro/content' ] ] );
	}
}
