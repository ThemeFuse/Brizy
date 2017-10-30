<?php

class Brizy_Editor_API_Auth {

	/**
	 * @var string
	 */
	private $gateway_url;

	/**
	 * @var string
	 */
	private $client_id;

	/**
	 * @var string
	 */
	private $secret;

	public function __construct( $gateway_url, $client_id, $secret ) {
		$this->gateway_url = $gateway_url;
		$this->client_id   = $client_id;
		$this->secret      = $secret;
	}

	public function auth_url() {
		return $this->gateway_url . '/oauth/token';
	}

	public function refresh_url() {
		return $this->gateway_url . '/oauth/refresh';
	}

	/**
	 * @param $email
	 *
	 * @return Brizy_Editor_API_AccessToken
	 */
	public function getToken( $email ) {

		$response = Brizy_Editor_Http_Client::post( $this->auth_url(),
			array(
				'body'      => array(
					'client_id'     => $this->client_id,
					'client_secret' => $this->secret,
					'email'         => $email,
					'grant_type'      => 'https://visual.dev/api/extended_client_credentials'
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
	 * @param $refresh_token
	 *
	 * @return Brizy_Editor_API_AccessToken
	 * @throws Exception
	 */
	public function refresh_token( $refresh_token ) {

		throw new \Exception('Use getToken.');

		$response = Brizy_Editor_Http_Client::post( $this->refresh_url(),
			array(
				'body'      => array(
					'refresh_token' => $refresh_token,
					'grant_type' => 'refresh_token'
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

}