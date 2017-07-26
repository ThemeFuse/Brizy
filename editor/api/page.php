<?php

class Brizy_Editor_API_Page {

	public static function get( array $data = array() ) {
		return new self( $data );
	}

	private $data = array( 'title' => 'Default title' );

	public function __construct( array $data = array() ) {
		$this->data = array_merge( $this->data, $data );
	}

	public function get_title() {
		return isset( $this->data['title'] ) ? $this->data['title'] : '';
	}

	public function set_title( $title ) {
		$this->data['title'] = $title;

		return $this;
	}

	public function get_content() {
		return isset( $this->data['data'] ) ? $this->data['data'] : '';
	}

	public function set_content( $content ) {
		$this->data['data'] = $content;

		return $this;
	}

	public function get_language() {
		return isset( $this->data['language'] ) ? $this->data['language'] : null;
	}

	public function get_type() {
		return isset( $this->data['type'] ) ? $this->data['type'] : null;
	}

	public function get_url() {
		return isset( $this->data['url'] ) ? $this->data['url'] : '';
	}

	public function get_description() {
		return isset( $this->data['description'] ) ? $this->data['description'] : '';
	}

	public function set_description( $data ) {
		$data['description'] = $data;

		return $this;
	}

	public function is_index() {
		return isset( $this->data['is_index'] ) ? (bool) $this->data['is_index'] : true;
	}

	public function export() {
		return $this->data;
	}
}