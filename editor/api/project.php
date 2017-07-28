<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Editor_API_Project {

	private $data;

	public function __construct( $data ) {
		$defaults   = array( 'title' => '', 'globals' => array() );
		$this->data = array_merge( $defaults, $data );
	}

	public function get_id() {
		return $this->data['id'];
	}

	public function set_id( $id ) {
		return $this->data['id'] = (int) $id;
	}

	public function get_globals() {
		return json_decode( $this->data['globals'] );
	}

	public function set_globals( $globals ) {
		return $this->data['globals'] = json_encode( $globals );
	}

	public function __sleep() {
		return array( 'data' );
	}

//	private $id;
//	private $page_id;
//	private $globals;
//
//	public function __construct( $id, $page_id, $globals = null ) {
//		$this->id      = $id;
//		$this->page_id = $page_id;
//		$this->set_globals( $globals );
//	}
//
//	public function get_id() {
//		return $this->id;
//	}
//
//	public function get_page_id() {
//		return $this->page_id;
//	}
//
//	public function get_globals() {
//		return $this->globals;
//	}
//
//	public function set_globals( $globals ) {
//		$test = json_decode( $globals );
//
//		if ( $test === null ) {
//			$globals = '{"project":{},"language":{}}';
//		}
//
//		$this->globals = $globals;
//
//		return $this;
//	}
}
