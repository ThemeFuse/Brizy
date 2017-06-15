<?php

/**
 * @return BitBlox_WP
 */
function bitblox_wp() {
	return BitBlox_WP::get();
}

function bitblox_wp_is_edit_page() {
	try {
		$post = new BitBlox_WP_Post( get_the_ID() );

		return $post->uses_editor()
		       && current_user_can( 'edit_pages' )
		       && isset( $_GET[ BitBlox_WP_Constants::EDIT_KEY ] );
	} catch ( Exception $exception ) {
		return false;
	}
}

function bitblox_wp_dump( $var ) {
	return call_user_func_array( array( 'BitBlox_WP_Dump', 'dump' ), func_get_args() );
}

if ( ! function_exists( 'dump' ) ) {
	function dump( $var ) {
		return call_user_func_array( array( 'BitBlox_WP_Dump', 'dump' ), func_get_args() );
	}
}