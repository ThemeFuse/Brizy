<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

include_once ABSPATH . "wp-admin/includes/class-wp-filesystem-base.php";
include_once ABSPATH . "wp-admin/includes/class-wp-filesystem-direct.php";

class Brizy_Editor_Project extends Brizy_Editor_Entity {

	use Brizy_Editor_AutoSaveAware;


	const BRIZY_PROJECT = 'brizy-project';

	/**
	 * @var Brizy_Editor_Project
	 */
	static protected $instance = null;

	/**
	 * @var Brizy_Editor_API_Project
	 */
	protected $api_project = null;

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
	protected $cloud_account_id;
	protected $cloud_token;
	protected $cloudContainer;
	protected $cloud_project;
	protected $image_optimizer_settings;
	protected $data;
	//---------------------------------------------------------------------------------------------------
	protected $isDataChanged = false;
	//---------------------------------------------------------------------------------------------------

	/**
	 * Brizy_Editor_Project constructor.
	 *
	 * @param WP_Post $post
	 *
	 * @throws Exception
	 */
	public function __construct( WP_Post $post ) {
		$this->setWpPostId( $post->ID );
		$this->loadInstanceData();
	}

	protected function getObjectKey() {
		return self::BRIZY_PROJECT;
	}

	protected function loadInstanceData() {
		$this->loadProjectData( $this->getStorage()->get_storage() );
	}

	protected function populateAutoSavedData( $autosave ) {
		$autosave->loadProjectData( $this->convertToOptionValue() );
	}

	public function getStorage() {
		return Brizy_Editor_Storage_Project::instance( $this->getWpPostId() );
	}

