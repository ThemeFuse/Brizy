<?php

/**
 * @return Brizy_Editor
 */
function brizy() {
	return Brizy_Editor::get();
}


function brizy_get_current_post_id() {
	$pid = null;

	if ( $apid = get_the_ID() ) {
		$pid = $apid;
	} elseif ( isset( $_REQUEST['post'] ) ) {
		$pid = $_REQUEST['post'];
	} elseif ( isset( $_POST['post_ID'] ) ) {
		$pid = (int)$_POST['post_ID'];
	} elseif ( isset( $_POST['id'] ) ) {
		$pid = $_POST['id'];
	}

	return $pid;
}