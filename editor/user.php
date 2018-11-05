<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Editor_User {

	const BRIZY_ATTACHMENT_HASH_KEY = 'brizy_attachment_hash';

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
	 * @var string
	 */
	private $platform_user_id;

	/**
	 * @var string
	 */
	private $platform_user_email;

	/**
	 * @var string
	 */
	private $platform_user_signature;

	/**
	 * Brizy_Editor_User constructor.
	 *
	 * @param $common_storage
	 *
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	protected function __construct( $common_storage ) {

		$this->common_storage = $common_storage;

		$this->platform_user_id        = $this->common_storage->get( 'platform_user_id' );
		$this->platform_user_email     = $this->common_storage->get( 'platform_user_email' );
		$this->platform_user_signature = $this->common_storage->get( 'platform_user_signature' );

		$token_data = $this->common_storage->get( 'access-token', false );
		if ( $token_data instanceof Brizy_Editor_API_AccessToken ) {
			$this->token = $token_data;
			$this->common_storage->set( 'access-token', $token_data->convertToOptionValue() );
		} elseif ( is_array( $token_data ) ) {
			$this->token = Brizy_Editor_API_AccessToken::createFromSerializedData( $token_data );
		}
	}

	/**
	 * @return Brizy_Editor_User
	 * @throws Brizy_Editor_Exceptions_ServiceUnavailable
	 * @throws Exception
	 */
	public static function get() {

		if ( self::$instance ) {
			return self::$instance;
		}

		$user = null;

		try {
			$user = new Brizy_Editor_User( Brizy_Editor_Storage_Common::instance() );
		} catch ( Brizy_Editor_Exceptions_NotFound $e ) {

			Brizy_Logger::instance()->notice( 'New user created' );
			Brizy_Editor_Storage_Common::instance()->set( 'platform_user_local', true );
			Brizy_Editor_Storage_Common::instance()->set( 'platform_user_id', uniqid( 'user', true ) );
			Brizy_Editor_Storage_Common::instance()->set( 'platform_user_email', self::generateRandomEmail() );
			Brizy_Editor_Storage_Common::instance()->set( 'platform_user_signature', Brizy_Editor_Signature::get() );

			$user = new Brizy_Editor_User( Brizy_Editor_Storage_Common::instance() );
		}

		return self::$instance = $user;
	}

	public static function reload() {
		return self::$instance = new self( Brizy_Editor_Storage_Common::instance() );
	}

	/**
	 * @return string
	 */
	static protected function generateRandomEmail() {
		$uniqid = 'brizy-' . md5( uniqid( '', true ) );

		return $uniqid . '@brizy.io';
	}


//	/**
//	 * @param null $from_project_id
//	 * @param bool $is_local
//	 *
//	 * @return Brizy_Editor_API_Project
//	 * @throws Brizy_Editor_API_Exceptions_Exception
//	 * @throws Brizy_Editor_Http_Exceptions_BadRequest
//	 * @throws Brizy_Editor_Http_Exceptions_ResponseException
//	 * @throws Brizy_Editor_Http_Exceptions_ResponseNotFound
//	 * @throws Brizy_Editor_Http_Exceptions_ResponseUnauthorized
//	 */
//	public function create_project( $from_project_id = null, $is_local = true ) {
//		Brizy_Logger::instance()->notice( 'Create new project', array( 'clone_from' => $from_project_id ) );
//
//		$project_data = array(
//			'id'          => md5( uniqid( 'Local project', true ) ),
//			'title'       => 'Local project ',
//			'globals'     => '{"project":{},"language":{}}',
//			'name'        => uniqid( 'Local project', true ),
//			'user'        => null,
//			'template'    => array( 'slug' => 'brizy' ),
//			'created'     => new DateTime(),
//			'updated'     => new DateTime(),
//			'languages'   => array(),
//			'version'     => BRIZY_EDITOR_VERSION,
//			'signature'   => Brizy_Editor_Signature::get(),
//			'cloned_from' => $from_project_id,
//		);
//
//		$api_project = new Brizy_Editor_API_Project( $project_data );
//
//		return $api_project;
//	}

//	/**
//	 * @param Brizy_Editor_API_Project $project
//	 *
//	 * @return array|mixed|object
//	 * @throws Brizy_Editor_API_Exceptions_Exception
//	 * @throws Brizy_Editor_Http_Exceptions_BadRequest
//	 * @throws Brizy_Editor_Http_Exceptions_ResponseException
//	 * @throws Brizy_Editor_Http_Exceptions_ResponseNotFound
//	 * @throws Brizy_Editor_Http_Exceptions_ResponseUnauthorized
//	 * @throws Exception
//	 */
//	public function update_project( $project ) {
//		Brizy_Logger::instance()->notice( 'Update project', array( $project ) );
//
//		$updated_project = $this->get_client()->update_project( $project );
//
//		Brizy_Editor_Project::get()->updateProjectData( new Brizy_Editor_API_Project( $updated_project ) );
//
//		return $updated_project;
//	}

	/**
	 * @param Brizy_Editor_API_Project $project
	 *
	 * @return array|mixed|object
	 * @throws Brizy_Editor_API_Exceptions_Exception
	 * @throws Brizy_Editor_Http_Exceptions_BadRequest
	 * @throws Brizy_Editor_Http_Exceptions_ResponseException
	 * @throws Brizy_Editor_Http_Exceptions_ResponseNotFound
	 * @throws Brizy_Editor_Http_Exceptions_ResponseUnauthorized
	 */
	public function get_project( $project ) {
		return $this->get_client()->get_project( $project );
	}


	/**
	 * @param Brizy_Editor_Project $project
	 * @param Brizy_Editor_Post $post
	 *
	 * @return Brizy_Editor_CompiledHtml
	 * @throws Brizy_Editor_API_Exceptions_Exception
	 * @throws Brizy_Editor_Http_Exceptions_BadRequest
	 * @throws Brizy_Editor_Http_Exceptions_ResponseException
	 * @throws Brizy_Editor_Http_Exceptions_ResponseNotFound
	 * @throws Brizy_Editor_Http_Exceptions_ResponseUnauthorized
	 * @throws Exception
	 */
	public function compile_page( $project, $post ) {

		$editor_data = $post->get_editor_data();

		$config     = Brizy_Editor_Editor_Editor::get( $project, $post )->config();
		$urlBuilder = new Brizy_Editor_UrlBuilder( $project, $post->get_parent_id() );


		$page_html = $this->get_client()->compile_page( $project, $editor_data, $config, $urlBuilder->compiler_url() );

		return $page_html;

	}

	/**
	 * @param Brizy_Editor_Project $project
	 * @param $attachment_id
	 *
	 * @return mixed|null
	 * @throws Brizy_Editor_API_Exceptions_Exception
	 * @throws Brizy_Editor_Exceptions_NotFound
	 * @throws Brizy_Editor_Http_Exceptions_BadRequest
	 * @throws Brizy_Editor_Http_Exceptions_ResponseException
	 * @throws Brizy_Editor_Http_Exceptions_ResponseNotFound
	 * @throws Brizy_Editor_Http_Exceptions_ResponseUnauthorized
	 */
//	public function get_media_id( $project, $attachment_id ) {
//
//		$brizy_editor_storage_post = Brizy_Editor_Storage_Post::instance( $attachment_id );
//		$hash_name                 = null;
//		try {
//			$hash_name = $brizy_editor_storage_post->get( self::BRIZY_ATTACHMENT_HASH_KEY );
//		} catch ( Brizy_Editor_Exceptions_NotFound $exception ) {
//
//			$response = $this
//				->get_client()
//				->add_media( $project->get_id(), $this->image_to_base64( $attachment_id ) );
//
//			$brizy_editor_storage_post->set( self::BRIZY_ATTACHMENT_HASH_KEY, $response['name'] );
//
//			$hash_name = $response['name'];
//		}
//
//		return $hash_name;
//	}

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

	/**
	 * @return string
	 */
	public function getPlatformUserId() {
		return $this->platform_user_id;
	}

	/**
	 * @return string
	 */
	public function getPlatformUserEmail() {
		return $this->platform_user_email;
	}

	/**
	 * @return string
	 */
	public function getPlatformUserSignature() {
		return $this->platform_user_signature;
	}
}
