<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

include_once ABSPATH . "wp-admin/includes/class-wp-filesystem-base.php";
include_once ABSPATH . "wp-admin/includes/class-wp-filesystem-direct.php";

class Brizy_Editor_Project implements Serializable {

	const BRIZY_PROJECT = 'brizy-project';

	/**
	 * @var Brizy_Editor_Project
	 */
	static protected $instance = null;

	/**
	 * @var Brizy_Editor_API_Project
	 */
	protected $api_project = null;

	/**
	 * @var WP_Post
	 */
	protected $post = null;

	/**
	 * @var Brizy_Editor_Storage_Abstract
	 */
	protected $storage = null;

	/**
	 * Brizy_Editor_Project constructor.
	 *
	 * @param WP_Post $post
	 */
	protected function __construct( WP_Post $post ) {
		$this->post    = $post;
		$this->storage = Brizy_Editor_Storage_Project::instance( $this->post->ID );
	}

	public function serialize() {
		$get_object_vars = get_object_vars( $this );

		return serialize( $get_object_vars );
	}

	public function unserialize( $data ) {

		$vars = unserialize( $data );

		foreach ( $vars as $prop => $value ) {
			$this->$prop = $value;
		}
	}

	static public function registerCustomPostType() {
		register_post_type( self::BRIZY_PROJECT,
			array(
				'public'              => false,
				'has_archive'         => false,
				'description'         => __( 'Brizy Project.' ),
				'publicly_queryable'  => false,
				'show_ui'             => false,
				'show_in_menu'        => false,
				'query_var'           => false,
				'hierarchical'        => false,
				'show_in_rest'        => false,
				'exclude_from_search' => true,
				'supports'            => array( 'title', 'revisions', 'page-attributes' )
			)
		);
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

			// check if the project post created
			// if not then create the project pos
			$post           = self::getPost();
			$project        = new self( $post );
			self::$instance = $project;

		} catch ( Exception $e ) {
			Brizy_Logger::instance()->exception( $e );
		}

