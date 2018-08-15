<?php

/**
 * Class Brizy_Admin_AbstractApi
 */
abstract class Brizy_Admin_AbstractApi {

	abstract protected function initializeApiActions();

	abstract protected function getRequestNonce();

	/**
	 * Brizy_Admin_AbstractApi constructor.
	 */
	public function __construct() {
		$this->initializeApiActions();
	}

	/**
	 * @param $action
	 */
	protected function verifyNonce( $action ) {
		if ( ! wp_verify_nonce( $this->getRequestNonce(), $action ) ) {
			Brizy_Logger::instance()->error( 'Invalid request nonce', $_REQUEST );
			$this->error( 400, "Bad request" );

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
		wp_send_json_error( $message, $code );
	}

	/**
	 * @param $data
	 */
	protected function success( $data ) {
		wp_send_json( $data );
	}
}