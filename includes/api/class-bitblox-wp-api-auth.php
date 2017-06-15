<?php

class BitBlox_WP_API_Auth {

	public static function base_url() {
		return 'https://test-de12d4.bitblox.site/api/public/users';
	}

	public static function sign_up_url() {
		return implode( '/', array( self::base_url(), 'create' ) );
	}

	public static function auth_url() {
		return implode( '/', array( self::base_url(), 'auth' ) );
	}

	public static function refresh_url() {
		return implode( '/', array( self::base_url(), 'refresh' ) );
	}

	/**
	 * @param $email
	 * @param $password
	 *
	 * @return BitBlox_WP_API_Access_Token
	 */
	public static function auth( $email, $password ) {
		$response = self::auth_call( self::auth_url(), $email, $password )->get_body();

		return new BitBlox_WP_API_Access_Token(
			$response['access_token'],
			$response['refresh_token'],
			$response['expires_in'] + time()
		);
	}

	/**
	 * @param $refresh_token
	 *
	 * @return BitBlox_WP_API_Access_Token
	 */
	public static function refresh_token( $refresh_token ) {
		$response = BitBlox_WP_API_Http::post( self::refresh_url(),
			array(
				'body' => array(
					'refresh_token' => $refresh_token
				),
				'sslverify' => false
			)
		)->get_body();

		return new BitBlox_WP_API_Access_Token(
			$response['access_token'],
			$response['refresh_token'],
			$response['expires_in'] + time()
		);
	}

	public static function create_user( $email, $password ) {
		return self::auth_call( self::sign_up_url(), $email, $password )->get_body();
	}

	protected static function auth_call( $url, $email, $password ) {
		return BitBlox_WP_API_Http::post( $url,
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