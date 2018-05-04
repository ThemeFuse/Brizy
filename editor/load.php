<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

/**
 * @return Brizy_Editor
 */
function brizy() {
	return Brizy_Editor::get();
}


function brizy_get_current_post_id() {
	$pid = null;

	if ( isset( $_REQUEST['post'] ) ) {
		$pid = (int) $_REQUEST['post'];
	} elseif ( isset( $_REQUEST['page_id'] ) ) {
		$pid = (int) $_REQUEST['page_id'];
	} elseif ( isset( $_POST['post_ID'] ) ) {
		$pid = (int) $_POST['post_ID'];
	} elseif ( isset( $_POST['id'] ) ) {
		$pid = (int) $_POST['id'];
	} elseif ( $apid     = get_queried_object_id() ) {
		$pid = (int) $apid;
	}

	return $pid;
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


		$api_instance = new Brizy_Editor_API( $project, $post );

	} catch ( Exception $e ) {
		Brizy_Logger::instance()->exception( $e );
	}
}
