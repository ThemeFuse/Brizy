<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

include_once ABSPATH . "wp-admin/includes/class-wp-filesystem-base.php";
include_once ABSPATH . "wp-admin/includes/class-wp-filesystem-direct.php";

class Brizy_Editor_Project extends Brizy_Admin_Serializable {

	const BRIZY_PROJECT = 'brizy-project';

	/**
	 * @var Brizy_Editor_Project
	 */
	static protected $instance = null;

	/**
	 * @var Brizy_Editor_API_Project
	 */
	protected $api_project;

	/**
	 * Signature of the plugin at the creation moment.
	 *
	 * @var string
	 */
	protected $creation_signature;

	/**
	 * Brizy_Editor_Project constructor.
	 *
	 * @param $api_project
	 */
	protected function __construct( $api_project ) {
		$this->api_project = $api_project;
	}

	public function convertToOptionValue() {
		return array(
			'api_project'        => $this->get_api_project()->serialize(),
			'creation_signature' => $this->creation_signature
		);
	}

	static public function createFromSerializedData( $data ) {
		$project                     = new self( Brizy_Editor_API_Project::createFromSerializedData( unserialize($data['api_project']) ) );
		$project->creation_signature = $data['creation_signature'];

		return $project;
	}


	/**
	 * @return Brizy_Editor_Project|mixed
	 * @throws Exception
	 */
	public static function get() {

		if ( isset( self::$instance ) ) {
			return self::$instance;
		}

		try {
			$brizy_editor_storage_common = Brizy_Editor_Storage_Common::instance();
			$project                     = $brizy_editor_storage_common->get( self::BRIZY_PROJECT );

			if ( is_array( $project ) ) {
				$project = self::createFromSerializedData( $project );
			} elseif($project instanceof self) {
				$project->save();
			}

			self::$instance = $project;

		} catch ( Brizy_Editor_Exceptions_NotFound $e ) {
			self::$instance = self::create();
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->exception( $e );
		}

		return self::$instance;
	}

	/**
	 * @param Brizy_Editor_API_Project|null $data
	 */
	public function updateProjectData( $data = null ) {

		Brizy_Logger::instance()->notice( 'Update project data', array( 'new_data' => $data ) );
		$this->api_project = $data;
		$this->save();
	}

	/**
	 * @param null $clone_from
	 * @param bool $is_local
	 *
	 * @return Brizy_Editor_Project
	 * @throws Brizy_Editor_API_Exceptions_Exception
	 * @throws Brizy_Editor_Exceptions_ServiceUnavailable
	 * @throws Brizy_Editor_Http_Exceptions_BadRequest
	 * @throws Brizy_Editor_Http_Exceptions_ResponseException
	 * @throws Brizy_Editor_Http_Exceptions_ResponseNotFound
	 * @throws Brizy_Editor_Http_Exceptions_ResponseUnauthorized
	 * @throws Exception
	 */
	private static function create( $clone_from = null, $is_local = true ) {

		$brizy_editor_user = Brizy_Editor_User::get();

		$api_project = $brizy_editor_user->create_project( $clone_from, $is_local );

		$project                     = new self( $api_project );
		$project->creation_signature = Brizy_Editor_Signature::get();
		$project->save();

		self::$instance = $project;

		return $project;
	}

	/**
	 * @return self
	 */
	public function save() {

		Brizy_Logger::instance()->notice( 'Save project', array( $this ) );

		$this->set_meta_key( 'worpdress_url', get_site_url() );
		$this->set_meta_key( 'worpdress_site_name', get_bloginfo( 'name' ) );
		$this->set_meta_key( 'worpdress_version', get_bloginfo( 'version' ) );
		$this->set_meta_key( 'worpdress_description', get_bloginfo( 'description' ) );

		$brizy_editor_storage_common = Brizy_Editor_Storage_Common::instance();
		$brizy_editor_storage_common->set( self::BRIZY_PROJECT, $this->convertToOptionValue() );

		return $this;
	}

	/**
	 * @return mixed
	 */
	public function get_id() {
		return $this->api_project->get_id();
	}


	/**
	 * @param $id
	 *
	 * @return $this
	 */
	public function set_id( $id ) {
		$this->api_project->set_id( $id );

		return $this;
	}

	/**
	 * @return array|mixed|object
	 */
	public function get_globals() {
		return $this->api_project->get_globals();
	}

	/**
	 * @param $globals
	 *
	 * @return $this
	 */
	public function set_globals( $globals ) {
		$this->api_project->set_globals( $globals );

		return $this;
	}

	public function set_globals_as_json( $globals ) {
		$this->api_project->set_globals_as_json( $globals );



		return $this;
	}

	/**
	 * @return Brizy_Editor_API_Project
	 */
	public function get_api_project() {
		return $this->api_project;
	}

	/**
	 * @return string
	 */
	public function get_template_slug() {
		return $this->get_api_project()->get_template_slug();
	}

	/**
	 * @return string
	 */
	public function get_template_version() {
		return $this->get_api_project()->get_template_version();
	}

	/**
	 * @param $version
	 *
	 * @return $this
	 */
	public function set_template_version( $version ) {
		$this->get_api_project()->set_template_version( $version );

		return $this;
	}

	public function set_meta_key( $key, $value ) {

		if ( is_null( $key ) ) {
			throw new InvalidArgumentException( 'Hte key parameter should not be null' );
		}

		$this->get_api_project()->set_meta_key( $key, $value );
	}
}