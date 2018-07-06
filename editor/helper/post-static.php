<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Editor_Helper_PostStatic {

	private $html;

	public function __construct( $html ) {
		$this->html = $html;
	}

	public function save_path() {
		static $path;

		return $path ? $path : $path = $this->uploads_dir() . DIRECTORY_SEPARATOR . self::DIR;
	}

	private function uploads_dir() {
		$upload_dir = Brizy_Admin_UploadDir::getUploadDir();

		return $upload_dir['baseurl'];
	}

	private function dom() {
		static $dom;

		return $dom ? $dom : $dom = new Brizy_Editor_Helper_Dom( $this->html );
	}
}
