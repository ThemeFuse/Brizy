<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

include_once 'functions.php';

add_action( 'wp_loaded', 'brizy_initialize_Brizy_Public_Api' );

function brizy_initialize_Brizy_Public_Api() {
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
		$api_instance->initialize();
	}
}

add_action( 'wp_loaded', 'handler_proxy_requests' );

function handler_proxy_requests( $query ) {

	$pid  = url_to_postid( $_SERVER['HTTP_REFERER'] );
	$post = null;
	try {

		$project = Brizy_Editor_Project::get();

		if ( $pid ) {
			$post = Brizy_Editor_Post::get( $pid );
		} else {
			throw new Exception( 'Unknown post id.' );
		}

	} catch ( Exception $e ) {
		return;
	}

	$asset_editor = new Brizy_Editor_Assets( $project, $post );
	$asset_editor->handle_editor_assets( $query );
	$asset_editor->handle_front_end_editor_assets( $query );
	$asset_editor->handle_media_proxy_handler($query);
}


