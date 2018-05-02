<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

include_once 'functions.php';

add_action( 'init', 'brizy_check_for_new_imports' );

function brizy_check_for_new_imports() {
	try {
		$post = null;
		Brizy_Logger::instance()->debug( 'Check for new imported posts' );
		$project = Brizy_Editor_Project::get();

		$posts = Brizy_Editor_Post::get_posts_with_foreign_signature();
		if ( count( $posts ) == 0 ) {
			return;
		}

		Brizy_Logger::instance()->notice( 'New imported posts found', array( $posts ) );

		$t = 0;

		// clone all post you get there
		$page_ids     = array();
		$editor_pages = array();

		foreach ( (array) $posts as $apost ) {
			$editor_pages[] = $api_page = Brizy_Editor_Post::get( $apost )->get_api_page();
			$page_ids[]     = $api_page->get_id();
		}

		$pages = Brizy_Editor_User::get()->clone_pages( $page_ids, $project->get_id() );


		// debug logs
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			foreach ( (array) $pages as $clone ) {
				Brizy_Logger::instance()->debug( sprintf( "Cloned page [%s] in to page [%s]", $clone['cloned_from'], $clone['id'] ) );
			}
		}


		if ( is_array( $pages ) && count( $pages ) ) {
			foreach ( $pages as $i => $api_page ) {
				$wp_post  = Brizy_Editor_Post::get_post_by_foreign_hash( $api_page['cloned_from'] );
				$old_page = Brizy_Editor_Post::get( $wp_post );
				$new_post = new Brizy_Editor_Post( new Brizy_Editor_API_Page( $api_page ), $wp_post->ID );

				$new_post->set_compiled_html_body( $old_page->get_compiled_html_body() );
				$new_post->set_compiled_html_head( $old_page->get_compiled_html_head() );

				update_post_meta( $wp_post->ID, Brizy_Editor_Post::BRIZY_POST_SIGNATURE_KEY, Brizy_Editor_Signature::get() );
				update_post_meta( $wp_post->ID, Brizy_Editor_Post::BRIZY_POST_HASH_KEY, $new_post->get_api_page()->get_id() );

				$new_post->save_locally();
			}
		}

	} catch ( Exception $e ) {

		Brizy_Logger::instance()->exception( $e );

		Brizy_Admin_Flash::instance()->add_error( $e->getMessage() );

		// do nothing if there is an exception
		if ( defined( 'BRIZY_DUMP_EXCEPTION' ) ) {
			var_dump( $e );
		}
	}
}


add_action( 'init', 'brizy_check_for_duplicates' );

function brizy_check_for_duplicates() {
	try {

		Brizy_Logger::instance()->debug( 'Check for new duplicated posts' );

		$post = null;
		// clone user for any eventuality
		$user    = Brizy_Editor_User::get();
		$project = Brizy_Editor_Project::get();

		$posts = Brizy_Editor_Post::get_duplicate_brizy_posts();
		$count = count( $posts );
		if ( $count == 0 ) {
			return;
		}

		Brizy_Logger::instance()->notice( 'New duplicate posts found', array( $posts ) );

		foreach ( $posts as $hash => $apost ) {

			$count = count( $apost );

			$from_post = Brizy_Editor_Post::get( $apost[0] );
			$api_page  = $from_post->get_api_page();
			$from_hash = $api_page->get_id();

			for ( $i = 1; $i < $count; $i ++ ) {

				$cloned_pages = Brizy_Editor_User::get()->clone_pages( array( $from_hash ), $project->get_id() );

				if ( count( $cloned_pages ) != 1 ) {
					continue;
				}

				// debug logs
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					foreach ( (array) $cloned_pages as $clone ) {
						Brizy_Logger::instance()->debug( sprintf( "Cloned page [%s] in to page [%s]", $clone['cloned_from'], $clone['id'] ) );
					}
				}

				$cloned_page = $cloned_pages[0];

				$new_post = new Brizy_Editor_Post( new Brizy_Editor_API_Page( $cloned_page ), $apost[ $i ]->ID );

				$new_post->set_compiled_html_body( $from_post->get_compiled_html_body() );
				$new_post->set_compiled_html_head( $from_post->get_compiled_html_head() );

				update_post_meta( $apost[ $i ]->ID, Brizy_Editor_Post::BRIZY_POST_SIGNATURE_KEY, Brizy_Editor_Signature::get() );
				update_post_meta( $apost[ $i ]->ID, Brizy_Editor_Post::BRIZY_POST_HASH_KEY, $new_post->get_api_page()->get_id() );

				$new_post->save_locally();
			}
		}
	} catch ( Exception $e ) {

		Brizy_Logger::instance()->exception( $e );

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

		Brizy_Logger::instance()->exception( $e );

		// do nothing if there is an exception
		if ( defined( 'BRIZY_DUMP_EXCEPTION' ) ) {
			var_dump( $e );
		}
	}
}

//add_action( 'wp_loaded', 'brizy_handler_proxy_requests' );

//function brizy_handler_proxy_requests( $query ) {
//
//	try {
//		$post    = null;
//		$project = Brizy_Editor_Project::get();
//
//		$pid = brizy_get_current_post_id();
//
//		if ( ! $pid && isset( $_SERVER['HTTP_REFERER'] ) ) {
//			$pid = url_to_postid( $_SERVER['HTTP_REFERER'] );
//		}
//
//		if ( $pid ) {
//			try {
//				$post = Brizy_Editor_Post::get( $pid );
//			} catch ( Exception $e ) {
//				// do nothing if there is an exception
//				$post = null;
//			}
//		}
//
//		$asset_editor = new Brizy_Editor_Assets( $project, $post );
//
//	} catch ( Exception $e ) {
//
//		Brizy_Logger::instance()->exception( $e );
//
//		// do nothing if there is an exception
//		if ( defined( 'BRIZY_DUMP_EXCEPTION' ) ) {
//			var_dump( $e );
//		}
//	}
//}
//
