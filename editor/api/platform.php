<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 10/11/17
 * Time: 2:14 PM
 */

class Brizy_Editor_API_Platform extends Brizy_Editor_Http_Client{

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

	/**
	 * @var string
	 */
	private $password;


	private function sign_up_url() {
		return Brizy_Config::GATEWAY_URI . '/v1/users';
	}

	private function auth_url() {
		return Brizy_Config::GATEWAY_URI . '/oauth/token';
	}

	/**
	 * Brizy_Editor_API_Platform constructor.
	 *
	 * @param string $client_id
	 * @param string $secret
	 * @param string $email
	 * @param string $password
	 */
	public function __construct( $client_id, $secret, $email, $password ) {
		$this->client_id = $client_id;
		$this->secret    = $secret;
		$this->email     = $email;
		$this->password  = $password;
	}

	/**
	 * @return Brizy_Editor_API_AccessToken
	 */
	private function getToken() {
		$response = $this->post( $this->auth_url(), array(
			'body' => array(
				'client_id'     => $this->client_id,
				'client_secret' => $this->secret,
				'email'         => $this->email,
				'password'      => $this->password,
				'grant_type'    => 'https://visual.dev/api/limited_client_credentials'
			)
		) );

		$response_array = $response->get_response_body();

		$brizy_editor_API_access_token = new Brizy_Editor_API_AccessToken(
			$response_array['access_token'],
			time() + $response_array['expires_in']
		);


		if(isset($response_array['refresh_token']))
			$brizy_editor_API_access_token->set_refresh_token( $response_array['refresh_token'] );

		return $brizy_editor_API_access_token;
	}


	/**
	 * @param $email
	 * @param $password
	 *
	 * @return array|mixed|object
	 */
	public function createUser( $email, $password=null ) {
		$token = $this->getToken();

		$response = $this->post( $this->sign_up_url(), array(
				'headers'   => array(
					'Authorization' => 'Bearer ' . $token->access_token()
				),
				'body'      => array(
					'email'    => $email,
					//'password' => $password
				),
				'sslverify' => false
			)
		);

		if($response->is_ok())
		{
			Brizy_Editor_Storage_Common::instance()->set( 'platform_user_email', $email );
		}

		return $response->get_response_body();
	}
}