	public static function cleanClassCache() {
		self::$instance = array();
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
	 * @param null $postId
	 * @param null $uid
	 *
	 * @return Brizy_Editor_Project|null
	 * @throws Exception
	 */
	public static function get( $postId = null, $uid = null ) {

		if ( self::$instance ) {
			return self::$instance;
		}

		try {
			$wp_post = self::getPost();
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->exception( $e );
			throw $e;
		}

		return self::$instance = new self( $wp_post );
	}

	/**
	 * @return false|WP_Post
	 * @throws Exception
	 */
	static protected function getPost() {
		global $wpdb;

		$row = $wpdb->get_results(
			$wpdb->prepare( "SELECT * FROM {$wpdb->posts} p
									WHERE p.post_type = %s and p.post_status='publish' 
									ORDER BY ID DESC LIMIT 1 ", self::BRIZY_PROJECT ),
			OBJECT
		);

		if ( is_null( $row ) ) {
			Brizy_Logger::instance()->critical( 'Failed to check if the project exist.', [] );
			throw new Exception( 'Failed to check if the project exist.' );
		}

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

		global $wpdb;
		$defaultJsonPath = Brizy_Editor_UrlBuilder::editor_build_path( 'defaults.json' );

		if ( ! file_exists( $defaultJsonPath ) ) {
			$message = 'Failed to create the default project data. ' . $defaultJsonPath . ' was not found. ';
			Brizy_Logger::instance()->critical( $message, [ $message ] );
			throw new Exception( $message );
		}

		$project_data = array(
			'id'                     => md5( uniqid( 'Local project', true ) ),
			'title'                  => 'Brizy Project',
			'name'                   => uniqid( 'Local project', true ),
			'user'                   => null,
			'template'               => array( 'slug' => 'brizy' ),
			'created'                => new DateTime(),
			'updated'                => new DateTime(),
			'languages'              => array(),
			'pluginVersion'          => BRIZY_VERSION,
			'editorVersion'          => BRIZY_EDITOR_VERSION,
			'signature'              => Brizy_Editor_Signature::get(),
			'accounts'               => array(),
			'forms'                  => array(),
			'data'                   => base64_encode( file_get_contents( $defaultJsonPath ) ),
			'cloudContainer'         => null,
			'brizy-license-key'      => null,
			'brizy-cloud-token'      => null,
			'brizy-cloud-account-id' => null,

			'brizy-cloud-project'      => null,
			'image-optimizer-settings' => array(),
		);

		try {
			$wpdb->query( 'START TRANSACTION' );
			$wpdb->insert( $wpdb->posts, [
				'post_type'      => self::BRIZY_PROJECT,
				'post_title'     => 'Brizy Project',
				'post_status'    => 'publish',
				'comment_status' => 'closed',
				'ping_status'    => 'closed',
				'post_author'    => 0,
				'post_content'   => '',
				'post_excerpt'   => '',
				'post_password'  => '',
				'to_ping'        => '',
				'pinged'         => '',
				'post_parent'    => 0,
				'menu_order'     => 0,
				'guid'           => '',
				'post_date'      => current_time( 'mysql' ),
				'post_date_gmt'  => current_time( 'mysql', 1 ),
			] );
			$post_id = $wpdb->insert_id;

			$storage = Brizy_Editor_Storage_Project::instance( $post_id );
			$storage->loadStorage( $project_data );

			$wpdb->query( 'COMMIT' );

			Brizy_Logger::instance()->notice( 'Create new project', array( 'id' => $post_id ) );

			return $post_id;
		} catch ( Exception $e ) {
			$wpdb->query( 'ROLLBACK' );
			throw $e;
		}
	}

	/**
	 * This will be returned by api when project is requested
	 */
	public function createResponse( $fields = array() ) {
		$data = array(
			'id'          => $this->getId(),
			'data'        => $this->getDataAsJson(),
			'dataVersion' => $this->getCurrentDataVersion()
		);

		return $data;
	}


	/**
	 * @return array
	 */
	public function convertToOptionValue() {
		return array(
			'id'                       => $this->id,
			'title'                    => $this->title,
			'name'                     => $this->name,
			'user'                     => $this->user,
			'template'                 => $this->template,
			'created'                  => $this->created,
			'updated'                  => $this->updated,
			//'languages'                => $this->languages,
			'pluginVersion'            => $this->pluginVersion,
			'editorVersion'            => $this->editorVersion,
			'signature'                => $this->signature,
			'accounts'                 => $this->accounts,
			'forms'                    => $this->forms,
			'data'                     => $this->data,
			'brizy-license-key'        => $this->license_key,
			'brizy-cloud-token'        => $this->cloud_token,
			'brizy-cloud-project'      => $this->cloud_project,
			'brizy-cloud-account-id'   => $this->cloud_account_id,
			'cloudContainer'           => $this->cloudContainer,
			'image-optimizer-settings' => $this->image_optimizer_settings,
		);
	}

	protected function loadProjectData( $data ) {
		$this->id                       = isset( $data['id'] ) ? $data['id'] : null;
		$this->title                    = isset( $data['title'] ) ? $data['title'] : null;
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
		$this->data                     = isset( $data['data'] ) ? $data['data'] : null;
		$this->license_key              = isset( $data['brizy-license-key'] ) ? $data['brizy-license-key'] : null;
		$this->cloud_token              = isset( $data['brizy-cloud-token'] ) ? $data['brizy-cloud-token'] : null;
		$this->cloud_project            = isset( $data['brizy-cloud-project'] ) ? $data['brizy-cloud-project'] : null;
		$this->cloud_account_id         = isset( $data['brizy-cloud-account-id'] ) ? $data['brizy-cloud-account-id'] : null;
		$this->cloudContainer           = isset( $data['cloudContainer'] ) ? $data['cloudContainer'] : null;
		$this->image_optimizer_settings = isset( $data['image-optimizer-settings'] ) ? $data['image-optimizer-settings'] : array();
	}

	/**
	 * This saves ony data.. it does not touch the wordpress post
	 *
	 * @return bool
	 */
	public function save( $autosave = 0 ) {

		parent::save( $autosave );

		if ( ! $this->isDataChanged ) {
			return;
		}

		if ( $autosave == 0 ) {
			$this->saveStorage();
		} else {
			$this->auto_save_post( $this->getWpPost(), function ( self $autoSaveObject ) {
				$this->populateAutoSavedData( $autoSaveObject );
				$autoSaveObject->saveStorage();
			} );
		}
	}

	public function saveStorage() {
		$value = $this->convertToOptionValue();
		$this->getStorage()->loadStorage( $value );
	}

	/**
	 * Create revision
	 */
	public function savePost() {

		if ( ! $this->isDataChanged ) {
			return;
		}

		$post_type        = $this->getWpPost()->post_type;
		$post_type_object = get_post_type_object( $post_type );
		$can_publish      = current_user_can( $post_type_object->cap->publish_posts );
		$post_status      = $can_publish ? 'publish' : 'pending';

		$this->deleteOldAutoSaves( $this->getWpPostParentId() );

		wp_update_post( array(
			'ID'           => $this->getWpPostId(),
			'post_status'  => $post_status,
			'post_content' => md5( time() )
		) );
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
	public function getCloudContainer() {
		return $this->cloudContainer;
	}

	/**
	 * @param mixed $cloudContainer
	 *
	 * @return Brizy_Editor_Project
	 */
	public function setCloudContainer( $cloudContainer ) {
		$this->cloudContainer = $cloudContainer;

		return $this;
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
	public function getCloudAccountId() {
		return $this->cloud_account_id;
	}

	/**
	 * @param mixed $cloud_account_id
	 *
	 * @return Brizy_Editor_Project
	 */
	public function setCloudAccountId( $cloud_account_id ) {
		$this->cloud_account_id = $cloud_account_id;

		return $this;
	}

	//====================================================================================================================================================================================

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
//====================================================================================================================================================================================

	/**
	 * @return mixed
	 */
	public function getData() {
		return $this->data;
	}

	/**
	 * @param mixed $data
	 *
	 *
	 * @return Brizy_Editor_Project
	 */
	public function setData( $data ) {

		$this->isDataChanged = $data !== $this->data;
		$this->data          = $data;

		return $this;
	}

	public function setDataAsJson( $data ) {
		$encodedData = base64_encode( $data );

		if ( $encodedData === false ) {
			throw new Exception( 'Failed to base64 encode the project data' );
		}

		$this->setData( $encodedData );

		return $this;
	}

	public function getDataAsJson() {
		return base64_decode( $this->getData() );
	}

	/**
	 * @return bool|string
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public function getDecodedData() {
		return json_decode( $this->getDataAsJson() );
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
	 * @param null $optimizer_id
	 * @param null $key
	 *
	 * @return array|null
	 */
	public function getImageOptimizerSettings( $optimizer_id = null, $key = null ) {

		if ( $optimizer_id && $key ) {
			return isset( $this->image_optimizer_settings[ $optimizer_id ][ $key ] ) ? $this->image_optimizer_settings[ $optimizer_id ][ $key ] : null;
		}

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
		if ( $key == 'brizy-cloud-account-id' ) {
			$this->setCloudAccountId( $value );
		}
		if ( $key == 'brizy-cloud-project' ) {
			$this->setCloudProject( $value );
		}

		if ( $key == 'brizy-cloud-container' ) {
			$this->setCloudContainer( $value );
		}

		if ( $key == 'image-optimizer-settings' ) {
			$this->setImageOptimizerSettings( $value );
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
		if ( $key == 'brizy-cloud-account-id' ) {
			$this->setCloudAccountId( null );
		}
		if ( $key == 'brizy-cloud-token' ) {
			$this->setCloudToken( null );
		}
		if ( $key == 'brizy-cloud-project' ) {
			$this->setCloudProject( null );
		}
		if ( $key == 'image-optimizer-settings' ) {
			$this->setImageOptimizerSettings( null );
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

		if ( $key == 'brizy-cloud-account-id' ) {
			$this->getCloudAccountId();
		}

		if ( $key == 'brizy-cloud-token' ) {
			return $this->getCloudToken();
		}
		if ( $key == 'brizy-cloud-project' ) {
			return $this->getCloudProject();
		}
		if ( $key == 'image-optimizer-settings' ) {
			return $this->getImageOptimizerSettings();
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


}