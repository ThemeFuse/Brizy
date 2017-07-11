<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_API_Project {

	private $id;
	private $page_id;
	private $globals;

	public function __construct( $id, $page_id, $globals = null ) {
		$this->id      = $id;
		$this->page_id = $page_id;
		$this->set_globals( $globals );
	}

	public function get_id() {
		return $this->id;
	}

	public function get_page_id() {
		return $this->page_id;
	}

	public function get_globals() {
		return $this->globals;
	}

	public function set_globals( $globals ) {
		$test = json_decode( $globals );

		if ( $test === null ) {
			$globals = '{"project":{},"language":{}}';
		}

		$this->globals = $globals;

		return $this;
	}
}
