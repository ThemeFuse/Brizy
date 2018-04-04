<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Editor_Post extends Brizy_Admin_Serializable {

	const BRIZY_POST = 'brizy-post';

	const BRIZY_POST_SIGNATURE_KEY = 'brizy-post-signature';
	const BRIZY_POST_HASH_KEY = 'brizy-post-hash';


	/**
	 * @var Brizy_Editor_API_Page
	 */
	protected $api_page;

	/**
	 * @var int
	 */
	protected $wp_post_id;

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
	 * @var bool
	 */
	protected $store_assets;

	/**
	 * @var array
	 */
	protected $assets = array();

	/**
	 * @return string
	 */
	public function serialize() {
		$get_object_vars = get_object_vars( $this );

		unset( $get_object_vars['wp_post_id'] );

		return serialize( $get_object_vars );
	}

	/**
	 * @param $apost
	 *
	 * @return Brizy_Editor_Post
	 * @throws Brizy_Editor_Exceptions_NotFound
	 * @throws Brizy_Editor_Exceptions_UnsupportedPostType
	 */
	public static function get( $apost ) {

		$wp_post_id = $apost;

		if ( $apost instanceof WP_Post ) {
			$wp_post_id = $apost->ID;
		}

		if ( ! in_array( ( $type = get_post_type( $wp_post_id ) ), brizy()->supported_post_types() ) ) {
			throw new Brizy_Editor_Exceptions_UnsupportedPostType(
				"Brizy editor doesn't support '{$type}' post type"
			);
		}

		$brizy_editor_storage_post = Brizy_Editor_Storage_Post::instance( $wp_post_id );

		$post = $brizy_editor_storage_post->get( self::BRIZY_POST );

		$post->wp_post_id = $wp_post_id;

		return $post;
	}

	/**
	 * @param $project
	 * @param $post
	 *
	 * @return Brizy_Editor_Post
	 * @throws Brizy_Editor_Exceptions_ServiceUnavailable
	 * @throws Brizy_Editor_Exceptions_UnsupportedPostType
	 * @throws Exception
	 */
	public static function create( $project, $post ) {
		if ( ! in_array( ( $type = get_post_type( $post->ID ) ), brizy()->supported_post_types() ) ) {
			throw new Brizy_Editor_Exceptions_UnsupportedPostType(
				"Brizy editor doesn't support '$type' post type"
			);
		}

		$api_page_obj = Brizy_Editor_API_Page::get()->set_title( $post->post_title );

		$api_page = Brizy_Editor_User::get()->create_page( $project, $api_page_obj );

		$post = new self( $api_page, $post->ID );

		return $post;
	}

	/**
	 * @return bool
	 */
	public function save() {

		try {
			// store the signature only once
			if ( ! ( $signature = get_post_meta( $this->wp_post_id, self::BRIZY_POST_SIGNATURE_KEY, true ) ) ) {
				update_post_meta( $this->wp_post_id, self::BRIZY_POST_SIGNATURE_KEY, Brizy_Editor_Signature::get() );
				update_post_meta( $this->wp_post_id, self::BRIZY_POST_HASH_KEY, $this->get_api_page()->get_id() );
			}

			$this->storage()->set( self::BRIZY_POST, $this );
			$project = Brizy_Editor_Project::get();

			$brizy_editor_user = Brizy_Editor_User::get();
			$api_project       = $project->get_api_project();
			$brizy_editor_user->update_page( $api_project, $this->api_page );

		} catch ( Exception $exception ) {
			return false;
		}
	}

	/**
	 * Brizy_Editor_Post constructor.
	 *
	 * @param $api_page
	 * @param $wp_post_id
	 */
	public function __construct( $api_page, $wp_post_id ) {
		$this->api_page   = $api_page;
		$this->wp_post_id = (int) $wp_post_id;
	}

	/**
	 * @return mixed
	 */
	public function get_id() {
		return $this->wp_post_id;
	}

	public function get_compiled_html_body() {
		return $this->compiled_html_body;
	}

	public function get_compiled_html_head() {
		return $this->compiled_html_head;
	}

	public function set_compiled_html_body( $html ) {
		$this->compiled_html_body = $html;

		return $this;
	}

	public function set_compiled_html_head( $html ) {
		// remove all title and meta tags.
		$this->compiled_html_head = $this->strip_tags_content( $html, '<title><meta>', true );

		return $this;
	}

	public function get_title() {
		return $this->api_page->get_title();
	}

	public function set_title( $title ) {
		$this->api_page->set_title( $title );

		return $this;
	}

	public function set_is_index( $index ) {
		$this->api_page->set_is_index( $index );

		return $this;
	}

	public function is_index() {
		return $this->api_page->is_index();
	}

	/**
	 * @return bool
	 */
	public function can_edit() {
		return current_user_can( 'edit_pages' );
	}

	/**
	 * @return $this
	 * @throws Brizy_Editor_Exceptions_AccessDenied
	 */
	public function enable_editor() {
		if ( ! $this->can_edit() ) {
			throw new Brizy_Editor_Exceptions_AccessDenied( 'Current user cannot edit page' );
		}

		$this->storage()->set( Brizy_Editor_Constants::USES_BRIZY, 1 );

		return $this;
	}

	/**
	 * @return $this
	 * @throws Brizy_Editor_Exceptions_AccessDenied
	 */
	public function disable_editor() {
		if ( ! $this->can_edit() ) {
			throw new Brizy_Editor_Exceptions_AccessDenied( 'Current user cannot edit page' );
		}

		$this->storage()->delete( Brizy_Editor_Constants::USES_BRIZY );

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
		return get_post( $this->get_id() );
	}


	/**
	 * @return bool
	 */
	public function uses_editor() {

		try {
			return (bool) $this->storage()->get( Brizy_Editor_Constants::USES_BRIZY );
		} catch ( Exception $exception ) {
			return false;
		}
	}


	/**
	 * @return string
	 */
	public function edit_url() {
		return add_query_arg(
			array( Brizy_Editor_Constants::EDIT_KEY => '' ),
			get_permalink( $this->get_id() )
		);
	}

	/**
	 * @return string
	 */
	public function edit_url_iframe() {
		return add_query_arg(
			array( Brizy_Editor_Constants::EDIT_KEY_IFRAME => '' ),
			get_permalink( $this->get_id() )
		);
	}

	/**
	 * @return Brizy_Editor_API_Page
	 */
	public function get_api_page() {
		return $this->api_page;
	}

	/**
	 * @return int
	 */
	public function get_content() {

		return $this->api_page->get_content();
	}

	/**
	 * @param $data
	 *
	 * @return $this
	 */
	public function set_content( $data ) {

		$this->api_page->set_content( $data );

		return $this;
	}


	/**
	 * @return bool
	 * @throws Brizy_Editor_Exceptions_ServiceUnavailable
	 * @throws Exception
	 */
	public function compile_page() {

		// $html_document = file_get_contents( '/home/alex/Projects/bitblox_compiler/test-page/index.html' );
		// $compiled_html = new Brizy_Editor_CompiledHtml( $html_document );

		$compiled_html = Brizy_Editor_User::get()->compile_page( Brizy_Editor_Project::get(), $this );

		$this->set_compiled_html_head( $compiled_html->get_head() );
		$this->set_compiled_html_body( $compiled_html->get_body() );

		$this->invalidate_assets();

		$this->setStoreAssets( true );

		return true;
	}


	public function store_asset( $asset_source, $asset_path ) {

		try {
			// check destination dir
			$dir_path = dirname( ABSPATH . $asset_path );
			if ( ! file_exists( $dir_path ) ) {
				mkdir( $dir_path, 0777, true );
			}
			$full_asset_path = ABSPATH . $asset_path;

			$fasset_dest = fopen( $full_asset_path, 'w' );
			if ( ! $fasset_dest ) {
				throw new Exception( 'Invalid file destination.' );
			}

			$fasset_src = fopen( $asset_source, 'r' );
			if ( ! $fasset_src ) {
				throw new Exception( 'Invalid asset source.' );
			}

			$buffer_length = 2048; // we can tune this later;

			while ( ! feof( $fasset_src ) ) {
				$buffer = fread( $fasset_src, $buffer_length );
				fwrite( $fasset_dest, $buffer );
			}

			fclose( $fasset_src );
			fclose( $fasset_dest );

			$this->assets[] = $asset_path;
		} catch ( \Exception $e ) {
			$t = 0;

			return false;
		}

		return true;
	}


	public function invalidate_assets() {
		foreach ( $this->assets as $asset_path ) {
			$path = rtrim( ABSPATH, '/' ) . $asset_path;
			@unlink( $path );
		}

		$this->assets = array();
	}

	public function set_needs_compile( $v ) {
		$this->needs_compile = (bool) $v;

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
	 * @return Brizy_Editor_Post
	 */
	public function setStoreAssets( $store_assets ) {
		$this->store_assets = $store_assets;

		return $this;
	}

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


	public static function get_posts_with_foreign_signature() {
		$query = array(
			'numberposts' => - 1,
			'post_type'   => brizy()->supported_post_types(),
			'post_status' => array( 'publish', 'pending', 'draft', 'auto-draft', 'future', 'private', 'inherit' ),
			'meta_query'  => array(
				array(
					'key'     => self::BRIZY_POST_SIGNATURE_KEY,
					'value'   => Brizy_Editor_Signature::get(),
					'compare' => '!='
				)
			)
		);

		return get_posts( $query );
	}

	public static function get_posts_by_foreign_hash( $hash ) {
		$query = array(
			'numberposts' => - 1,
			'post_type'   => brizy()->supported_post_types(),
			'post_status' => array( 'publish', 'pending', 'draft', 'auto-draft', 'future', 'private', 'inherit' ),
			'orderby'     => 'ID',
			'order'       => 'ASC',
			'meta_key'    => self::BRIZY_POST_HASH_KEY,
			'meta_value'  => $hash,
		);

		return get_posts( $query );
	}

	public static function get_post_by_foreign_hash( $hash ) {

		$posts = self::get_posts_by_foreign_hash( $hash );

		return count( $posts ) ? $posts[0] : null;
	}

	public static function get_duplicate_brizy_posts() {
		global $wpdb;

		$meta_options = $wpdb->get_results( "SELECT meta_value FROM {$wpdb->prefix}postmeta WHERE meta_key LIKE 'brizy-post-hash' GROUP BY meta_value HAVING count(*)>1", ARRAY_A );

		$posts = array();

		foreach ( $meta_options as $post_hash ) {
			$posts_by_foreign_hash             = self::get_posts_by_foreign_hash( $post_hash['meta_value'] );
			$posts[ $post_hash['meta_value'] ] = $posts_by_foreign_hash;
		}

		return $posts;

	}

}
