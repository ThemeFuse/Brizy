<?php

class Brizy_API_Page {

	public static function get( array $data = array() ) {
		return new self( $data );
	}

	private $data = array( 'title' => 'Default title' );

	public function __construct( array $data = array() ) {
		$this->data = array_merge( $this->data, $data );
	}

	public function get_title() {
		return isset( $data['title'] ) ? $data['title'] : '';
	}

	public function set_title( $data ) {
		$this->data['title'] = $data;

		return $this;
	}

	public function get_content() {
		return isset( $data['data'] ) ? $data['data'] : '';
	}

	public function set_content( $data ) {
		$this->data['data'] = $data;

		return $this;
	}

	public function get_language() {
		return isset( $data['language'] ) ? $data['language'] : null;
	}

	public function get_type() {
		return isset( $data['type'] ) ? $data['type'] : null;
	}

	public function get_url() {
		return isset( $data['url'] ) ? $data['url'] : '';
	}

	public function get_description() {
		return isset( $data['description'] ) ? $data['description'] : '';
	}

	public function set_description( $data ) {
		$data['description'] = $data;

		return $this;
	}

	public function is_index() {
		return isset( $data['is_index'] ) ? (bool) $data['is_index'] : true;
	}

	public function export() {
		return $this->data;
	}
}