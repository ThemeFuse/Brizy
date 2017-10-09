<?php

class Brizy_Editor_API_Auth {

	private $gateway_url;

	public function __construct($gateway_url) {
		$this->gateway_url = $gateway_url;
	}

	public function sign_up_url() {
		return implode( '/', array( $this->gateway_url, 'create' ) );
	}

	public function auth_url() {
		return implode( '/', array( $this->gateway_url, 'auth' ) );
	}

	public function refresh_url() {
		return implode( '/', array( $this->gateway_url, 'refresh' ) );
	}

	/**
	 * @param $email
	 * @param $password
	 *
	 * @return Brizy_Editor_API_AccessToken
	 */
	public function auth( $email, $password ) {
		$response = $this->auth_call( $this->auth_url(), $email, $password )->get_response_body();

		return new Brizy_Editor_API_AccessToken(
			$response['access_token'],
			$response['refresh_token'],
			$response['expires_in'] + time()
		);
	}

	/**
	 * @param $refresh_token
	 *
	 * @return Brizy_Editor_API_AccessToken
	 */
	public function refresh_token( $refresh_token ) {
		$response = Brizy_Editor_Http_Client::post( $this->refresh_url(),
			array(
				'body'      => array(
					'refresh_token' => $refresh_token
				),
				'sslverify' => false
			)
		)->get_response_body();

		return new Brizy_Editor_API_AccessToken(
			$response['access_token'],
			$response['refresh_token'],
			$response['expires_in'] + time()
		);
	}

	/**
	 * @param $email
	 * @param $password
	 *
	 * @return Brizy_Editor_Http_Response
	 */
	public function create_user( $email, $password ) {
		return $this->auth_call( $this->sign_up_url(), $email, $password )->get_response_body();
	}

	/**
	 * @param $url
	 * @param $email
	 * @param $password
	 *
	 * @return Brizy_Editor_Http_Response
	 *
	 * @throws Brizy_Editor_Http_Exceptions_ResponseException
	 */
	protected function auth_call( $url, $email, $password ) {
		return Brizy_Editor_Http_Client::post( $url,
			array(
				'body'      => array(
					'email'    => $email,
					'password' => $password
				),
				'sslverify' => false
			)
		);
	}
}