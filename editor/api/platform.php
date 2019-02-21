<?php


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
//	private function getToken() {
//
//		Brizy_Logger::instance()->notice( 'Getting token to create the user' );
//
//		$body = array(
//			'client_id'     => $this->client_id,
//			'client_secret' => $this->secret,
//			'email'         => $this->email,
//			'grant_type'    => 'https://visual.dev/api/limited_client_credentials'
//		);
//
//		$response = $this->post( $this->auth_url(), array(
//			'body' => $body
//		) );
//
//		$response_array = $response->get_response_body();
//
//		$brizy_editor_API_access_token = new Brizy_Editor_API_AccessToken(
//			$response_array['access_token'],
//			time() + $response_array['expires_in']
//		);
//
//
//		if ( isset( $response_array['refresh_token'] ) ) {
//			$brizy_editor_API_access_token->set_refresh_token( $response_array['refresh_token'] );
//		}
//
//		return $brizy_editor_API_access_token;
//	}


	/**
	 * @return array|mixed|null|object
	 * @throws Exception
	 */
	static public function getCredentials() {
		return (object) array(
			"client_id"     => Brizy_Config::PLATFORM_CLIENT_ID,
			"client_secret" => Brizy_Config::PLATFORM_CLIENT_SECRET,
			"email"         => Brizy_Config::PLATFORM_EMAIL
		);
	}


	/**
	 * @return string
	 */
//	protected function random_email() {
//		$uniqid = 'brizy-' . md5( uniqid( '', true ) );

//		return $uniqid . '@brizy.io';
//	}

	/**
	 * @param null $clone_id
	 * @param bool $is_local
	 *
	 * @return array|bool|mixed|object
	 * @throws Brizy_Editor_API_Exceptions_Exception
	 * @throws Brizy_Editor_Http_Exceptions_BadRequest
	 * @throws Brizy_Editor_Http_Exceptions_ResponseException
	 * @throws Brizy_Editor_Http_Exceptions_ResponseNotFound
	 * @throws Brizy_Editor_Http_Exceptions_ResponseUnauthorized
	 */
//	public function createUser( $clone_id = null, $is_local = true ) {
//
//		$email = $this->random_email();
//
//		if ( $is_local ) {
//
//			Brizy_Logger::instance()->notice( 'New user created' );
//			Brizy_Editor_Storage_Common::instance()->set( 'platform_user_local', true );
//			Brizy_Editor_Storage_Common::instance()->set( 'platform_user_id', uniqid( 'user', true ) );
//			Brizy_Editor_Storage_Common::instance()->set( 'platform_user_email', $email );
//			Brizy_Editor_Storage_Common::instance()->set( 'platform_user_signature', Brizy_Editor_Signature::get() );
//
//			return Brizy_Editor_User::reload();
//		}
//
//		$token = $this->getToken();
//
//		Brizy_Logger::instance()->notice( 'Create new user', array( 'clone_id' => $clone_id ) );
//
//		$options = array(
//			'headers'   => array(
//				'Authorization' => 'Bearer ' . $token->access_token()
//			),
//			'body'      => array(
//				'email'     => $email,
//				'signature' => Brizy_Editor_Signature::get()
//			),
//			'sslverify' => false
//		);
//
//		if ( $clone_id ) {
//			$options['body']['resource_id_clonable'] = $clone_id;
//		}
//
//		$response = $this->post( $this->sign_up_url(), $options );
//
//		$user = $response->get_response_body();
//
//		if ( $response->is_ok() ) {
//
//			Brizy_Logger::instance()->notice( 'New user created', array( $user ) );
//			Brizy_Editor_Storage_Common::instance()->delete( 'platform_user_local' );
//			Brizy_Editor_Storage_Common::instance()->set( 'platform_user_id', $user['id'] );
//			Brizy_Editor_Storage_Common::instance()->set( 'platform_user_email', $email );
//			Brizy_Editor_Storage_Common::instance()->set( 'platform_user_signature', Brizy_Editor_Signature::get() );
//
//			$user = Brizy_Editor_User::reload();
//
//			// try to create the local project on platform
//			try {
//				$local_project = Brizy_Editor_Project::get();
//
//				$api_project = $user->create_project( null, false );
//				$api_project->set_globals( $local_project->get_globals() );
//
//				$local_project->updateProjectData( $api_project );
//				$local_project->save();
//
//				$user->update_project( $api_project );
//
//				return $user;
//			} catch ( Exception $e ) {
//				Brizy_Logger::instance()->error( 'Unable to create the project for remote user', array( $response ) );
//			}
//		}
//
//		Brizy_Logger::instance()->error( 'Failed to create user', array( $response ) );
//
//		return null;
//	}

	public function isUserCreatedLocally() {
		return Brizy_Editor_Storage_Common::instance()->get( 'platform_user_local', false ) === true;
	}

	/**
	 * @param $data
	 *
	 * @throws Exception
	 */
	public function notifyFormSubmit( $data ) {


		$urlBuilder = new Brizy_Editor_UrlBuilder( Brizy_Editor_Project::get() );
		$urls       = $urlBuilder->application_form_notification_url();

		$response = $this->post( $urls, $data );

		if ( ! $response->is_ok() ) {
			Brizy_Logger::instance()->error( 'Failed to notify the platform about a form submit', array( 'response' => $response ) );
		}
	}
}