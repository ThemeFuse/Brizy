<?php

class Brizy_Editor_Http_Client {

	/**
	 * @param $url
	 * @param array $options
	 * @param string $method
	 *
	 * @return Brizy_Editor_Http_Response
	 * @throws Brizy_Editor_Http_Exceptions_BadRequest
	 * @throws Brizy_Editor_Http_Exceptions_ResponseException
	 * @throws Brizy_Editor_Http_Exceptions_ResponseNotFound
	 * @throws Brizy_Editor_Http_Exceptions_ResponseUnauthorized
	 */
	public static function request( $url, array $options = array(), $method = 'GET' ) {

		$http = new WP_Http();

		$options['method'] = $method;

		$wp_response = $http->request( $url, $options );

		if ( is_wp_error( $wp_response ) ) {
			throw new Brizy_Editor_Http_Exceptions_ResponseException( $wp_response->get_error_message() );
		}

		$response = new Brizy_Editor_Http_Response( $wp_response );

		if ( $response->is_ok() ) {
			return $response;
		}

		switch ( $response->get_status_code() ) {
			case 400 :
				throw new Brizy_Editor_Http_Exceptions_BadRequest( $response );
			case 401 :
				throw new Brizy_Editor_Http_Exceptions_ResponseUnauthorized( $response );
			case 404 :
				throw new Brizy_Editor_Http_Exceptions_ResponseNotFound( $response );
			default :
				throw new Brizy_Editor_Http_Exceptions_ResponseException( $response );
		}

	}

	/**
	 * @param $url
	 * @param array $options
	 *
	 * @return Brizy_Editor_Http_Response
	 */
	public static function get( $url, array $options = array() ) {
		return self::request( $url, $options, 'GET' );
	}

	/**
	 * @param $url
	 * @param $options
	 *
	 * @return Brizy_Editor_Http_Response
	 */
	public static function post( $url, $options ) {
		return self::request( $url, $options, 'POST' );
	}
}