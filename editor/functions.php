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

