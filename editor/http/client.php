<?php

class Brizy_Editor_Http_Client {

	/**
	 * @var WP_Http
	 */
	private $http;


	/**
	 * Brizy_Editor_Http_Client constructor.
	 *
	 * @param null $http
	 */
	public function __construct( $http = null ) {

		if ( is_null( $http ) ) {
			$this->http = new WP_Http();
		} else {
			$this->http = $http;
		}

		add_filter( 'http_request_args', array( $this, 'sendExpect' ) );
	}

	/**
	 * @param $r
	 *
	 * @return mixed
	 */
	public function sendExpect( $r ) {
		$r['headers']['Expect'] = '';

		return $r;
	}

	/**
	 * @param $url
	 * @param array $options
	 * @param string $method
	 *
	 * @return Brizy_Editor_Http_Response
	 * @throws Brizy_Editor_API_Exceptions_Exception
	 * @throws Brizy_Editor_Http_Exceptions_BadRequest
	 * @throws Brizy_Editor_Http_Exceptions_ResponseException
	 * @throws Brizy_Editor_Http_Exceptions_ResponseNotFound
	 * @throws Brizy_Editor_Http_Exceptions_ResponseUnauthorized
	 */
	public function request( $url, $options = array(), $method = 'GET' ) {

		$options['method']  = $method;
		$options['timeout'] = Brizy_Config::WP_HTTP_TIMEOUT;
		$options            = $this->prepare_options( $options );
		$response           = null;

		if ( is_string( $url ) ) {
			Brizy_Logger::instance()->notice( "{$method} request to {$url}", array( 'options' => $options ) );
			$wp_response = $this->getHttp()->request( $url, $options );

			if ( is_wp_error( $wp_response ) ) {
				throw new Brizy_Editor_API_Exceptions_Exception( $wp_response->get_error_message() );
			}

			$response = new Brizy_Editor_Http_Response( $wp_response );

		} else {

			foreach ( $url as $aurl ) {
				$wp_response = $this->getHttp()->request( $aurl, $options );
				$response    = new Brizy_Editor_Http_Response( $wp_response );

				if ( is_wp_error( $wp_response ) || ! $response->is_ok() ) {
					continue;
				} else {
					break;
				}
			}
		}

		if ( $response && $response->is_ok() ) {
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
	 * @throws Brizy_Editor_API_Exceptions_Exception
	 * @throws Brizy_Editor_Http_Exceptions_BadRequest
	 * @throws Brizy_Editor_Http_Exceptions_ResponseException
	 * @throws Brizy_Editor_Http_Exceptions_ResponseNotFound
	 * @throws Brizy_Editor_Http_Exceptions_ResponseUnauthorized
	 */
	public function get( $url, $options = array() ) {
		return $this->request( $url, $options, 'GET' );
	}

	/**
	 * @param $url
	 * @param $options
	 *
	 * @return Brizy_Editor_Http_Response
	 * @throws Brizy_Editor_API_Exceptions_Exception
	 * @throws Brizy_Editor_Http_Exceptions_BadRequest
	 * @throws Brizy_Editor_Http_Exceptions_ResponseException
	 * @throws Brizy_Editor_Http_Exceptions_ResponseNotFound
	 * @throws Brizy_Editor_Http_Exceptions_ResponseUnauthorized
	 */
	public function post( $url, $options ) {
		return $this->request( $url, $options, 'POST' );
	}

	/**
	 * @param $route
	 * @param null $options
	 *
	 * @return Brizy_Editor_Http_Response
	 * @throws Brizy_Editor_API_Exceptions_Exception
	 * @throws Brizy_Editor_Http_Exceptions_BadRequest
	 * @throws Brizy_Editor_Http_Exceptions_ResponseException
	 * @throws Brizy_Editor_Http_Exceptions_ResponseNotFound
	 * @throws Brizy_Editor_Http_Exceptions_ResponseUnauthorized
	 */
	public function put( $route, $options = null ) {
		return $this->request( $route, $options, 'PUT' );
	}

	/**
	 * @param $route
	 * @param null $options
	 *
	 * @return Brizy_Editor_Http_Response
	 * @throws Brizy_Editor_API_Exceptions_Exception
	 * @throws Brizy_Editor_Http_Exceptions_BadRequest
	 * @throws Brizy_Editor_Http_Exceptions_ResponseException
	 * @throws Brizy_Editor_Http_Exceptions_ResponseNotFound
	 * @throws Brizy_Editor_Http_Exceptions_ResponseUnauthorized
	 */
	public function delete( $route, $options = null ) {
		return $this->request( $route, $options, 'DELETE' );
	}

	/**
	 * @return WP_Http
	 */
	public function getHttp() {
		return $this->http;
	}

	/**
	 * @param $options
	 *
	 * @return array
	 */
	protected function prepare_options( $options ) {

		if ( ! is_array( $options ) ) {
			$options = array();
		}

		if ( ! isset( $options['headers'] ) ) {
			$options['headers'] = array();
		}

		return $options;
	}
}
