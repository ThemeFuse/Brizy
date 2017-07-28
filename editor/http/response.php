<?php

class Brizy_Editor_Http_Response {

	private $response;

	public function __construct( $wp_response ) {
		$this->response = $wp_response;
	}

	/**
	 * @return int
	 */
	public function get_status_code() {
		$code = wp_remote_retrieve_response_code( $this->response );

		return $code ? $code : 500;
	}

	/**
	 * @return array|mixed|object
	 */
	public function get_response_body() {
		return json_decode( wp_remote_retrieve_body( $this->response ), true );
	}

	/**
	 * @return  string
	 */
	public function get_message() {
		return (string) wp_remote_retrieve_response_message( $this->response );
	}

	public function get_headers() {
		return wp_remote_retrieve_headers( $this->response );
	}

	public function get_header( $header ) {
		return wp_remote_retrieve_header( $this->response, $header );
	}

	public function is_ok() {
		return $this->get_status_code() >= 200 && $this->get_status_code() < 300;
	}
}