		return self::$instance;
	}

	/**
	 * @return false|null|WP_Post
	 */
	static private function getPost() {
		global $wpdb;

		$row = $wpdb->get_results(
			$wpdb->prepare( "SELECT * FROM {$wpdb->posts} p
									WHERE p.post_type = %s and p.post_status='publish' 
									ORDER BY ID DESC LIMIT 1 ", self::BRIZY_PROJECT ),
			OBJECT
		);

		if ( isset( $row[0] ) ) {
			return WP_Post::get_instance( $row[0]->ID );
		}

		$post_id = self::createPost();

		return WP_Post::get_instance( $post_id );
	}

	/**
	 * @return int|WP_Error
	 */
	private static function createPost() {
		$post_id = wp_insert_post( array(
			'post_type'      => self::BRIZY_PROJECT,
			'post_title'     => 'Brizy Project',
			'post_status'    => 'publish',
			'comment_status' => 'closed',
			'ping_status'    => 'closed'
		) );

		Brizy_Logger::instance()->notice( 'Create new project', array( 'id' => $post_id ) );

		$project_data = array(
			'id'            => md5( uniqid( 'Local project', true ) ),
			'title'         => 'Brizy Project',
			'globals'       => base64_encode( '{"project":{},"language":{}}' ),
			'name'          => uniqid( 'Local project', true ),
			'user'          => null,
			'template'      => array( 'slug' => 'brizy' ),
			'created'       => new DateTime(),
			'updated'       => new DateTime(),
			'languages'     => array(),
			'pluginVersion' => BRIZY_VERSION,
			'editorVersion' => BRIZY_EDITOR_VERSION,
			'signature'     => Brizy_Editor_Signature::get(),
		);


		$storage = Brizy_Editor_Storage_Project::instance( $post_id );
		$storage->loadStorage( $project_data );

		return $post_id;
	}

	/**
	 * @return mixed
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public function getId() {
		return $this->getMetaValue( 'id' );
	}

	/**
	 * @return mixed
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public function getGlobals() {
		return json_decode( base64_decode( $this->getMetaValue( 'globals' ) ) );
	}

	/**
	 * @param $globals
	 *
	 * @return $this
	 */
	public function setGlobals( $globals ) {
		$this->setGlobalsAsJson( json_encode( $globals ) );

		return $this;
	}

	/**
	 * @param $globals
	 *
	 * @return $this
	 */
	public function setGlobalsAsJson( $globals ) {
		$this->setMetaValue( 'globals', base64_encode( $globals ) );

		return $this;
	}

	/**
	 * @return bool|string
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public function getGlobalsAsJson() {
		return base64_decode( $this->getMetaValue( 'globals' ) );
	}


	/**
	 * @return mixed
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public function getTemplateSlug() {
		$template = $this->getMetaValue( 'template' );

		return $template['slug'];
	}

	/**
	 * @param $key
	 * @param $value
	 */
	public function setMetaValue( $key, $value ) {

		if ( is_null( $key ) ) {
			throw new InvalidArgumentException( 'The key parameter should not be null' );
		}

		$this->storage->set( $key, $value );

		// create project revision
		// md5 it to make sure no one will use this data-- we need it only to make the revision
		$this->post->post_content = md5( serialize( $this->storage->get_storage() ) );
		wp_update_post( $this->post );
	}


	/**
	 * @param $key
	 */
	public function removeMetaValue( $key ) {

		if ( is_null( $key ) ) {
			throw new InvalidArgumentException( 'The key parameter should not be null' );
		}

		$this->storage->delete( $key );

		// create project revision
		// md5 it to make sure no one will use this data-- we need it only to make the revision
		$this->post->post_content = md5( serialize( $this->storage->get_storage() ) );
		wp_update_post( $this->post );
	}


	/**
	 * @param $key
	 *
	 * @return mixed
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public function getMetaValue( $key ) {

		if ( is_null( $key ) ) {
			throw new InvalidArgumentException( 'The key parameter should not be null' );
		}

		return $this->storage->get( $key, false );
	}

	/**
	 * @return Brizy_Editor_API_Project
	 */
	public function getApiProject() {
		return $this->api_project;
	}

	/**
	 * @return WP_Post
	 */
	public function getWpPost() {
		return $this->post;
	}

// =======================================================================================================================================
// =======================================================================================================================================
// =======================================================================================================================================
// =======================================================================================================================================
// =======================================================================================================================================
// =======================================================================================================================================
// =======================================================================================================================================
// =======================================================================================================================================
// =======================================================================================================================================
// =======================================================================================================================================
// =======================================================================================================================================


//	protected function __construct( $api_project ) {
//		$this->api_project = $api_project;
//	}

//	public function convertToOptionValue() {
//		return array(
//			'api_project'        => $this->get_api_project()->serialize(),
//			'creation_signature' => $this->creation_signature
//		);
//	}

//	static public function createFromSerializedData( $data ) {
//		$project                     = new self( Brizy_Editor_API_Project::createFromSerializedData( unserialize( $data['api_project'] ) ) );
//		$project->creation_signature = $data['creation_signature'];
//
//		return $project;
//	}


//	/**
//	 * @param Brizy_Editor_API_Project|null $data
//	 */
//	public function updateProjectData( $data = null ) {
//
//		Brizy_Logger::instance()->notice( 'Update project data', array( 'new_data' => $data ) );
//		$this->api_project = $data;
//		$this->save();
//	}

//	/**
//	 * @param null $clone_from
//	 * @param bool $is_local
//	 *
//	 * @return Brizy_Editor_Project
//	 * @throws Brizy_Editor_API_Exceptions_Exception
//	 * @throws Brizy_Editor_Exceptions_ServiceUnavailable
//	 * @throws Brizy_Editor_Http_Exceptions_BadRequest
//	 * @throws Brizy_Editor_Http_Exceptions_ResponseException
//	 * @throws Brizy_Editor_Http_Exceptions_ResponseNotFound
//	 * @throws Brizy_Editor_Http_Exceptions_ResponseUnauthorized
//	 * @throws Exception
//	 */
//	private static function create( $clone_from = null, $is_local = true ) {
//
//		$brizy_editor_user = Brizy_Editor_User::get();
//
//		$api_project = $brizy_editor_user->create_project( $clone_from, $is_local );
//
//		$project                     = new self( $api_project );
//		$project->creation_signature = Brizy_Editor_Signature::get();
//		$project->save();
//
//		self::$instance = $project;
//
//		return $project;
//	}

//	/**
//	 * @return self
//	 */
//	public function save() {
//
//		Brizy_Logger::instance()->notice( 'Save project', array( $this ) );
//
//		$this->set_meta_key( 'worpdress_url', get_site_url() );
//		$this->set_meta_key( 'worpdress_site_name', get_bloginfo( 'name' ) );
//		$this->set_meta_key( 'worpdress_version', get_bloginfo( 'version' ) );
//		$this->set_meta_key( 'worpdress_description', get_bloginfo( 'description' ) );
//
//		$brizy_editor_storage_common = Brizy_Editor_Storage_Common::instance();
//		$brizy_editor_storage_common->set( self::BRIZY_PROJECT, $this->convertToOptionValue() );
//
//		return $this;
//	}

//	/**
//	 * @param $id
//	 *
//	 * @return $this
//	 */
//	public function set_id( $id ) {
//		$this->api_project->set_id( $id );
//
//		return $this;
//	}

//	/**
//	 * @param $globals
//	 *
//	 * @return $this
//	 */
//	public function set_globals( $globals ) {
//		$this->api_project->set_globals( $globals );
//
//		return $this;
//	}


//	/**
//	 * @return Brizy_Editor_API_Project
//	 */
//	public function get_api_project() {
//		return $this->api_project;
//	}

//	/**
//	 * @return string
//	 */
//	public function get_template_version() {
//		return $this->get_api_project()->get_template_version();
//	}

//	/**
//	 * @param $version
//	 *
//	 * @return $this
//	 */
//	public function set_template_version( $version ) {
//		$this->get_api_project()->set_template_version( $version );
//
//		return $this;
//	}

}