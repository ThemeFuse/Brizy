<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 7/13/18
 * Time: 3:04 PM
 */

class Brizy_Admin_Post_PostTypeMonitor extends Brizy_Admin_Post_AbstractMonitor {

	public function shouldStoreMetaRevision( $postId, $postType ) {
		return $this->postType == $postType;
	}
}