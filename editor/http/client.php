<?php

class Brizy_Editor_Http_Client {

	/**
	 * @param $url
	 * @param array $options
	 * @param string $method
	 *
	 * @return Brizy_Editor_Http_Response
	 * @throws Brizy_Editor_Http_Exceptions_ResponseException
	 */
	public static function request( $url, array $options = array(), $method = 'GET' ) {
		switch ( strtoupper( $method ) ) {
			case 'PUT' :
				$options['method'] = 'PUT';

				$response = new Brizy_Editor_Http_Response( self::client()->request( $url, $options ) );
				break;
			case 'POST' :
				$response = new Brizy_Editor_Http_Response( self::client()->post( $url, $options ) );
				break;
			default:
				$response = new Brizy_Editor_Http_Response( self::client()->get( $url, $options ) );
		}

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

	/**
	 * @return WP_Http
	 */
	protected static function client() {
		return new WP_Http();
	}
}