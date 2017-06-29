<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class BitBlox_WP_User {
	/**
	 * @var BitBlox_WP_API_Access_Token
	 */
	private $token;

	/**
	 * @return BitBlox_WP_User
	 */
	public static function get() {
		try {
			return new BitBlox_WP_User( BitBlox_WP_Storage::instance()->get( 'access-token' ) );
		} catch ( BitBlox_WP_Exception_Not_Found $exception ) {
			return self::create_user();
		}
	}

	/**
	 * @param $email
	 * @param $password
	 *
	 * @return BitBlox_WP_Http_Response
	 */
	public static function sign_up( $email, $password ) {
		return BitBlox_WP_API_Auth::create_user( $email, $password );
	}

	/**
	 * @param $email
	 * @param $password
	 *
	 * @return BitBlox_WP_User
	 */
	public static function login( $email, $password ) {
		$token = BitBlox_WP_Storage::instance()
		                           ->set( 'access-token', BitBlox_WP_API_Auth::auth( $email, $password ) )
		                           ->get( 'access-token' );

		return new BitBlox_WP_User( $token );
	}

	/**
	 * @return void
	 */
	public static function logout() {
		BitBlox_WP_Storage::instance()->delete( 'access-token' );
	}

	public function get_projects() {
		try {
			return $this->get_client()->get_projects();
		} catch ( BitBlox_WP_Http_Response_Exception_Unauthorized $exception ) {
			$this->refresh_token();

			return $this->get_client()->get_projects();
		}
	}

	/**
	 * @param null $id
	 *
	 * @return BitBlox_WP_Project
	 */
	public function get_project( $id = null ) {
		try {
			return $this->_get_project( $id );
		} catch ( BitBlox_WP_Http_Response_Exception_Unauthorized $exception ) {
			$this->refresh_token();

			return $this->_get_project( $id );
		}
	}

	public function delete_project( BitBlox_WP_Project $project ) {
		try {
			return $this->_delete_project( $project );
		} catch ( BitBlox_WP_Http_Response_Exception_Unauthorized $exception ) {
			$this->refresh_token();

			return $this->_delete_project( $project );
		}
	}

	public function update_project( BitBlox_WP_Project $project, $title, $content ) {
		$page = BitBlox_WP_API_Page::get()
		                           ->set_title( $title )
		                           ->set_content( $content );
		try {
			$this->_update_project( $project, $page );
		} catch ( BitBlox_WP_Http_Response_Exception_Unauthorized $exception ) {
			$this->refresh_token();
			$this->_update_project( $project, $page );
		}

		return $this;
	}

	public function get_html( BitBlox_WP_Project $project ) {
		try {
			return $this->get_client()->get_page_html( $project->get_id(), $project->get_page_id() );
		} catch ( BitBlox_WP_Http_Response_Exception_Unauthorized $exception ) {
			$this->refresh_token();

			return $this->get_client()->get_page_html( $project->get_id(), $project->get_page_id() );
		}
	}

	public function get_html_dev( BitBlox_WP_Post $post ) {
		$editor = new BitBlox_WP_Editor( $post->get_id(), $post->get_project()->get_id() );
		$res    = wp_remote_post(
			'http://bitblox-compiler.dev/',
			array(
				'body'    => array(
					'pages'   => json_encode( array( BitBlox_WP_Editor_API::create_post_arr( $post ) ) ),
					'globals' => json_encode( $post->get_globals() ),
					'config'  => $editor->config(),
					'env'     => 'WP'
				),
				'timeout' => 60
			)
		);

		return array( 'html' => trim( $res['body'] ) );
	}

	public function get_media_id( BitBlox_WP_Project $project, $att_id ) {
		try {
			$projects = BitBlox_WP_Post_Storage::instance( $att_id )->get( 'projects' );
		} catch ( BitBlox_WP_Exception_Not_Found $exception ) {
			$projects = array();
		}

		if ( isset( $projects[ $project->get_id() ] ) ) {
			return $projects[ $project->get_id() ];
		}


		try {
			$response = $this
				->get_client()
				->add_media( $project->get_id(), $this->image_to_base64( $att_id ) );
		} catch ( BitBlox_WP_Http_Response_Exception_Unauthorized $exception ) {
			$this->refresh_token();

			$response = $this
				->get_client()
				->add_media( $project->get_id(), $this->image_to_base64( $att_id ) );
		}

		$projects[ $project->get_id() ] = $response['name'];
		BitBlox_WP_Post_Storage::instance( $att_id )->set( 'projects', $projects );

		return $response['name'];
	}

	/**
	 * @return BitBlox_WP_User
	 */
	protected static function create_user() {
		$email = self::random_email();
		$pass  = self::random_password();

		self::sign_up( $email, $pass );

		return self::login( $email, $pass );
	}

	protected static function random_email() {
		return uniqid( 'bitblox-wp-' ) . '@test.com';
	}

	protected static function random_password() {
		return uniqid();
	}

	protected function __construct( BitBlox_WP_API_Access_Token $token ) {
		$this->token = $token;
	}

	protected function get_token() {
		return $this->token;
	}

	protected function get_client() {
		return new BitBlox_WP_API_Client( $this->get_token() );
	}

	protected function refresh_token() {
		$token = BitBlox_WP_Storage
			::instance()
			->set( 'access-token', BitBlox_WP_API_Auth::refresh_token( $this->get_token()->refresh_token() ) )
			->get( 'access-token' );

		$this->token = $token;

		return $this;
	}

	protected function create_page() {
		$project = $this->get_client()->create_project();
		$page    = $this->get_client()->create_page( $project['id'], new BitBlox_WP_API_Page() );

		return new BitBlox_WP_Project( $project['id'], $page['id'] );
	}

	/**
	 * @param $id
	 *
	 * @return BitBlox_WP_Project
	 */
	protected function _get_project( $id ) {
		try {
			$project = $this->get_client()->get_project( $id );
			try {
				$pages = $this->get_client()->get_pages( $project['id'] );
				$page  = $pages[0];
			} catch ( BitBlox_WP_Http_Response_Exception_Not_Found $exception ) {
				$page = $this->get_client()->create_page( $project['id'], new BitBlox_WP_API_Page() );
			}

			return new BitBlox_WP_Project( $project['id'], $page['id'] );
		} catch ( BitBlox_WP_Http_Response_Exception_Not_Found $exception ) {
			return $this->create_page();
		}
	}

	protected function _update_project( BitBlox_WP_Project $project, BitBlox_WP_API_Page $content ) {
		return $this->get_client()
		            ->update_page(
			            $project->get_id(),
			            $project->get_page_id(),
			            $content
		            );
	}

	protected function _delete_project( BitBlox_WP_Project $project ) {
		return $this->get_client()->delete_project( $project->get_id() );
	}

	protected function image_to_base64( $attachment_id ) {
		$path = get_attached_file( $attachment_id, true );

		if ( ! $path ) {
			throw new BitBlox_WP_Exception_Not_Found( "Attachment $attachment_id cannot be found" );
		}

		$data = file_get_contents( $path );

		return base64_encode( $data );
	}
}
