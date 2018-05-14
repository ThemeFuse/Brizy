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

			// do not delete this line
			$user = Brizy_Editor_User::get();

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
		Brizy_Logger::instance()->exception( $e );
	}
}


function brizy_load_text_domain() {
	load_plugin_textdomain(
		'brizy',
		false,
		".." . DIRECTORY_SEPARATOR . 'languages'
	);
}

add_action( 'after_setup_theme', 'brizy_load_text_domain' );