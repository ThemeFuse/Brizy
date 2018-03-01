<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

include_once ABSPATH . "wp-admin/includes/class-wp-filesystem-base.php";
include_once ABSPATH . "wp-admin/includes/class-wp-filesystem-direct.php";

class Brizy_Editor_Project {

	static private $instance = null;

	const BRIZY_PROJECT = 'brizy-project';

	/**
	 * @var Brizy_Editor_API_Project
	 */
	private $api_project;

	/**
	 * @var bool
	 */
	private $store_assets = true;

	/**
	 * @return Brizy_Editor_Project|mixed|null
	 * @throws Brizy_Editor_Exceptions_ServiceUnavailable
	 * @throws Exception
	 */
	public static function get() {

		if ( self::$instance ) {
			return self::$instance;
		}

		try {
			$brizy_editor_storage_common = Brizy_Editor_Storage_Common::instance();
			self::$instance              = $brizy_editor_storage_common->get( self::BRIZY_PROJECT );
		} catch ( Brizy_Editor_Exceptions_NotFound $e ) {
			self::$instance                   = Brizy_Editor_Project::create();
			$_SESSION['brizy_project_stored'] = true;
		}

		if ( self::$instance && ! isset( $_SESSION['brizy_project_stored'] ) ) {
			$api_project    = Brizy_Editor_User::get()->get_project( self::$instance->get_api_project() );
			self::$instance = new self( new Brizy_Editor_API_Project( $api_project ) );
			self::$instance->save();
			$_SESSION['brizy_project_stored'] = true;
		}

		return self::$instance;
	}

	/**
	 * @return Brizy_Editor_Project
	 * @throws Brizy_Editor_Exceptions_ServiceUnavailable
	 * @throws Exception
	 */
	public static function create() {
		$api_project = Brizy_Editor_User::get()->create_project();

		$project = new self( $api_project );
		$project->save();

		return $project;
	}

	/**
	 * Brizy_Editor_Project constructor.
	 *
	 * @param Brizy_Editor_API_Project $api_project
	 */
	public function __construct( $api_project ) {
		$this->api_project = $api_project;
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

		// when the globals is updated all pages needs to be compiled.
		// se will update the flag for all pages edited with brizy

		$posts = get_posts( array(
			'orderby' => null,
			'numberposts' => - 1,
			'post_type'=>'any',
			'post_status'=>'any',
			'meta_key'    => Brizy_Editor_Constants::BRIZY
		) );

		foreach ( (array) $posts as $post ) {

			if(!in_array( ( $type = get_post_type( $post->ID ) ), brizy()->supported_post_types() )) continue;

			$brizy_post = Brizy_Editor_Post::get( $post->ID );

			if ( $brizy_post->uses_editor() ) {
				$brizy_post->set_needs_compile( true );
				$brizy_post->save();
			}
		}

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

	public function get_asset_url() {
		return sprintf( Brizy_Config::BRIZY_S3_ASSET_URL, $this->get_template_slug(), $this->get_template_version() );
	}

	public function get_asset_path() {
		return sprintf( Brizy_Config::BRIZY_WP_EDITOR_ASSET_PATH, $this->get_template_version() );
	}

	public function set_meta_key( $key, $value ) {

		if ( is_null( $key ) ) {
			throw new InvalidArgumentException( 'Hte key parameter should not be null' );
		}

		$this->get_api_project()->set_meta_key( $key, $value );
	}

	public function invalidateAssetsFor( $version ) {

		$dir_path = sprintf( rtrim( ABSPATH, DIRECTORY_SEPARATOR ) . Brizy_Config::BRIZY_WP_EDITOR_ASSET_PATH, $version );

		$fs = new WP_Filesystem_Direct( null );
		$fs->rmdir( $dir_path, true );

		return $this;
	}

	/**
	 * @return bool
	 */
	public function isStoreAssets() {
		return $this->store_assets;
	}

	/**
	 * @param bool $store_assets
	 *
	 * @return Brizy_Editor_Project
	 */
	public function setStoreAssets( $store_assets ) {
		$this->store_assets = $store_assets;

		return $this;
	}

	/**
	 * @return self
	 */
	public function save() {

		$this->set_meta_key( 'worpdress_url', get_site_url() );
		$this->set_meta_key( 'worpdress_site_name', get_bloginfo( 'name' ) );
		$this->set_meta_key( 'worpdress_version', get_bloginfo( 'version' ) );
		$this->set_meta_key( 'worpdress_description', get_bloginfo( 'description' ) );

		$brizy_editor_storage_common = Brizy_Editor_Storage_Common::instance();
		$brizy_editor_storage_common->set( self::BRIZY_PROJECT, $this );

		return $this;
	}

}