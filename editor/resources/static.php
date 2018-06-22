<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

abstract class Brizy_Editor_Resources_Static {

	private $id;
	private $url;
	private $deps;
	private $version;

	public function __construct( $id, $url,  $deps = array(), $ver = false ) {
		$this->id = $id;
		$this->set_url( $url );
		$this->set_deps( $deps );
		$this->set_version( $ver );
	}

	abstract public function enqueue();

	abstract public function get_type();

	public function get_id() {
		return $this->id;
	}

	public function get_url() {
		return $this->url;
	}

	public function set_url( $url ) {
		$this->url = $url;

		return $this;
	}

	public function get_deps() {
		return $this->deps;
	}

	public function set_deps(  $deps ) {
		$this->deps = $deps;

		return $this;
	}

	public function get_version() {
		return $this->version;
	}

	public function set_version( $version ) {
		$this->version = $version;

		return $this;
	}
}
