<?php

/**
 * @return Brizy_WP
 */
function brizy() {
	return Brizy_WP::get();
}

function brizy_is_edit_page() {
	try {
		$post = Brizy_Post::get( get_the_ID() );

		return $post->uses_editor()
		       && current_user_can( 'edit_pages' )
		       && isset( $_GET[ Brizy_Constants::EDIT_KEY ] );
	} catch ( Exception $exception ) {
		return false;
	}
}

function brizy_dump( $var ) {
	return call_user_func_array( array( 'Brizy_Dump', 'dump' ), func_get_args() );
}

if ( ! function_exists( 'dump' ) ) {
	function dump( $var ) {
		return call_user_func_array( array( 'Brizy_Dump', 'dump' ), func_get_args() );
	}
}