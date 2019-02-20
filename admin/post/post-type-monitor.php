<?php

class Brizy_Admin_Post_PostTypeMonitor extends Brizy_Admin_Post_AbstractMonitor {

	public function shouldStoreMetaRevision( $postId, $postType ) {
		return $this->postType == $postType;
	}
}