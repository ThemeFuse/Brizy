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
		$pid = (int)$apid;
	} elseif ( isset( $_REQUEST['post'] ) ) {
		$pid = (int)$_REQUEST['post'];
	} elseif ( isset( $_REQUEST['page_id'] ) ) {
		$pid = (int)$_REQUEST['page_id'];
	} elseif ( isset( $_POST['post_ID'] ) ) {
		$pid = (int)$_POST['post_ID'];
	} elseif ( isset( $_POST['id'] ) ) {
		$pid = (int)$_POST['id'];
	}

	return $pid;
}