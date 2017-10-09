<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Editor_User {
	/**
	 * @var Brizy_Editor_API_AccessToken
	 */
	private $token;

	/**
	 * Brizy_Editor_User constructor.
	 *
	 * @param $token
	 */
	protected function __construct( $token ) {
		$this->token = $token;
	}

	/**
	 * @return Brizy_Editor_User
	 * @throws Brizy_Editor_Exceptions_ServiceUnavailable
	 */
	public static function get() {

		if ( self::is_locked() ) {
			throw new Brizy_Editor_Exceptions_ServiceUnavailable(
				'User is in maintenance mode'
			);
		}

		try {
			return new Brizy_Editor_User( Brizy_Editor_Storage_Common::instance()->get( 'access-token' ) );
		} catch ( Brizy_Editor_Exceptions_NotFound $exception ) {
			return self::create_user();
		}
	}

	/**
	 * @param $email
	 * @param $password
	 *
	 * @return Brizy_Editor_Http_Response
	 * @throws Exception
	 */
	public static function sign_up( $email, $password ) {
		try {
			self::lock_access();
			$auth_api = new Brizy_Editor_API_Auth( Brizy_Editor_Api_Config::AUTH_GATEWAY_URI );
			$user     = $auth_api->create_user( $email, $password );
		} catch ( Exception $exception ) {
			self::unlock_access();
			throw $exception;
		}

		self::unlock_access();

		return $user;
	}

	/**
	 * @param $email
	 * @param $password
	 *
	 * @return Brizy_Editor_User
	 * @throws Exception
	 */
	public static function login( $email, $password ) {
		try {
			self::lock_access();

			$auth_api = new Brizy_Editor_API_Auth( Brizy_Editor_Api_Config::AUTH_GATEWAY_URI );
			$atoken   = $auth_api->auth( $email, $password );

			$token = Brizy_Editor_Storage_Common::instance()
			                                    ->set( 'access-token', $atoken )
			                                    ->get( 'access-token' );
		} catch ( Exception $exception ) {
			self::unlock_access();
			throw $exception;
		}

		self::unlock_access();

		return new Brizy_Editor_User( $token );
	}

	/**
	 * @return void
	 */
	public static function logout() {
		Brizy_Editor_Storage_Common::instance()->delete( 'access-token' );
	}

	/**
	 * @return Brizy_Editor_API_Project
	 */
	public function create_project() {
		try {
			return $this->_create_project();
		} catch ( Brizy_Editor_Http_Exceptions_ResponseUnauthorized $exception ) {
			$this->refresh_token();

			return $this->_create_project();
		}
	}

	/**
	 * @param Brizy_Editor_API_Project $project
	 *
	 * @return $this
	 */
	public function publish_project( Brizy_Editor_API_Project $project ) {
		try {
			$this->get_client()->publish_project( $project->get_id() );
		} catch ( Brizy_Editor_Http_Exceptions_ResponseUnauthorized $exception ) {
			$this->refresh_token();
			$this->get_client()->publish_project( $project->get_id() );
		}

		return $this;
	}

	/**
	 * @param Brizy_Editor_API_Project $project
	 *
	 * @return array|mixed|object
	 */
	public function delete_project( Brizy_Editor_API_Project $project ) {
		try {
			return $this->_delete_project( $project );
		} catch ( Brizy_Editor_Http_Exceptions_ResponseUnauthorized $exception ) {
			$this->refresh_token();

			return $this->_delete_project( $project );
		}
	}


	/**
	 * @param Brizy_Editor_API_Project $project
	 *
	 * @return array|mixed|object
	 */
	public function get_page_data( Brizy_Editor_API_Project $project ) {
		try {
			return $this->_get_page_data( $project );
		} catch ( Brizy_Editor_Http_Exceptions_ResponseUnauthorized $exception ) {
			$this->refresh_token();

			return $this->_get_page_data( $project );
		}
	}

	/***
	 * @param Brizy_Editor_API_Project $project
	 *
	 * @return array|mixed|object
	 */
	public function get_pages_data( Brizy_Editor_API_Project $project ) {
		try {
			return $this->_get_pages_data( $project );
		} catch ( Brizy_Editor_Http_Exceptions_ResponseUnauthorized $exception ) {
			$this->refresh_token();

			return $this->_get_pages_data( $project );
		}
	}


	/**
	 * @param Brizy_Editor_API_Project $project
	 *
	 * @return array|mixed|object
	 */
	protected function _get_page_data( Brizy_Editor_API_Project $project ) {
		return $this->get_client()->get_page( $project->get_id(), $project->get_page_id() );
	}

	/**
	 * @param Brizy_Editor_API_Project $project
	 *
	 * @return array|mixed|object
	 */
	protected function _get_pages_data( Brizy_Editor_API_Project $project ) {
		return $this->get_client()->get_pages( $project->get_id() );
	}

	/**
	 * @param Brizy_Editor_Project $project
	 * @param Brizy_Editor_API_Page $page
	 *
	 * @return Brizy_Editor_API_Page
	 */
	public function create_page( $project, $page ) {
		try {
			return $this->_create_page( $project, $page );
		} catch ( Brizy_Editor_Http_Exceptions_ResponseUnauthorized $exception ) {
			$this->refresh_token();

			return $this->_create_page( $project, $page );
		}
	}


	public function delete_page( Brizy_Editor_API_Project $project, Brizy_Editor_API_Page $page ) {
		try {
			return $this->_delete_page( $project, $page );
		} catch ( Brizy_Editor_Http_Exceptions_ResponseUnauthorized $exception ) {
			$this->refresh_token();

			return $this->_delete_page( $project, $page );
		}
	}

	public function update_page( Brizy_Editor_API_Project $project, Brizy_Editor_API_Page $page ) {
		try {
			$page = $this->_update_page( $project, $page );
		} catch ( Brizy_Editor_Http_Exceptions_ResponseUnauthorized $exception ) {
			$this->refresh_token();
			$this->_update_page( $project, $page );
		}

		return $this;
	}

	public function update_project( Brizy_Editor_API_Project $project ) {
		try {
			$this->_update_project( $project );
		} catch ( Brizy_Editor_Http_Exceptions_ResponseUnauthorized $exception ) {
			$this->refresh_token();
			$this->_update_project( $project );
		}

		return $this;
	}


	public function get_html( Brizy_Editor_API_Project $project ) {
		try {
			return $this->get_client()->get_page_html( $project->get_id(), $project->get_page_id() );
		} catch ( Brizy_Editor_Http_Exceptions_ResponseUnauthorized $exception ) {
			$this->refresh_token();

			return $this->get_client()->get_page_html( $project->get_id(), $project->get_page_id() );
		}
	}

	public function compile_page( Brizy_Editor_Project $project, Brizy_Editor_Post $post ) {
		$editor   = new Brizy_Editor_Editor_Editor( $project, $post );
		$post_arr = Brizy_Editor_API::create_post_arr( $post );

		$remote_post_data = array(
			'body'    => array(
				'pages'   => json_encode( array( $post_arr ) ),
				'globals' => $project->get_globals() ? $project->get_globals() : array(),
				'config'  => $editor->config(),
				'env'     => 'WP'
			),
			'timeout' => 60
		);

		$res = wp_remote_post(
			Brizy_Config::COMPILER_URL,
			$remote_post_data
		);

		if ( is_wp_error( $res ) || wp_remote_retrieve_response_code( $res ) !== 200 ) {

			throw new Brizy_Editor_Http_Exceptions_ResponseException( new Brizy_Editor_Http_Response( $res ) );
		}

		$content = trim( $res['body'] );

		return new Brizy_Editor_CompiledHtml( $content );
	}

	public function get_media_id( Brizy_Editor_Project $project, $attachment_id ) {
		try {
			$projects = Brizy_Editor_Storage_Post::instance( $attachment_id )->get( 'projects' );
		} catch ( Brizy_Editor_Exceptions_NotFound $exception ) {
			$projects = array();
		}

		$project_id = $project->get_id();

		if ( isset( $projects[ $project_id ] ) ) {
			return $projects[ $project_id ];
		}


		try {
			$response = $this
				->get_client()
				->add_media( $project_id, $this->image_to_base64( $attachment_id ) );
		} catch ( Brizy_Editor_Http_Exceptions_ResponseUnauthorized $exception ) {
			$this->refresh_token();

			$response = $this
				->get_client()
				->add_media( $project_id, $this->image_to_base64( $attachment_id ) );
		}

		$projects[ $project_id ] = $response['name'];
		Brizy_Editor_Storage_Post::instance( $attachment_id )->set( 'projects', $projects );

		return $response['name'];
	}

	/**
	 * @return Brizy_Editor_User
	 */
	protected static function create_user() {
		$email = self::random_email();
		$pass  = self::random_password();

		self::sign_up( $email, $pass );

		return self::login( $email, $pass );
	}

	protected static function random_email() {
		return uniqid( 'brizy-' ) . '@test.com';
	}

	protected static function random_password() {
		return uniqid();
	}

	protected function get_token() {
		return $this->token;
	}

	protected function get_client() {
		return new Brizy_Editor_API_Client( $this->get_token() );
	}

	public function refresh_token() {
		try {
			self::lock_access();
			$refresh   = $this->get_token()->refresh_token();
			$storage   = Brizy_Editor_Storage_Common::instance();
			$auth_api  = new Brizy_Editor_API_Auth( Brizy_Editor_Api_Config::AUTH_GATEWAY_URI );
			$new_token = $auth_api->refresh_token( $refresh );
			$token     = $storage
				->set( 'access-token', $new_token )
				->get( 'access-token' );
		} catch ( Exception $exception ) {
			self::unlock_access();
			throw $exception;
		}

		self::unlock_access();
		$this->token = $token;

		return $this;
	}




//	/**
//	 * @param $id
//	 *
//	 * @return Brizy_Editor_API_Project
//	 */
//	protected function _get_project( $id ) {
//		$project = $this->get_client()->get_project( $id );
//		$pages   = $this->get_client()->get_pages( $project['id'] );
//		$page    = $pages[0];
//
//		return new Brizy_Editor_API_Project( $project['id'], $page['id'], $project['globals'] );
//	}

	/**
	 * @return Brizy_Editor_API_Project
	 */
	protected function _create_project() {
		$project_data = $this->get_client()->create_project();

		return new Brizy_Editor_API_Project( $project_data );
	}

	/**
	 * @param Brizy_Editor_API_Project $project
	 * @param Brizy_Editor_API_Page $page
	 *
	 * @return Brizy_Editor_API_Page
	 */
	protected function _create_page( $project, $page ) {

		$page_response = $this->get_client()->create_page( $project->get_id(), $page );

		return new Brizy_Editor_API_Page( $page_response );
	}

	protected function _update_project( Brizy_Editor_API_Project $project ) {

		return $this->get_client()->update_project( $project );
	}

	protected function _update_page( Brizy_Editor_API_Project $project, Brizy_Editor_API_Page $page ) {
		return $this->get_client()
		            ->update_page(
			            $project->get_id(),
			            $page->get_id(),
			            $page
		            );
	}

	protected function _delete_project( Brizy_Editor_API_Project $project ) {
		return $this->get_client()->delete_project( $project->get_id() );
	}

	protected function _delete_page( Brizy_Editor_API_Project $project, Brizy_Editor_API_Page $page ) {
		return $this->get_client()->delete_page( $project->get_id(), $page->get_id() );
	}


	protected function image_to_base64( $attachment_id ) {
		$path = get_attached_file( $attachment_id, true );

		if ( ! $path ) {
			throw new Brizy_Editor_Exceptions_NotFound( "Attachment $attachment_id cannot be found" );
		}

		$data = file_get_contents( $path );

		return base64_encode( $data );
	}


	protected static function lock_access() {
		set_transient( self::lock_key(), 1, 30 );
	}

	protected static function unlock_access() {
		delete_transient( self::lock_key() );
	}

	protected static function lock_key() {
		return brizy()->get_slug() . '-user-maintenance-enabled';
	}

	protected static function is_locked() {
		return (bool) get_transient( self::lock_key() );
	}
}
