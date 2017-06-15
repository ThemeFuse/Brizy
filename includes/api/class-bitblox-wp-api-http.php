<?php

class BitBlox_WP_API_Http {

	/**
	 * @param $url
	 * @param array $options
	 * @param string $method
	 *
	 * @return BitBlox_WP_API_Http_Response
	 * @throws BitBlox_WP_API_Exception_Http_Response
	 */
	public static function request( $url, array $options = array(), $method = 'GET' ) {
		switch ( strtoupper( $method ) ) {
			case 'PUT' :
				$options['method'] = 'PUT';

				$response = new BitBlox_WP_API_Http_Response( self::client()->request( $url, $options ) );
				break;
			case 'POST' :
				$response = new BitBlox_WP_API_Http_Response( self::client()->post( $url, $options ) );
				break;
			default:
				$response = new BitBlox_WP_API_Http_Response( self::client()->get( $url, $options ) );
		}

		if ( $response->is_ok() ) {
			return $response;
		}

		switch ( $response->get_status_code() ) {
			case 400 :
				throw new BitBlox_WP_API_Exception_Http_Response_Bad_Request( $response );
			case 401 :
				throw new BitBlox_WP_API_Exception_Http_Response_Unauthorized( $response );
			case 404 :
				throw new BitBlox_WP_API_Exception_Http_Response_Not_Found( $response );
			default :
				throw new BitBlox_WP_API_Exception_Http_Response( $response );
		}
	}

	/**
	 * @param $url
	 * @param array $options
	 *
	 * @return BitBlox_WP_API_Http_Response
	 */
	public static function get( $url, array $options = array() ) {
		return self::request( $url, $options, 'GET' );
	}

	/**
	 * @param $url
	 * @param $options
	 *
	 * @return BitBlox_WP_API_Http_Response
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