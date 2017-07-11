<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_User {
	/**
	 * @var Brizy_API_Access_Token
	 */
	private $token;

	/**
	 * @return Brizy_User
	 * @throws Brizy_Exception_Service_Unavailable
	 */
	public static function get() {

		if ( self::is_locked() ) {
			throw new Brizy_Exception_Service_Unavailable(
				'User is in maintenance mode'
			);
		}

		try {
			return new Brizy_User( Brizy_Storage::instance()->get( 'access-token' ) );
		} catch ( Brizy_Exception_Not_Found $exception ) {
			return self::create_user();
		}
	}

	/**
	 * @param $email
	 * @param $password
	 *
	 * @return Brizy_Http_Response
	 * @throws Exception
	 */
	public static function sign_up( $email, $password ) {
		try {
			self::lock_access();
			$user = Brizy_API_Auth::create_user( $email, $password );
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
	 * @return Brizy_User
	 * @throws Exception
	 */
	public static function login( $email, $password ) {
		try {
			self::lock_access();
			$token = Brizy_Storage::instance()
			                           ->set( 'access-token', Brizy_API_Auth::auth( $email, $password ) )
			                           ->get( 'access-token' );
		} catch ( Exception $exception ) {
			self::unlock_access();
			throw $exception;
		}

		self::unlock_access();

		return new Brizy_User( $token );
	}

	/**
	 * @return void
	 */
	public static function logout() {
		Brizy_Storage::instance()->delete( 'access-token' );
	}

	public function get_projects() {
		try {
			return $this->get_client()->get_projects();
		} catch ( Brizy_Http_Response_Exception_Unauthorized $exception ) {
			$this->refresh_token();

			return $this->get_client()->get_projects();
		}
	}

	/**
	 * @param null $id
	 *
	 * @return Brizy_API_Project
	 */
	public function get_project( $id = null ) {
		try {
			return $this->_get_project( $id );
		} catch ( Brizy_Http_Response_Exception_Unauthorized $exception ) {
			$this->refresh_token();

			return $this->_get_project( $id );
		}
	}

	public function get_page_data( Brizy_API_Project $project ) {
		try {
			return $this->_get_page_data( $project );
		} catch ( Brizy_Http_Response_Exception_Unauthorized $exception ) {
			$this->refresh_token();

			return $this->_get_page_data( $project );
		}
	}

	public function create_project() {
		try {
			return $this->_create_project();
		} catch ( Brizy_Http_Response_Exception_Unauthorized $exception ) {
			$this->refresh_token();

			return $this->_create_project();
		}
	}

	public function publish_project( Brizy_API_Project $project ) {
		try {
			$this->get_client()->publish_project( $project->get_id() );
		} catch ( Brizy_Http_Response_Exception_Unauthorized $exception ) {
			$this->refresh_token();
			$this->get_client()->publish_project( $project->get_id() );
		}

		return $this;
	}

	public function delete_project( Brizy_API_Project $project ) {
		try {
			return $this->_delete_project( $project );
		} catch ( Brizy_Http_Response_Exception_Unauthorized $exception ) {
			$this->refresh_token();

			return $this->_delete_project( $project );
		}
	}

	public function update_page( Brizy_API_Project $project, $title, $content ) {
		$page = Brizy_API_Page::get()
		                           ->set_title( $title )
		                           ->set_content( $content );
		try {
			$this->_update_page( $project, $page );
		} catch ( Brizy_Http_Response_Exception_Unauthorized $exception ) {
			$this->refresh_token();
			$this->_update_page( $project, $page );
		}

		return $this;
	}

	public function update_project_globals( Brizy_API_Project $project ) {
		try {
			$this->_update_project( $project );
		} catch ( Brizy_Http_Response_Exception_Unauthorized $exception ) {
			$this->refresh_token();
			$this->_update_project( $project );
		}

		return $this;
	}

	public function get_html( Brizy_API_Project $project ) {
		try {
			return $this->get_client()->get_page_html( $project->get_id(), $project->get_page_id() );
		} catch ( Brizy_Http_Response_Exception_Unauthorized $exception ) {
			$this->refresh_token();

			return $this->get_client()->get_page_html( $project->get_id(), $project->get_page_id() );
		}
	}

	public function get_html_dev( Brizy_Post $post ) {
		$editor = new Brizy_Editor( $post );
		$res    = wp_remote_post(
			'http://bitblox-compiler.dev/',
			array(
				'body'    => array(
					'pages'   => json_encode( array( Brizy_Editor_API::create_post_arr( $post ) ) ),
					'globals' => $post->get_globals(),
					'config'  => $editor->config(),
					'env'     => 'WP'
				),
				'timeout' => 60
			)
		);

		return array( 'html' => trim( $res['body'] ) );
	}

	public function get_media_id( Brizy_API_Project $project, $att_id ) {
		try {
			$projects = Brizy_Post_Storage::instance( $att_id )->get( 'projects' );
		} catch ( Brizy_Exception_Not_Found $exception ) {
			$projects = array();
		}

		if ( isset( $projects[ $project->get_id() ] ) ) {
			return $projects[ $project->get_id() ];
		}


		try {
			$response = $this
				->get_client()
				->add_media( $project->get_id(), $this->image_to_base64( $att_id ) );
		} catch ( Brizy_Http_Response_Exception_Unauthorized $exception ) {
			$this->refresh_token();

			$response = $this
				->get_client()
				->add_media( $project->get_id(), $this->image_to_base64( $att_id ) );
		}

		$projects[ $project->get_id() ] = $response['name'];
		Brizy_Post_Storage::instance( $att_id )->set( 'projects', $projects );

		return $response['name'];
	}

	/**
	 * @return Brizy_User
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

	protected function __construct( Brizy_API_Access_Token $token ) {
		$this->token = $token;
	}

	protected function get_token() {
		return $this->token;
	}

	protected function get_client() {
		return new Brizy_API_Client( $this->get_token() );
	}

	public function refresh_token() {
		try {
			self::lock_access();
			$refresh   = $this->get_token()->refresh_token();
			$storage   = Brizy_Storage::instance();
			$new_token = Brizy_API_Auth::refresh_token( $refresh );
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

	protected function _get_page_data( Brizy_API_Project $project ) {
		return $this->get_client()->get_page( $project->get_id(), $project->get_page_id() );
	}

	/**
	 * @param $id
	 *
	 * @return Brizy_API_Project
	 */
	protected function _get_project( $id ) {
		$project = $this->get_client()->get_project( $id );
		$pages   = $this->get_client()->get_pages( $project['id'] );
		$page    = $pages[0];

		return new Brizy_API_Project( $project['id'], $page['id'], $project['globals'] );
	}

	protected function _create_project() {
		$project = $this->get_client()->create_project();
		$page    = $this->get_client()->create_page( $project['id'], new Brizy_API_Page() );

		return new Brizy_API_Project( $project['id'], $page['id'], $project['globals'] );
	}

	protected function _update_project( Brizy_API_Project $project ) {
		return $this->get_client()->update_project(
			$project,
			array( 'globals' => $project->get_globals() )
		);
	}

	protected function _update_page( Brizy_API_Project $project, Brizy_API_Page $content ) {
		return $this->get_client()
		            ->update_page(
			            $project->get_id(),
			            $project->get_page_id(),
			            $content
		            );
	}

	protected function _delete_project( Brizy_API_Project $project ) {
		return $this->get_client()->delete_project( $project->get_id() );
	}

	protected function image_to_base64( $attachment_id ) {
		$path = get_attached_file( $attachment_id, true );

		if ( ! $path ) {
			throw new Brizy_Exception_Not_Found( "Attachment $attachment_id cannot be found" );
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
