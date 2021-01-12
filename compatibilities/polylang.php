<?php
/*
 * https://wordpress.org/plugins/polylang/
 */
class Brizy_Compatibilities_Polylang {

	public function __construct() {
		add_action( 'brizy_post_loop_args', [ $this, 'post_loop_args' ] );
	}

	public function post_loop_args( $args ) {
		$args['lang'] = '';

		return $args;
	}
}
