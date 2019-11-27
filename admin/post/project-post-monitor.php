<?php


class Brizy_Admin_Post_ProjectPostMonitor extends Brizy_Admin_Post_AbstractMonitor {

	/**
	 * Brizy_Admin_Post_ProjectPostMonitor constructor.
	 */
	public function __construct() {
		parent::__construct( 'brizy-project', array( 'brizy-project','brizy_data_version' ) );
	}

	/**
	 * @param $postId
	 * @param $postType
	 *
	 * @return bool|mixed
	 */
	public function shouldStoreMetaRevision( $postId, $postType ) {
		return $this->postType == $postType;
	}
}