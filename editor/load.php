<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

include_once 'functions.php';


add_action( 'init', 'brizy_check_for_new_imports' );

function brizy_check_for_new_imports() {
	try {
		$post    = null;

		$posts   = Brizy_Editor_Post::get_posts_with_foreign_signature();
		if(count($posts)==0) return;

		$user    = Brizy_Editor_User::get();
		$project = Brizy_Editor_Project::get();

		$t = 0;

		// clone all post you get there
		$page_ids = array();
		$editor_pages = array();

		foreach ( (array) $posts as $apost ) {
			$editor_pages[] = $api_page   = Brizy_Editor_Post::get( $apost )->get_api_page();
			$page_ids[] = $api_page->get_id();
		}

		$pages = Brizy_Editor_User::get()->clone_pages( $page_ids, $project->get_id() );

		if(is_array($pages) && count($pages))
		{
			foreach ($pages as $i=>$api_page) {
				$new_post = new Brizy_Editor_Post( new Brizy_Editor_API_Page($api_page), $posts[$i]->ID );
				$old_page = Brizy_Editor_Post::get( $posts[$i] );

				$new_post->set_compiled_html_body( $old_page->get_compiled_html_body() );
				$new_post->set_compiled_html_head( $old_page->get_compiled_html_head() );

				update_post_meta( $posts[$i]->ID, Brizy_Editor_Post::BRIZY_POST_SIGNATURE_KEY, Brizy_Editor_Signature::get() );

				$new_post->save();
			}
		}

	} catch ( Exception $e ) {

		Brizy_Admin_Flash::instance()->add_error( $e->getMessage() );

		// do nothing if there is an exception
		if ( defined( 'BRIZY_DUMP_EXCEPTION' ) ) {
			var_dump( $e );
		}
	}
}




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
		// do nothing if there is an exception
		if ( defined( 'BRIZY_DUMP_EXCEPTION' ) ) {
			var_dump( $e );
		}
	}
}

add_action( 'wp_loaded', 'brizy_handler_proxy_requests' );

function brizy_handler_proxy_requests( $query ) {

	try {
		$post    = null;
		$project = Brizy_Editor_Project::get();

		$pid = brizy_get_current_post_id();

		if ( ! $pid && isset( $_SERVER['HTTP_REFERER'] ) ) {
			$pid = url_to_postid( $_SERVER['HTTP_REFERER'] );
		}

		if ( $pid ) {
			try {
				$post = Brizy_Editor_Post::get( $pid );
			} catch ( Exception $e ) {
				// do nothing if there is an exception
				$post = null;
			}
		}

		$asset_editor = new Brizy_Editor_Assets( $project, $post );
	} catch ( Exception $e ) {
		// do nothing if there is an exception
		if ( defined( 'BRIZY_DUMP_EXCEPTION' ) ) {
			var_dump( $e );
		}
	}
}


