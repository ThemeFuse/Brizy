<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 10/11/17
 * Time: 2:14 PM
 */

class Brizy_Editor_API_Platform extends Brizy_Editor_Http_Client {

	/**
	 * @var string
	 */
	private $client_id;

	/**
	 * @var string
	 */
	private $secret;

	/**
	 * @var string
	 */
	private $email;


	private function sign_up_url() {
		return Brizy_Config::GATEWAY_URI . '/v1/users';
	}

	private function auth_url() {
		return Brizy_Config::GATEWAY_URI . '/oauth/token';
	}

	/**
	 * Brizy_Editor_API_Platform constructor.
	 */
	public function __construct() {

		parent::__construct();

		$credentials = self::getCredentials();

		$this->client_id = $credentials->client_id;
		$this->secret    = $credentials->client_secret;
		$this->email     = $credentials->email;
	}

	/**
	 * @return Brizy_Editor_API_AccessToken
	 * @throws Brizy_Editor_API_Exceptions_Exception
	 * @throws Brizy_Editor_Http_Exceptions_BadRequest
	 * @throws Brizy_Editor_Http_Exceptions_ResponseException
	 * @throws Brizy_Editor_Http_Exceptions_ResponseNotFound
	 * @throws Brizy_Editor_Http_Exceptions_ResponseUnauthorized
	 */
	private function getToken() {
		$response = $this->post( $this->auth_url(), array(
			'body' => array(
				'client_id'     => $this->client_id,
				'client_secret' => $this->secret,
				'email'         => $this->email,
				'grant_type'    => 'https://visual.dev/api/limited_client_credentials'
			)
		) );

		$response_array = $response->get_response_body();

		$brizy_editor_API_access_token = new Brizy_Editor_API_AccessToken(
			$response_array['access_token'],
			time() + $response_array['expires_in']
		);


		if ( isset( $response_array['refresh_token'] ) ) {
			$brizy_editor_API_access_token->set_refresh_token( $response_array['refresh_token'] );
		}

		return $brizy_editor_API_access_token;
	}


	/**
	 * @return array|mixed|null|object
	 * @throws Exception
	 */
	static public function getCredentials() {

		$credentials = null;

		try {
			$credentials = Brizy_Editor_Storage_Common::instance()->get( 'platform_credentials' );
		} catch ( Exception $e ) {
			$http        = new WP_Http();
			$wp_response = new Brizy_Editor_Http_Response( $http->get( Brizy_Config::BRIZY_REGISTRATION_CREDENTIALS ) );

			if ( $wp_response->is_ok() ) {
				$credentials =  $wp_response->get_response_body();
			} else {
				throw new Exception( 'unable to obtain the platform credentials' );
			}
		}

		return (object)$credentials;

	}

	/**
	 * @param $email
	 *
	 * @return array|mixed|object
	 * @throws Brizy_Editor_API_Exceptions_Exception
	 * @throws Brizy_Editor_Http_Exceptions_BadRequest
	 * @throws Brizy_Editor_Http_Exceptions_ResponseException
	 * @throws Brizy_Editor_Http_Exceptions_ResponseNotFound
	 * @throws Brizy_Editor_Http_Exceptions_ResponseUnauthorized
	 */
	public function createUser( $email ) {
		$token = $this->getToken();

		$response = $this->post( $this->sign_up_url(), array(
				'headers'   => array(
					'Authorization' => 'Bearer ' . $token->access_token()
				),
				'body'      => array(
					'email' => $email,
				),
				'sslverify' => false
			)
		);

		if ( $response->is_ok() ) {
			Brizy_Editor_Storage_Common::instance()->set( 'platform_user_email', $email );
		}

		return $response->get_response_body();
	}
}