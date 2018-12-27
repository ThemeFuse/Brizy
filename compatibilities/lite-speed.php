<?php

function litespeed_option_js_minify_disable( $is_minify ) {
	if ( isset( $_GET['brizy-edit'] ) ) {
		return false;
	}

	return $is_minify;
}
add_action( 'litespeed_option_js_minify', 'litespeed_option_js_minify_disable', 10, 1 );
add_action( 'litespeed_option_js_inline_minify', 'litespeed_option_js_minify_disable', 10, 1 );
add_action( 'litespeed_option_js_combine', 'litespeed_option_js_minify_disable', 10, 1 );

/**
 * Compatibility with LiteSpeed plugin: https://wordpress.org/plugins/litespeed-cache/
 */
class Brizy_Compatibilities_LiteSpeed {

	public function __construct() {
		add_filter( 'option_litespeed-cache-conf', array( $this, 'adapt_options' ), 10, 1 );
	}

	/**
	 * @param $set
	 *
	 * @return array
	 */
	public function adapt_options( $set ) {

		if ( ! isset( $_GET['brizy-edit'] ) ) {
			return $set;
		}

		if ( isset( $set['js_minify'] ) ) {
			$set['js_minify'] = false;
		}

		if ( isset( $set['js_combine'] ) ) {
			$set['js_combine'] = false;
		}

		return $set;
	}
}