<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 1/11/19
 * Time: 10:59 AM
 */


class Brizy_Admin_Json_Main {

    /**
     * @return Brizy_Admin_Json_Main|mixed
     */
	public static function _init() {
		static $instance;

		if ( ! $instance ) {
			$instance = new self();
		}

		return $instance;
	}

    /**
     * Brizy_Admin_Json_Main constructor.
     * @throws Brizy_Editor_Exceptions_NotFound
     */
	public function __construct() {
		if ( Brizy_Editor_Storage_Common::instance()->get( 'json-upload', false ) ) {
			$this->enableJsonUpload();
		}
	}

	public function addJsonMimeType($mimes) {
        $mimes['json'] = 'application/json';
        return $mimes;
    }

	public function enableJsonUpload() {
        add_filter('upload_mimes', [$this,'addJsonMimeType']);
	}

	public function disableJsonUpload() {
        remove_filter('upload_mimes', [$this,'addJsonMimeType']);
	}
}
