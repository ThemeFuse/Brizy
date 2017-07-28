<?php

class Brizy_Editor_API_Auth {

	/**
	 * @param $email
	 * @param $password
	 *
	 * @return Brizy_Editor_API_AccessToken
	 */
	public static function auth( $email, $password ) {
		$response = self::auth_call( Brizy_Editor_Api_Config::auth_url(), $email, $password )->get_response_body();

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
	public static function refresh_token( $refresh_token ) {
		$response = Brizy_Editor_Http_Client::post( Brizy_Editor_Api_Config::refresh_url(),
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
	public static function create_user( $email, $password ) {
		return self::auth_call( Brizy_Editor_Api_Config::sign_up_url(), $email, $password )->get_response_body();
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
	protected static function auth_call( $url, $email, $password ) {
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