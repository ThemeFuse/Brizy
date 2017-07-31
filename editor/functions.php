<?php

/**
 * @return Brizy_Editor
 */
function brizy() {
	return Brizy_Editor::get();
}

function brizy_is_edit_page() {
	try {
		$post = Brizy_Editor_Post::get( get_the_ID() );

		return $post->uses_editor()
		       && current_user_can( 'edit_pages' )
		       && isset( $_GET[ Brizy_Editor_Constants::EDIT_KEY ] );
	} catch ( Exception $exception ) {
		return false;
	}
}

function brizy_get_current_post_id() {
	$pid = null;

	if ( $apid = get_the_ID() ) {
		$pid = $apid;
	} elseif ( isset( $_REQUEST['post'] ) ) {
		$pid = $_REQUEST['post'];
	} elseif ( isset( $_POST['id'] ) ) {
		$pid = $_POST['id'];
	}

	return $pid;
}