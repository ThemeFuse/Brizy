<?php

abstract class Brizy_Editor_AbstractAPI {

	/**
	 * @return string
	 */
	abstract protected function getNonceKey();

	abstract protected function initialize();

	public function __construct() {
		$this->initialize();
	}

	protected function authorize() {
		if ( ! wp_verify_nonce( $_REQUEST['hash'], $this->getNonceKey() ) ) {
			$this->error( 400, 'Bad request' );
		}
	}

	/**
	 * @param $name
	 *
	 * @return null
	 */
	protected function param( $name ) {
		if ( isset( $_REQUEST[ $name ] ) ) {
			return $_REQUEST[ $name ];
		}

		return null;
	}

	/**
	 * @param $code
	 * @param $message
	 */
	protected function error( $code, $message ) {
		$data = array( 'code' => $code, 'message' => $message );

		$response = array( 'success' => false );

		if ( isset( $data ) ) {
			$response['data'] = $data;
		}
	}

	/**
	 * @param $data
	 * @param int $code
	 */
	protected function success( $data, $code = 200 ) {
		$response = array( 'success' => true );

		if ( isset( $data ) ) {
			$response['data'] = $data;
		}

		$this->send_json( $response, $code );
	}

	/**
	 * @param $response
	 * @param null $status_code
	 */
	public function send_json( $response, $status_code = null ) {
		@header( 'Content-Type: application/json; charset=' . get_option( 'blog_charset' ) );
		if ( null !== $status_code ) {
			status_header( $status_code );
		}
		echo json_encode( $response );

		if ( wp_doing_ajax() ) {
			wp_die( '', '', array(
				'response' => null,
			) );
		} else {
			die;
		}
	}

}