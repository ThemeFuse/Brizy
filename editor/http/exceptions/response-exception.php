<?php

class Brizy_Editor_Http_Exceptions_ResponseException extends Brizy_Editor_API_Exceptions_Exception {
	/**
	 * @var Brizy_Editor_Http_Response
	 */
	private $response;

	public function __construct( $response, $previous = null ) {
		$this->response = $response;
		parent::__construct( $response->get_message(), $response->get_status_code(), $previous );
	}

	public function getResponse() {
		return $this->response;
	}
}