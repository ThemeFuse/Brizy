<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Editor_User {

	private static $instance;

	/**
	 * @var Brizy_Editor_API_AccessToken
	 */
	private $token;

	/**
	 * @var Brizy_Editor_Storage_Common
	 */
	private $common_storage;


	/**
	 * @var Brizy_Editor_Storage_Common
	 */
	private $platform_user_email;

	/**
	 * Brizy_Editor_User constructor.
	 *
	 * @param Brizy_Editor_Storage_Common $common_storage
	 *
	 * @throws Brizy_Editor_Exceptions_Exception
	 */
	protected function __construct( $common_storage ) {

		$this->common_storage = $common_storage;

		try {
			$this->token               = $this->common_storage->get( 'access-token' );
			$this->platform_user_email = $this->common_storage->get( 'platform_user_email' );

			if ( $this->token->expired() || true ) {
				$this->auth( $this->platform_user_email );
				$this->token = $this->common_storage->get( 'access-token' );
			}
		} catch ( Brizy_Editor_Exceptions_NotFound $e ) {
			$this->create_user();
		}
	}

	/**
	 * @return Brizy_Editor_User
	 * @throws Brizy_Editor_Exceptions_ServiceUnavailable
	 */
	public static function get() {

		if ( self::$instance ) {
			return self::$instance;
		}

		if ( self::is_locked() ) {
			throw new Brizy_Editor_Exceptions_ServiceUnavailable(
				'User is in maintenance mode'
			);
		}

		return self::$instance = new Brizy_Editor_User( Brizy_Editor_Storage_Common::instance() );
	}

	/**
	 * @return Brizy_Editor_User
	 */
	protected function create_user() {
		$this->platform_user_email = $this->random_email();

		$platform = new Brizy_Editor_API_Platform(
			Brizy_Config::BRIZY_ID,
			Brizy_Config::BRIZY_KEY, Brizy_Config::BRIZY_EMAIL,
			Brizy_Config::BRIZY_PASSWORD );

		$platform->createUser( $this->platform_user_email );

		return $this->login( $this->platform_user_email );
	}

	protected function random_email() {
		$uniqid = uniqid( 'brizy-' );
		return $uniqid . '@brizy.io';
	}


	/**
	 * @param $email
	 *
	 * @return Brizy_Editor_User
	 */
	public function login( $email ) {
		$this->auth( $email );

		return $this;
	}

	public function auth( $email ) {
		try {
			self::lock_access();

			$auth_api    = new Brizy_Editor_API_Auth( Brizy_Config::GATEWAY_URI, Brizy_Config::BRIZY_ID, Brizy_Config::BRIZY_KEY );
			$this->token = $auth_api->getToken( $email );
			$this->common_storage->set( 'access-token', $this->token );

		} catch ( Exception $exception ) {
			self::unlock_access();
			throw $exception;
		}

		self::unlock_access();
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
		$project_data = $this->get_client()->create_project();

		return new Brizy_Editor_API_Project( $project_data );
	}

	/**
	 * @param Brizy_Editor_Project $project
	 * @param Brizy_Editor_API_Page $page
	 *
	 * @return Brizy_Editor_API_Page
	 */
	public function create_page( $project, $page ) {
		$page_response = $this->get_client()->create_page( $project->get_id(), $page );

		return new Brizy_Editor_API_Page( $page_response );

	}


	public function delete_page( Brizy_Editor_API_Project $project, Brizy_Editor_API_Page $page ) {
		return $this->get_client()->delete_page( $project->get_id(), $page->get_id() );
	}

	public function update_page( Brizy_Editor_API_Project $project, Brizy_Editor_API_Page $page ) {
		return $this->get_client()
		            ->update_page(
			            $project->get_id(),
			            $page->get_id(),
			            $page
		            );
	}

	public function update_project( Brizy_Editor_API_Project $project ) {
		return $this->get_client()->update_project( $project );
	}

	public function get_project( Brizy_Editor_API_Project $project ) {
		return $this->get_client()->get_project( $project );
	}

	public function compile_page( Brizy_Editor_Project $project, Brizy_Editor_Post $post ) {
		$api_project = $project->get_api_project();
		$api_page    = $post->get_api_page();

		$config = Brizy_Editor_Editor_Editor::get( $project, $post )->config();

		$res = $this->get_client()->compile_page( $api_project->get_id(), $api_page->get_id(), $config );

		$content = trim( $res['html'] );

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

	protected function get_token() {
		return $this->token;
	}

	protected function get_client() {
		return new Brizy_Editor_API_Client( $this->get_token() );
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
