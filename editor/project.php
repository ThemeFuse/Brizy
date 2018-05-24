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
	 * @var bool
	 */
	protected $store_assets = true;


	/**
	 * Brizy_Editor_Project constructor.
	 *
	 * @param $api_project
	 */
	protected function __construct( $api_project ) {
		$this->api_project = $api_project;
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
			self::$instance              = $brizy_editor_storage_common->get( self::BRIZY_PROJECT );
			//self::$instance->api_project = new Brizy_Editor_API_Project( self::$instance->api_project );
		} catch ( Brizy_Editor_Exceptions_NotFound $e ) {
			self::$instance = self::create();
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->exception( $e );
			$t = 0;
		}

		try {
			self::$instance->checkSignature();
		} catch ( Brizy_Editor_Exceptions_SignatureMismatch $e ) {
			Brizy_Logger::instance()->notice( "Project signature mismatch" );
			self::$instance = self::create( self::$instance->get_id() );
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->exception( $e );
			throw new Exception( 'Unable to check the signature.' );
		}

		return self::$instance;
	}

	public function updateProjectData( Brizy_Editor_API_Project $data = null ) {

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

		/*
		if ( $clone_from ) {

			$project_data = $project->get_api_project()->get_data();

			Brizy_Logger::instance()->notice( 'Clone all project data' );

			foreach ( $project_data['languages'] as $language ) {
				$pages = $language['pages'];

				Brizy_Logger::instance()->notice( 'New pages from cloned project', array( $pages ) );

				if ( is_array( $pages ) && count( $pages ) > 0 ) {

					// debug logs
					if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
						foreach ( (array) $pages as $aclone ) {
							Brizy_Logger::instance()->debug( sprintf( "Cloned page [%s] to page [%s]", $aclone['cloned_from'], $aclone['id'] ) );
						}
					}

					foreach ( (array) $pages as $page ) {
						// get wordpress post by old brizy hash

						$wp_post = Brizy_Editor_Post::get_post_by_foreign_hash( $page['cloned_from'] );

						if ( ! $wp_post ) {
							continue;
						}

						$old_page = Brizy_Editor_Post::get( $wp_post );
						$new_post = new Brizy_Editor_Post( new Brizy_Editor_API_Page( $page ), $wp_post->ID );

						$new_post->set_compiled_html_body( $old_page->get_compiled_html_body() );
						$new_post->set_compiled_html_head( $old_page->get_compiled_html_head() );

						update_post_meta( $wp_post->ID, Brizy_Editor_Post::BRIZY_POST_SIGNATURE_KEY, Brizy_Editor_Signature::get() );
						update_post_meta( $wp_post->ID, Brizy_Editor_Post::BRIZY_POST_HASH_KEY, $new_post->get_api_page()->get_id() );

						$new_post->save();
					}
				}
			}
		}
		*/


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
		$brizy_editor_storage_common->set( self::BRIZY_PROJECT, $this );

		return $this;
	}


	/**
	 * @throws Brizy_Editor_Exceptions_SignatureMismatch
	 */
	public function checkSignature() {
		if ( Brizy_Editor_Signature::get() != $this->creation_signature ) {
			throw new Brizy_Editor_Exceptions_SignatureMismatch( 'Clone project required.' );
		}
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
			'orderby'     => null,
			'numberposts' => - 1,
			'post_type'   => 'any',
			'post_status' => 'any',
			'meta_key'    => Brizy_Editor_Constants::BRIZY
		) );

		foreach ( (array) $posts as $post ) {

			if ( ! in_array( ( $type = get_post_type( $post->ID ) ), brizy()->supported_post_types() ) ) {
				continue;
			}

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

	public function set_meta_key( $key, $value ) {

		if ( is_null( $key ) ) {
			throw new InvalidArgumentException( 'Hte key parameter should not be null' );
		}

		$this->get_api_project()->set_meta_key( $key, $value );
	}

//	public function invalidateAssetsFor( $version ) {
//
//		Brizy_Logger::instance()->notice( 'Invalidate assets for version ' . $version, array( $version ) );
//
//		$dir_path = sprintf( rtrim( ABSPATH, DIRECTORY_SEPARATOR ) . Brizy_Config::BRIZY_WP_EDITOR_ASSET_PATH, $version );
//
//		Brizy_Logger::instance()->notice( 'Remove directory ' . $dir_path, array( $dir_path ) );
//
//		$fs = new WP_Filesystem_Direct( null );
//		$fs->rmdir( $dir_path, true );
//
//		return $this;
//	}

}