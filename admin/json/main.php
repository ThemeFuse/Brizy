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

	public static function isJsonEnabled() {
		return Brizy_Editor_Storage_Common::instance()->get( 'json-upload', false );
	}

	/**
	 * Brizy_Admin_Json_Main constructor.
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public function __construct() {
		if ( self::isJsonEnabled() ) {
			$this->enableJsonUpload();
		}
	}

	public function addJsonMimeType( $mimes ) {
		$mimes['json'] = 'application/json';

		return $mimes;
	}

	public function enableJsonUpload() {
		add_filter( 'upload_mimes', [ $this, 'addJsonMimeType' ] );
		if ( extension_loaded( 'fileinfo' ) ) {
			add_filter( 'wp_check_filetype_and_ext', [ $this, 'checkJsonFiletype' ], 10, 3 );
		}
	}

	public function disableJsonUpload() {
		remove_filter( 'upload_mimes', [ $this, 'addJsonMimeType' ] );
		remove_filter( 'wp_check_filetype_and_ext', [ $this, 'checkJsonFiletype' ] );
	}

	public function checkJsonFiletype( $data, $file, $filename ) {
		$ext = pathinfo( $filename, PATHINFO_EXTENSION );
		if ( $ext !== 'json' ) {
			return $data;
		}
		$content = file_get_contents( $file );
		$json    = json_decode( $content );
		if ( ! $json ) {
			return $data;
		}
		$data['ext']  = 'json';
		$data['type'] = 'application/json';

		return $data;
	}
}
