<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Editor_User {

	private static $is_allowed_for_current_user;

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

		$this->platform_user_id        = $common_storage->get( 'platform_user_id' );
		$this->platform_user_email     = $common_storage->get( 'platform_user_email' );
		$this->platform_user_signature = $common_storage->get( 'platform_user_signature' );

		$token_data = $common_storage->get( 'access-token', false );
		if ( $token_data instanceof Brizy_Editor_API_AccessToken ) {
			$this->token = $token_data;
			$common_storage->set( 'access-token', $token_data->convertToOptionValue() );
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


	/**
	 * @param Brizy_Editor_Project $project
	 * @param Brizy_Editor_Post $post
	 *
	 * @return array
	 * @throws Brizy_Editor_API_Exceptions_Exception
	 * @throws Brizy_Editor_Http_Exceptions_BadRequest
	 * @throws Brizy_Editor_Http_Exceptions_ResponseException
	 * @throws Brizy_Editor_Http_Exceptions_ResponseNotFound
	 * @throws Brizy_Editor_Http_Exceptions_ResponseUnauthorized
	 * @throws Exception
	 */
	public function compile_page( $project, $post ) {

		$editor_data = $post->get_editor_data();

		$config     = Brizy_Editor_Editor_Editor::get( $project, $post )->config(Brizy_Editor_Editor_Editor::COMPILE_CONTEXT);
		$urlBuilder = new Brizy_Editor_UrlBuilder( $project, $post->getWpPostId() );

		return $this->get_client()->compile_page( $project, $editor_data, $config, $urlBuilder->compiler_url() );
	}

	public static function is_administrator() {

		if ( ! is_user_logged_in() ) {
			return false;
		}

		return current_user_can( 'manage_options' ) || is_super_admin();
	}

	public static function is_user_allowed() {

		if ( ! is_user_logged_in() ) {
			return false;
		}

		if ( Brizy_Editor_User::is_administrator() ) {
			return true;
		}

		if ( is_null( self::$is_allowed_for_current_user ) ) {
			self::$is_allowed_for_current_user =
				(
					current_user_can( Brizy_Admin_Capabilities::CAP_EDIT_WHOLE_PAGE ) ||
					current_user_can( Brizy_Admin_Capabilities::CAP_EDIT_CONTENT_ONLY )
				);
		}

		return self::$is_allowed_for_current_user;
	}

	protected function get_token() {
		return $this->token;
	}

	protected function get_client() {
		return new Brizy_Editor_API_Client( $this->get_token() );
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
