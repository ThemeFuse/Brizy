<?php

class Brizy_Admin_UploadDir {

	static public function getUploadDir( $time = null, $create_dir = true, $refresh_cache = false ) {
		add_filter('upload_dir',array('Brizy_Admin_UploadDir','fixUrlSchema'));
		$dir = wp_upload_dir( $time, $create_dir, $refresh_cache );
		remove_filter('upload_dir',array('Brizy_Admin_UploadDir','fixUrlSchema'));

		return $dir;
	}

	static public function fixUrlSchema( $uploadDir ) {

		$uploadDir['url'] = set_url_scheme($uploadDir['url']);
		$uploadDir['baseurl'] = set_url_scheme($uploadDir['baseurl']);

		return $uploadDir;

	}

}