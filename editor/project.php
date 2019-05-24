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

	//---------------------------------------------------------------------------------------------------
	protected $id;
	protected $title;
	protected $globals;
	protected $name;
	protected $user;
	protected $template;
	protected $created;
	protected $updated;
	protected $languages;
	protected $pluginVersion;
	protected $editorVersion;
	protected $signature;
	protected $accounts;
	protected $license_key;
	protected $forms;
	protected $cloud_token;
	protected $cloud_project;
	protected $image_optimizer_settings;

	//---------------------------------------------------------------------------------------------------

	/**
	 * Brizy_Editor_Project constructor.
	 *
	 * @param WP_Post $post
	 */
	protected function __construct( WP_Post $post ) {
		$this->post    = $post;
		$this->storage = Brizy_Editor_Storage_Project::instance( $this->post->ID );
		$this->loadProjectData();
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
	public static function get( $apost = null ) {

		$wp_post_id = $apost;
		if ( $apost instanceof WP_Post ) {
			$wp_post_id = $apost->ID;
		}

		if ( ! $wp_post_id && isset( self::$instance[ $wp_post_id ] ) ) {
			return self::$instance[ $wp_post_id ];
		}

		try {
			$wp_post = null;
			if ( is_null( $wp_post_id ) ) {
				$wp_post = self::getPost();
			} else {
				$wp_post = get_post( $wp_post_id );
			}

			if ( self::$instance[ $wp_post->ID ] ) {
				return self::$instance[ $wp_post->ID ];
			}
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->exception( $e );
		}

		return self::$instance[ $wp_post->ID ] = new self( $wp_post );

		//		if ( isset( self::$instance ) ) {
//			return self::$instance;
//		}
//
//		try {
//
//			// check if the project post created
//			// if not then create the project pos
//			$post           = self::getPost();
//			$project        = new self( $post );
//			self::$instance = $project;
//
//		} catch ( Exception $e ) {
//			Brizy_Logger::instance()->exception( $e );
//		}
//
//		return self::$instance;
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
	 * @throws Exception
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
			'id'                       => md5( uniqid( 'Local project', true ) ),
			'title'                    => 'Brizy Project',
			'globals'                  => base64_encode( '{}' ),
			'name'                     => uniqid( 'Local project', true ),
			'user'                     => null,
			'template'                 => array( 'slug' => 'brizy' ),
			'created'                  => new DateTime(),
			'updated'                  => new DateTime(),
			'languages'                => array(),
			'pluginVersion'            => BRIZY_VERSION,
			'editorVersion'            => BRIZY_EDITOR_VERSION,
			'signature'                => Brizy_Editor_Signature::get(),
			'accounts'                 => array(),
			'forms'                    => array(),
			'brizy-license-key'        => null,
			'brizy-cloud-token'        => null,
			'brizy-cloud-project'      => null,
			'image-optimizer-settings' => array(),
		);


		$storage = Brizy_Editor_Storage_Project::instance( $post_id );
		$storage->loadStorage( $project_data );

		return $post_id;
	}

	/**
	 * @return array
	 */
	protected function getProjectData() {
		return array(
			'id'                       => $this->id,
			'title'                    => $this->title,
			'globals'                  => $this->globals,
			'name'                     => $this->name,
			'user'                     => $this->user,
			'template'                 => $this->template,
			'created'                  => $this->created,
			'updated'                  => $this->updated,
			'languages'                => $this->languages,
			'pluginVersion'            => $this->pluginVersion,
			'editorVersion'            => $this->editorVersion,
			'signature'                => $this->signature,
			'accounts'                 => $this->accounts,
			'forms'                    => $this->forms,
			'brizy-license-key'        => $this->license_key,
			'brizy-cloud-token'        => $this->cloud_token,
			'brizy-cloud-project'      => $this->cloud_project,
			'image-optimizer-settings' => $this->image_optimizer_settings,
		);
	}

	protected function loadProjectData() {
		$data = $this->storage->get_storage();

		$this->id                       = isset( $data['id'] ) ? $data['id'] : null;
		$this->title                    = isset( $data['title'] ) ? $data['title'] : null;
		$this->globals                  = isset( $data['globals'] ) ? $data['globals'] : null;
		$this->name                     = isset( $data['name'] ) ? $data['name'] : null;
		$this->user                     = isset( $data['user'] ) ? $data['user'] : null;
		$this->template                 = isset( $data['template'] ) ? $data['template'] : null;
		$this->created                  = isset( $data['created'] ) ? $data['created'] : null;
		$this->updated                  = isset( $data['updated'] ) ? $data['updated'] : null;
		$this->languages                = isset( $data['languages'] ) ? $data['languages'] : null;
		$this->pluginVersion            = isset( $data['pluginVersion'] ) ? $data['pluginVersion'] : null;
		$this->editorVersion            = isset( $data['editorVersion'] ) ? $data['editorVersion'] : null;
		$this->signature                = isset( $data['signature'] ) ? $data['signature'] : null;
		$this->accounts                 = isset( $data['accounts'] ) ? $data['accounts'] : null;
		$this->forms                    = isset( $data['forms'] ) ? $data['forms'] : null;
		$this->license_key              = isset( $data['brizy-license-key'] ) ? $data['brizy-license-key'] : null;
		$this->cloud_token              = isset( $data['brizy-cloud-token'] ) ? $data['brizy-cloud-token'] : null;
		$this->cloud_project            = isset( $data['brizy-cloud-project'] ) ? $data['brizy-cloud-project'] : null;
		$this->image_optimizer_settings = isset( $data['image-optimizer-settings'] ) ? $data['image-optimizer-settings'] : array();
	}

	/**
	 * This saves ony data.. it does not touch the wordpress post
	 *
	 * @return bool
	 */
	public function save() {

		try {
			$value = $this->getProjectData();
			$this->storage->loadStorage( $value );
		} catch ( Exception $exception ) {
			Brizy_Logger::instance()->exception( $exception );

			return false;
		}
	}

	public function auto_save_post() {
		try {
			$user_id                   = get_current_user_id();
			$post                      = $this->post;
			$postParentId              = $this->get_parent_id();
			$old_autosave              = wp_get_post_autosave( $postParentId, $user_id );
			$post_data                 = get_object_vars( $post );
			$post_data['post_content'] = md5( time() );
			$autosavePost              = null;

			if ( $old_autosave ) {
				$autosavePost = self::get( $old_autosave );
			}

			if ( $old_autosave ) {
				$new_autosave                = _wp_post_revision_data( $post_data, true );
				$new_autosave['ID']          = $old_autosave->ID;
				$new_autosave['post_author'] = $user_id;

				// If the new autosave has the same content as the post, delete the autosave.
				$autosave_is_different = false;

				foreach ( array_intersect( array_keys( $new_autosave ), array_keys( _wp_post_revision_fields( $post ) ) ) as $field ) {
					if ( normalize_whitespace( $new_autosave[ $field ] ) != normalize_whitespace( $post->$field ) ) {
						$autosave_is_different = true;
						break;
					}
				}

				if ( ! $autosave_is_different ) {
					wp_delete_post_revision( $old_autosave->ID );

					return new WP_Error( 'rest_autosave_no_changes',
						__( 'There is nothing to save. The autosave and the post content are the same.' ),
						array( 'status' => 400 ) );
				}

				/**
				 * This filter is documented in wp-admin/post.php.
				 */
				do_action( 'wp_creating_autosave', $new_autosave );

				// wp_update_post expects escaped array.
				wp_update_post( wp_slash( $new_autosave ) );

			} else {
				// Create the new autosave as a special post revision.
				$revId        = _wp_put_post_revision( $post_data, true );
				$autosavePost = self::get( $revId );
			}

			// @todo: copy data to autosave instance
			$data = $this->getProjectData();

			$autosavePost->setTitle( $data['title'] );
			$autosavePost->setGlobals( $data['globals'] );
			$autosavePost->setTemplate( $data['template'] );
			$autosavePost->setCreated( $data['created'] );
			$autosavePost->setUpdated( $data['updated'] );
			$autosavePost->setLanguages( $data['languages'] );
			$autosavePost->setPluginVersion( $data['pluginVersion'] );
			$autosavePost->setEditorVersion( $data['editorVersion'] );
			$autosavePost->setSignature( $data['signature'] );
			$autosavePost->setAccounts( $data['accounts'] );
			$autosavePost->setForms( $data['forms'] );
			$autosavePost->setLicenseKey( $data['brizy-license-key'] );
			$autosavePost->setCloudToken( $data['brizy-cloud-token'] );
			$autosavePost->setCloudProject( $data['brizy-cloud-project'] );
			$autosavePost->setImageOptimizerSettings( $data['image-optimizer-settings'] );

			$autosavePost->save();

		} catch ( Exception $exception ) {
			Brizy_Logger::instance()->exception( $exception );

			return false;
		}
	}

	/**
	 * Create revision
	 */
	public function save_wp_post() {

		$post_type        = $this->post->post_type;
		$post_type_object = get_post_type_object( $post_type );
		$can_publish      = current_user_can( $post_type_object->cap->publish_posts );
		$post_status      = $can_publish ? 'publish' : 'pending';

		$this->deleteOldAutoSaves();

		wp_update_post( array(
			'ID'           => $this->get_parent_id(),
			'post_status'  => $post_status,
			'post_content' => md5( time() )
		) );
	}

	/**
	 * @return bool
	 */
	private function deleteOldAutoSaves() {
		global $wpdb;
		$user_id      = get_current_user_id();
		$postParentId = $this->get_parent_id();

		$wpdb->query( $wpdb->prepare( "
										DELETE FROM {$wpdb->posts} 
										WHERE post_author = %d and 
											  post_parent = %d and 
											  post_type = 'revision' and 
											  post_name LIKE %s", $user_id, $postParentId, "{$postParentId}-autosave%" ) );

	}

	/**
	 * @return false|int|mixed
	 */
	public function get_parent_id() {
		$id = wp_is_post_revision( $this->post->ID );

		if ( ! $id ) {
			$id = $this->post->ID;
		}

		return $id;
	}

	/**
	 * @return mixed
	 */
	public function getTitle() {
		return $this->title;
	}

	/**
	 * @param mixed $title
	 */
	public function setTitle( $title ) {
		$this->title = $title;
	}

	/**
	 * @return mixed
	 */
	public function getName() {
		return $this->name;
	}

	/**
	 * @param mixed $name
	 */
	public function setName( $name ) {
		$this->name = $name;
	}

	/**
	 * @return mixed
	 */
	public function getUser() {
		return $this->user;
	}

	/**
	 * @param mixed $user
	 */
	public function setUser( $user ) {
		$this->user = $user;
	}

	/**
	 * @return mixed
	 */
	public function getTemplate() {
		return $this->template;
	}

	/**
	 * @param mixed $template
	 */
	public function setTemplate( $template ) {
		$this->template = $template;
	}

	/**
	 * @return mixed
	 */
	public function getCreated() {
		return $this->created;
	}

	/**
	 * @param mixed $created
	 */
	public function setCreated( $created ) {
		$this->created = $created;
	}

	/**
	 * @return mixed
	 */
	public function getUpdated() {
		return $this->updated;
	}

	/**
	 * @param mixed $updated
	 */
	public function setUpdated( $updated ) {
		$this->updated = $updated;
	}

	/**
	 * @return mixed
	 */
	public function getLanguages() {
		return $this->languages;
	}

	/**
	 * @param mixed $languages
	 */
	public function setLanguages( $languages ) {
		$this->languages = $languages;
	}

	/**
	 * @return mixed
	 */
	public function getPluginVersion() {
		return $this->pluginVersion;
	}

	/**
	 * @param mixed $pluginVersion
	 */
	public function setPluginVersion( $pluginVersion ) {
		$this->pluginVersion = $pluginVersion;
	}

	/**
	 * @return mixed
	 */
	public function getEditorVersion() {
		return $this->editorVersion;
	}

	/**
	 * @param mixed $editorVersion
	 */
	public function setEditorVersion( $editorVersion ) {
		$this->editorVersion = $editorVersion;
	}

	/**
	 * @return mixed
	 */
	public function getSignature() {
		return $this->signature;
	}

	/**
	 * @param mixed $signature
	 */
	public function setSignature( $signature ) {
		$this->signature = $signature;
	}

	/**
	 * @return mixed
	 */
	public function getAccounts() {
		return $this->accounts;
	}

	/**
	 * @param mixed $accounts
	 */
	public function setAccounts( $accounts ) {
		$this->accounts = $accounts;
	}

	/**
	 * @return mixed
	 */
	public function getLicenseKey() {
		return $this->license_key;
	}

	/**
	 * @param mixed $license_key
	 */
	public function setLicenseKey( $license_key ) {
		$this->license_key = $license_key;
	}

	/**
	 * @return mixed
	 */
	public function getForms() {
		return $this->forms;
	}

	/**
	 * @param mixed $forms
	 */
	public function setForms( $forms ) {
		$this->forms = $forms;
	}

	/**
	 * @return mixed
	 */
	public function getCloudToken() {
		return $this->cloud_token;
	}

	/**
	 * @param mixed $cloud_token
	 */
	public function setCloudToken( $cloud_token ) {
		$this->cloud_token = $cloud_token;
	}

	/**
	 * @return mixed
	 */
	public function getCloudProject() {
		return $this->cloud_project;
	}

	/**
	 * @param mixed $cloud_project
	 */
	public function setCloudProject( $cloud_project ) {
		$this->cloud_project = $cloud_project;
	}

	/**
	 * @return mixed
	 */
	public function getGlobals() {
		return $this->globals;
	}

	/**
	 * @return bool|string
	 */
	public function getGlobalsAsJson() {
		return base64_decode( $this->getGlobals() );
	}

	/**
	 * @return array|mixed|object
	 */
	public function getDecodedGlobals() {
		return json_decode( $this->getGlobalsAsJson() );
	}

	/**
	 * @param mixed $globals
	 *
	 * @return Brizy_Editor_Project
	 */
	public function setGlobals( $globals ) {
		$this->globals = $globals;

		return $this;
	}

	public function setGlobalsAsJson( $globals ) {
		$this->setGlobals( base64_encode( $globals ) );

		return $this;
	}

	/**
	 * @return mixed
	 */
	public function getId() {
		return $this->id;
	}


	/**
	 * @return mixed
	 */
	public function getTemplateSlug() {
		$template = $this->getTemplate();

		return $template['slug'];
	}

	/**
	 * @return mixed
	 */
	public function getImageOptimizerSettings() {
		return $this->image_optimizer_settings;
	}

	/**
	 * @param mixed $image_optimizer_settings
	 *
	 * @return Brizy_Editor_Project
	 */
	public function setImageOptimizerSettings( $image_optimizer_settings ) {
		$this->image_optimizer_settings = $image_optimizer_settings;

		return $this;
	}


	/**
	 * @param $key
	 * @param $value
	 *
	 * @return mixed
	 */
	public function setMetaValue( $key, $value ) {

		wp_raise_memory_limit( 'image' );

		if ( is_null( $key ) ) {
			throw new InvalidArgumentException( 'The key parameter should not be null' );
		}

		if ( $key == 'brizy-license-key' ) {
			$this->setLicenseKey( $value );
		}
		if ( $key == 'brizy-cloud-token' ) {
			$this->setCloudToken( $value );
		}
		if ( $key == 'brizy-cloud-project' ) {
			$this->setCloudProject( $value );
		}

		return $this->$key = $value;

	}


	/**
	 * @param $key
	 */
	public function removeMetaValue( $key ) {

		if ( is_null( $key ) ) {
			throw new InvalidArgumentException( 'The key parameter should not be null' );
		}

		if ( $key == 'brizy-license-key' ) {
			$this->setLicenseKey( null );
		}
		if ( $key == 'brizy-cloud-token' ) {
			$this->setCloudToken( null );
		}
		if ( $key == 'brizy-cloud-project' ) {
			$this->setCloudProject( null );
		}

		if ( isset( $this->$key ) ) {
			unset( $this->$key );
		}

	}


	/**
	 * @param $key
	 *
	 * @return |null
	 */
	public function getMetaValue( $key ) {

		if ( is_null( $key ) ) {
			throw new InvalidArgumentException( 'The key parameter should not be null' );
		}

		if ( $key == 'brizy-license-key' ) {
			return $this->getLicenseKey();
		}
		if ( $key == 'brizy-cloud-token' ) {
			return $this->getCloudToken();
		}
		if ( $key == 'brizy-cloud-project' ) {
			return $this->getCloudProject();
		}

		if ( isset( $this->$key ) ) {
			return $this->$key;
		}

		return null;
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

}