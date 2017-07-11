<?php

class Brizy_Http_Response_Exception extends Brizy_API_Exception {
	/**
	 * @var Brizy_Http_Response
	 */
	private $response;

	public function __construct( Brizy_Http_Response $response, Throwable $previous = null ) {
		$this->response = $response;
		parent::__construct( $response->get_message(), $response->get_status_code(), $previous );
	}

	public function getResponse() {
		return $this->response;
	}
}