<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Editor_Asset_Media {

	private $url;
	private $path;

	public function __construct( $url, $path ) {
		$this->path = $path;
		$this->url  = $url;
	}

	public function get_path() {
		return $this->path;
	}

	public function get_url() {
		return $this->url;
	}

	public function get_name() {
		return basename( $this->get_path() );
	}

	public function get_type() {
		return pathinfo( $this->get_path(), PATHINFO_EXTENSION );
	}
}