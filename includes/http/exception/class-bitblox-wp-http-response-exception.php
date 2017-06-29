<?php

class BitBlox_WP_Http_Response_Exception extends BitBlox_WP_API_Exception {
	/**
	 * @var BitBlox_WP_Http_Response
	 */
	private $response;

	public function __construct( BitBlox_WP_Http_Response $response, Throwable $previous = null ) {
		$this->response = $response;
		parent::__construct( $response->get_message(), $response->get_status_code(), $previous );
	}

	public function getResponse() {
		return $this->response;
	}
}