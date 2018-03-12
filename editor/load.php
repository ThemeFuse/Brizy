<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

include_once 'functions.php';

add_action( 'wp_loaded', 'brizy_initialize_Brizy_Public_Api' );

function brizy_initialize_Brizy_Public_Api() {

	try {
		$pid  = brizy_get_current_post_id();
		$post = null;
		try {

			$project = Brizy_Editor_Project::get();

			if ( $pid ) {
				$post = Brizy_Editor_Post::get( $pid );
			}

		} catch ( Exception $e ) {
			return;
		}

		if ( Brizy_Editor::is_user_allowed() ) {
			$api_instance = new Brizy_Editor_API( $project, $post );
		}

	} catch ( Exception $e ) {
		// do nothing if there is an exception
		if ( defined( 'BRIZY_DUMP_EXCEPTION' ) ) {
			var_dump( $e );
		}
	}
}

add_action( 'wp_loaded', 'briozy_handler_proxy_requests' );

function briozy_handler_proxy_requests( $query ) {

	try {
		$post    = null;
		$project = Brizy_Editor_Project::get();

		$pid = brizy_get_current_post_id();

		if ( ! $pid && isset($_SERVER['HTTP_REFERER']) ) {
			$pid = url_to_postid( $_SERVER['HTTP_REFERER'] );
		}

		if ( $pid ) {
			$post = Brizy_Editor_Post::get( $pid );
		}

		$asset_editor = new Brizy_Editor_Assets( $project, $post );
	} catch ( Exception $e ) {
		// do nothing if there is an exception
		if ( defined( 'BRIZY_DUMP_EXCEPTION' ) ) {
			var_dump( $e );
		}
	}
}


