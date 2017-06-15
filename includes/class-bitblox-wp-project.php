<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class BitBlox_WP_Project {

	private $id;
	private $page_id;

	public function __construct( $id, $page_id ) {
		$this->id      = $id;
		$this->page_id = $page_id;
	}

	public function get_id() {
		return $this->id;
	}

	public function get_page_id() {
		return $this->page_id;
	}
}
