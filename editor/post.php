<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Editor_Post extends Brizy_Admin_Serializable {

	const BRIZY_POST = 'brizy-post';
	const BRIZY_POST_SIGNATURE_KEY = 'brizy-post-signature';
	const BRIZY_POST_HASH_KEY = 'brizy-post-hash';
	const BRIZY_POST_EDITOR_VERSION = 'brizy-post-editor-version';
	const BRIZY_POST_COMPILER_VERSION = 'brizy-post-compiler-version';

	static protected $instance = null;

	/**
	 * @var Brizy_Editor_API_Page
	 */
	protected $api_page;

	/**
	 * @var int
	 */
	protected $wp_post_id;

	/**
	 * @var WP_Post
	 */
	protected $wp_post;

	/**
	 * @var string
	 */
	protected $compiled_html;

	/**
	 * @var string
	 */
	protected $compiled_html_body;

	/**
	 * @var string
	 */
	protected $compiled_html_head;

	/**
	 * @var bool
	 */
	protected $needs_compile;

	/**
	 * Json for the editor.
	 *
	 * @var string
	 */
	protected $editor_data;

	/**
	 * @var string
	 */
	protected $uid;

	/**
	 * @var bool
	 */
	protected $uses_editor;

	/**
	 * @var string
	 */
	protected $editor_version;

	/**
	 * @var string
	 */
	protected $compiler_version;

	/**
	 * @var Brizy_Editor_CompiledHtml
	 */
	static private $compiled_page;

	/**
	 * Brizy_Editor_Post constructor.
	 *
	 * @param $wp_post_id
	 *
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public function __construct( $wp_post_id ) {

		self::checkIfPostTypeIsSupported( $wp_post_id );
		$this->wp_post_id = (int) $wp_post_id;

		if ( $this->wp_post_id ) {
			$this->wp_post = get_post( $this->wp_post_id );
		}

		// get the storage values
		$storage = $this->storage();
		//$storageData          = $storage->get_storage();
		$using_editor_old = $storage->get( Brizy_Editor_Constants::USES_BRIZY, false );
		$storage_post     = $storage->get( self::BRIZY_POST, false );

		// check for deprecated forms of posts
		if ( $storage_post instanceof self ) {
			$this->set_editor_data( $storage_post->editor_data );
			$this->set_needs_compile( true );
			$this->set_uses_editor( $using_editor_old );
			$this->save();
		} else if ( is_array( $storage_post ) ) {
			$this->loadStorageData( $storage_post );
		}

		// check if the old flag is set
		if ( ! is_null( $using_editor_old ) ) {
			$this->uses_editor = (bool) $using_editor_old;
			$storage->delete( Brizy_Editor_Constants::USES_BRIZY );
			$this->save();
		}

		if ( $this->uses_editor() ) {
			$this->create_uid();
		}

	}

	/**
	 * @param $apost
	 *
	 * @return Brizy_Editor_Post|null
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public static function get( $apost ) {

		$wp_post_id = $apost;
		if ( $apost instanceof WP_Post ) {
			$wp_post_id = $apost->ID;
		}

		if ( isset( self::$instance[ $wp_post_id ] ) ) {
			return self::$instance[ $wp_post_id ];
		}

		return self::$instance[ $wp_post_id ] = new self( $wp_post_id );

//		$wp_post_id = $apost;
//
//		if ( $apost instanceof WP_Post ) {
//			$wp_post_id = $apost->ID;
//		}
//
//		self::checkIfPostTypeIsSupported( $wp_post_id );
//
//		$brizy_editor_storage_post = Brizy_Editor_Storage_Post::instance( $wp_post_id );
//		$using_editor_old          = $brizy_editor_storage_post->get( Brizy_Editor_Constants::USES_BRIZY, false );
//		$post                      = $brizy_editor_storage_post->get( self::BRIZY_POST );
//
//		if ( is_array( $post ) ) {
//			$post = self::createFromSerializedData( $post );
//
//			if ( ! is_null( $using_editor_old ) ) {
//				$post->uses_editor = (bool) $using_editor_old;
//				$post->wp_post_id  = $wp_post_id;
//				$post->wp_post     = get_post( $wp_post_id );
//				$post->create_uid();
//				$brizy_editor_storage_post->delete( Brizy_Editor_Constants::USES_BRIZY );
//				$post->save();
//			}
//
//		} elseif ( $post instanceof self ) {
//			$post->uses_editor = (bool) $using_editor_old;
//			$post->wp_post_id  = $wp_post_id;
//			$post->wp_post     = get_post( $wp_post_id );
//			$post->create_uid();
//			$post->save();
//
//			return $post;
//		}
//
//		$post->wp_post_id = $wp_post_id;
//		$post->wp_post    = get_post( $wp_post_id );
//		$post->create_uid();
//
//		return $post;
	}


	/**
	 * @param $wp_post_id
	 *
	 * @throws Brizy_Editor_Exceptions_UnsupportedPostType
	 */
	private static function checkIfPostTypeIsSupported( $wp_post_id ) {
		$type = get_post_type( $wp_post_id );

		$supported_post_types   = brizy()->supported_post_types();
		$supported_post_types[] = 'revision';

		if ( ! in_array( $type, $supported_post_types ) ) {
			throw new Brizy_Editor_Exceptions_UnsupportedPostType(
				"Brizy editor doesn't support '{$type}' post type"
			);
		}
	}

	/**
	 * @return string
	 */
	public function serialize() {
		$get_object_vars = get_object_vars( $this );

		unset( $get_object_vars['wp_post_id'] );
		unset( $get_object_vars['wp_post'] );
		unset( $get_object_vars['api_page'] );
		unset( $get_object_vars['store_assets'] );
		unset( $get_object_vars['assets'] );

		return serialize( $get_object_vars );
	}

	/**
	 * @param $data
	 */
	public function unserialize( $data ) {
		parent::unserialize( $data ); // TODO: Change the autogenerated stub

		if ( $this->get_api_page() ) {
			$save_data = $this->get_api_page()->get_content();
			$this->set_editor_data( $save_data );
		}

		unset( $this->api_page );
	}

	public function convertToOptionValue() {
		return array(
			'compiled_html'                    => $this->get_compiled_html(),
			'compiled_html_body'               => $this->get_compiled_html_body(),
			'compiled_html_head'               => $this->get_compiled_html_head(),
			'needs_compile'                    => $this->needs_compile,
			'editor_version'                   => $this->editor_version,
			'compiler_version'                 => $this->compiler_version,
			'editor_data'                      => $this->editor_data,
			Brizy_Editor_Constants::USES_BRIZY => $this->uses_editor
		);
	}

	public function loadStorageData( $data ) {
		if ( isset( $data['compiled_html'] ) ) {
			$this->compiled_html = $data['compiled_html'];
		}

		if ( isset( $data['compiled_html_body'] ) ) {
			$this->compiled_html_body = $data['compiled_html_body'];
		}

		if ( isset( $data['compiled_html_head'] ) ) {
			$this->compiled_html_head = $data['compiled_html_head'];
		}

		$this->needs_compile = $data['needs_compile'];
		$this->set_editor_data( $data['editor_data'] );
		$this->editor_version   = isset( $data['editor_version'] ) ? $data['editor_version'] : null;
		$this->compiler_version = isset( $data['compiler_version'] ) ? $data['compiler_version'] : null;
		$this->uses_editor      = (bool) ( isset( $data[ Brizy_Editor_Constants::USES_BRIZY ] ) ? $data[ Brizy_Editor_Constants::USES_BRIZY ] : false );
	}

//	static public function createFromSerializedData( $data ) {
//		$post = new self( null );
//
//		if ( isset( $data['compiled_html'] ) ) {
//			$post->compiled_html = $data['compiled_html'];
//		}
//
//		if ( isset( $data['compiled_html_body'] ) ) {
//			$post->compiled_html_body = $data['compiled_html_body'];
//		}
//
//		if ( isset( $data['compiled_html_head'] ) ) {
//			$post->compiled_html_head = $data['compiled_html_head'];
//		}
//
//		$post->needs_compile = $data['needs_compile'];
//		$post->set_editor_data( $data['editor_data'] );
//		$post->editor_version   = isset( $data['editor_version'] ) ? $data['editor_version'] : BRIZY_EDITOR_VERSION;
//		$post->compiler_version = isset( $data['compiler_version'] ) ? $data['compiler_version'] : BRIZY_EDITOR_VERSION;
//		$post->uses_editor      = (bool) ( isset( $data[ Brizy_Editor_Constants::USES_BRIZY ] ) ? $data[ Brizy_Editor_Constants::USES_BRIZY ] : false );
//
//		return $post;
//	}


	/**
	 * @return Brizy_Editor_Post[]
	 * @throws Brizy_Editor_Exceptions_NotFound
	 * @throws Brizy_Editor_Exceptions_UnsupportedPostType
	 */
	public static function get_all_brizy_posts() {
		global $wpdb;
		$posts = $wpdb->get_results(
			$wpdb->prepare( "SELECT pm.*, p.post_type FROM {$wpdb->postmeta} pm 
									JOIN {$wpdb->posts} p ON p.ID=pm.post_id  
									WHERE pm.meta_key = %s ", Brizy_Editor_Storage_Post::META_KEY )
		);

		$result = array();
		foreach ( $posts as $p ) {
			if ( in_array( $p->post_type, brizy()->supported_post_types() ) ) {
				$result[] = Brizy_Editor_Post::get( $p->post_id );
			}
		}

		return $result;
	}

	/**
	 * @param $project
	 * @param $post
	 *
	 * @return Brizy_Editor_Post
	 * @throws Brizy_Editor_Exceptions_UnsupportedPostType
	 * @throws Exception
	 */
	public static function create( $project, $post ) {
		if ( ! in_array( ( $type = get_post_type( $post->ID ) ), brizy()->supported_post_types() ) ) {
			throw new Brizy_Editor_Exceptions_UnsupportedPostType(
				"Brizy editor doesn't support '$type' post type 2"
			);
		}
		Brizy_Logger::instance()->notice( 'Create post', array( $project, $post ) );

		$post = new self( $post->ID );

		return $post;
	}

	/**
	 * @return bool
	 */
	public function save() {

		try {
			$value = $this->convertToOptionValue();
			$this->storage()->set( self::BRIZY_POST, $value );
		} catch ( Exception $exception ) {
			Brizy_Logger::instance()->exception( $exception );

			return false;
		}
	}

	/**
	 * @return bool
	 * @throws Brizy_Editor_Exceptions_ServiceUnavailable
	 * @throws Exception
	 */
	public function compile_page() {

		Brizy_Logger::instance()->notice( 'Compile page', array( $this ) );

		$compiled_html = Brizy_Editor_User::get()->compile_page( Brizy_Editor_Project::get(), $this );

		$this->set_compiled_html( $compiled_html );

		$this->set_compiled_html_head( null );
		$this->set_compiled_html_body( null );

		$this->set_needs_compile( false );
		$this->set_compiler_version( BRIZY_EDITOR_VERSION );

		return true;
	}

	public function get_compiled_page( $project ) {

		if ( self::$compiled_page ) {
			return self::$compiled_page;
		}

		$brizy_editor_editor_editor = Brizy_Editor_Editor_Editor::get( $project, $this );
		$config                     = $brizy_editor_editor_editor->config();
		$asset_storage              = new Brizy_Editor_Asset_AssetProxyStorage( $project, $this, $config );
		$media_storage              = new Brizy_Editor_Asset_MediaProxyStorage( $project, $this, $config );

		$asset_processors   = array();
		$asset_processors[] = new Brizy_Editor_Asset_DomainProcessor();
		$asset_processors[] = new Brizy_Editor_Asset_AssetProxyProcessor( $asset_storage );
		$asset_processors[] = new Brizy_Editor_Asset_MediaAssetProcessor( $media_storage );

		$brizy_editor_compiled_html = new Brizy_Editor_CompiledHtml( $this->get_compiled_html() );

		$asset_processors = apply_filters( 'brizy_content_processors', $asset_processors, $project, $this );

		$brizy_editor_compiled_html->setProcessors( $asset_processors );

		return self::$compiled_page = $brizy_editor_compiled_html;
	}

	public function isCompiledWithCurrentVersion() {
		return $this->get_compiler_version() == BRIZY_EDITOR_VERSION;
	}

	/**
	 * @deprecated;
	 */
	public function get_api_page() {

		if ( isset( $this->api_page ) ) {
			return $this->api_page;
		}

		return null;
	}

	/**
	 * @return mixed
	 */
	public function get_id() {
		return $this->wp_post_id;
	}

	/**
	 * A unique id assigned when brizy is enabled for this post
	 *
	 * @return string
	 */
	public function create_uid() {

		if ( $this->uid ) {
			return $this->uid;
		}

		$this->uid = get_post_meta( $this->get_parent_id(), 'brizy_post_uid', true );

		if ( ! $this->uid ) {
			$this->uid = md5( $this->get_parent_id() . time() );
			update_post_meta( $this->get_parent_id(), 'brizy_post_uid', $this->uid );
		}

		return $this->uid;
	}

	/**
	 * @return string
	 */
	public function get_uid() {
		return $this->uid;
	}

	/**
	 * @return string
	 */
	public function get_editor_data() {

		if ( base64_encode( base64_decode( $this->editor_data, true ) ) === $this->editor_data ) {
			$base_64_decode = base64_decode( $this->editor_data, true );

			return $base_64_decode;
		}

		return $this->editor_data;
	}

	/**
	 * @param $content
	 *
	 * @return $this
	 */
	public function set_editor_data( $content ) {

		if ( base64_encode( base64_decode( $content, true ) ) === $content ) {
			$this->editor_data = $content;
		} else {
			$this->editor_data = base64_encode( $content );
		}

		return $this;
	}

	/**
	 * @return false|int|mixed
	 */
	public function get_parent_id() {
		$id = wp_is_post_revision( $this->get_id() );

		if ( ! $id ) {
			$id = $this->get_id();
		}

		return $id;
	}

	/**
	 * @return string
	 */
	public function get_compiled_html() {
		return $this->compiled_html;
	}

	/**
	 * @param string $compiled_html
	 *
	 * @return Brizy_Editor_Post
	 */
	public function set_compiled_html( $compiled_html ) {
		$this->compiled_html = $compiled_html;

		return $this;
	}

	/**
	 * @deprecated use get_compiled_html
	 * @return string
	 */
	public function get_compiled_html_body() {
		return $this->compiled_html_body;
	}

	/**
	 * @deprecated use get_compiled_html
	 * @return string
	 */
	public function get_compiled_html_head() {
		return $this->compiled_html_head;
	}

	/**
	 * @deprecated use set_compiled_html
	 *
	 * @param $html
	 *
	 * @return $this
	 */
	public function set_compiled_html_body( $html ) {
		$this->compiled_html_body = $html;

		return $this;
	}

	/**
	 * @deprecated use set_compiled_html
	 *
	 * @param $html
	 *
	 * @return $this
	 */
	public function set_compiled_html_head( $html ) {
		// remove all title and meta tags.
		$this->compiled_html_head = $html;

		return $this;
	}

	/**
	 * @return bool
	 */
	public function can_edit_posts() {
		return current_user_can( "edit_posts" );
	}

	/**
	 * @return $this
	 * @throws Brizy_Editor_Exceptions_AccessDenied
	 */
	public function enable_editor() {
		if ( ! $this->can_edit_posts() ) {
			throw new Brizy_Editor_Exceptions_AccessDenied( 'Current user cannot edit page' );
		}
		$this->uses_editor = true;

		return $this;
	}

	/**
	 *
	 */
	public function disable_editor() {
		$this->uses_editor = false;

		return $this;
	}

	/**
	 * @return Brizy_Editor_Storage_Post
	 */
	public function storage() {
		return Brizy_Editor_Storage_Post::instance( $this->wp_post_id );
	}

	/**
	 * @return array|null|WP_Post
	 */
	public function get_wp_post() {
		return $this->wp_post;
	}

	/**
	 * @return bool
	 */
	public function uses_editor() {
		return $this->uses_editor;
	}

	/**
	 * @return bool
	 */
	public function set_uses_editor( $val ) {
		$this->uses_editor = $val;

		return $this;
	}


	/**
	 * @return string
	 */
	public function edit_url() {
		return add_query_arg(
			array( Brizy_Editor_Constants::EDIT_KEY => '' ),
			get_permalink( $this->get_parent_id() )
		);
	}

	/**
	 * @param $v
	 *
	 * @return $this
	 */
	public function set_needs_compile( $v ) {
		$this->needs_compile = (bool) $v;

		return $this;
	}

	/**
	 * @return bool
	 */
	public function get_needs_compile() {
		return $this->needs_compile;
	}

	/**
	 * @param $text
	 * @param string $tags
	 * @param bool $invert
	 *
	 * @return null|string|string[]
	 */
	function strip_tags_content( $text, $tags = '', $invert = false ) {

		preg_match_all( '/<(.+?)[\s]*\/?[\s]*>/si', trim( $tags ), $tags );
		$tags = array_unique( $tags[1] );

		if ( is_array( $tags ) AND count( $tags ) > 0 ) {
			if ( $invert == false ) {
				return preg_replace( '@<(?!(?:' . implode( '|', $tags ) . ')\b)(\w+)\b.*?>(.*?</\1>)?@si', '', $text );
			} else {
				return preg_replace( '@<(' . implode( '|', $tags ) . ')\b.*?>(.*?</\1>)?@si', '', $text );
			}
		} elseif ( $invert == false ) {
			return preg_replace( '@<(\w+)\b.*?>.*?</\1>@si', '', $text );
		}

		return $text;
	}

	/**
	 * @return array
	 */
	public function get_templates() {
		$type = get_post_type( $this->get_id() );
		$list = array(
			array(
				'id'    => '',
				'title' => __( 'Default' )
			)
		);

		return apply_filters( "brizy:$type:templates", $list );
	}

	/**
	 * @param string $atemplate
	 *
	 * @return $this
	 */
	public function set_template( $atemplate ) {

		if ( $atemplate == '' ) {
			delete_post_meta( $this->get_id(), '_wp_page_template' );
		} else {
			update_post_meta( $this->get_id(), '_wp_page_template', $atemplate );
		}

		return $this;
	}

	/**
	 * @return mixed
	 */
	public function get_template() {
		return get_post_meta( $this->get_id(), '_wp_page_template', true );
	}

	/**
	 * @param string $editor_version
	 */
	public function set_editor_version( $editor_version ) {
		$this->editor_version = $editor_version;
		update_metadata( 'post', $this->wp_post_id, self::BRIZY_POST_EDITOR_VERSION, $editor_version );
	}

	/**
	 * @param string $compiler_version
	 */
	public function set_compiler_version( $compiler_version ) {
		$this->compiler_version = $compiler_version;
		update_metadata( 'post', $this->wp_post_id, self::BRIZY_POST_COMPILER_VERSION, $compiler_version );
	}

	/**
	 * @return string
	 */
	public function get_compiler_version() {
		return $this->compiler_version;
	}

	/**
	 * @return string
	 */
	public function get_editor_version() {
		return $this->editor_version;
	}
}

