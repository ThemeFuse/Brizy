<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Editor_Post extends Brizy_Admin_Serializable
{

	const BRIZY_POST = 'brizy-post';

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

		unset($get_object_vars['wp_post_id']);

		return serialize( $get_object_vars );
	}

	/**
	 * @param $wp_post_id
	 *
	 * @return Brizy_Editor_Post
	 * @throws Brizy_Editor_Exceptions_NotFound
	 * @throws Brizy_Editor_Exceptions_UnsupportedPostType
	 */
	public static function get( $wp_post_id ) {
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

		$api_page = Brizy_Editor_API_Page::get()
		                                 ->set_title( $post->post_title );

		$api_page = Brizy_Editor_User::get()->create_page( $project, $api_page );

		$post = new self( $api_page, $post->ID );

		return $post;
	}

	/**
	 * @return bool
	 */
	public function save() {

		try {
			$this->storage()->set( self::BRIZY_POST, $this );

			wp_update_post( array(
				'ID'           => $this->get_id(),
				'post_content' => $this->get_compiled_html_body()
			) );

			$project = Brizy_Editor_Project::get();

			Brizy_Editor_User::get()->update_page( $project->get_api_project(), $this->api_page );

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
	public function get_data() {

		return $this->api_page->get_content();
	}

	/**
	 * @param $data
	 *
	 * @return $this
	 */
	public function set_data( $data ) {

		$this->api_page->set_content( $data );

		return $this;
	}


	/**
	 * @return bool
	 * @throws Brizy_Editor_Exceptions_ServiceUnavailable
	 * @throws Exception
	 */
	public function compile_page() {

		if ( $this->needs_compile || BRIZY_DEVELOPMENT ) {

			// $html_document = file_get_contents( '/home/alex/Projects/bitblox_compiler/test-page/index.html' );
			// $compiled_html = new Brizy_Editor_CompiledHtml( $html_document );

			$compiled_html = Brizy_Editor_User::get()->compile_page( Brizy_Editor_Project::get(), $this );

			$this->compiled_html_head = $compiled_html->get_head();
			$this->compiled_html_body = $compiled_html->get_body();

			$this->invalidate_assets();

			$this->needs_compile = false;

			return true;
		}

		$this->setStoreAssets( true );

		return false;
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


	/**
	 * @param $key
	 * @param $list
	 * @param $in_footer
	 *
	 * @return $this
	 */
	protected function store_scripts( $key, $list, $in_footer ) {

		$new = array();

		foreach ( $list as $item ) {
			$id    = implode( '-', array( $this->get_id(), basename( $item ) ) );
			$new[] = new Brizy_Editor_Resources_StaticScript( "brizy-$id", $item, array(), null, $in_footer );
		}

		$this->storage()->set( $key, $this->store_static( $new ) );

		return $this;
	}

	/**
	 * @param $list
	 *
	 * @return $this
	 */
	protected function store_head_scripts( $list ) {

		$this->store_scripts( 'head_scripts', $list, false );

		return $this;
	}

	/**
	 * @param $list
	 *
	 * @return $this
	 */
	protected function store_footer_scripts( $list ) {

		$this->store_scripts( 'footer_scripts', $list, true );

		return $this;
	}

	/**
	 * @param $link_tags
	 *
	 * @return $this
	 */
	protected function store_links( $link_tags ) {
		$new = array();


		foreach ( $link_tags as $link_tag ) {
			$uri   = $link_tag->get_attr( 'href' );
			$id    = implode( '-', array( $this->get_id(), basename( $uri ) ) );
			$new[] = new Brizy_Editor_Resources_StaticStyle( "brizy-$id", $uri );
		}

		// remove this when the head_links will be ready.
		$this->storage()->set( 'links', $this->store_static( $new ) );

		$head_links = array();

		foreach ( $link_tags as $i => $link_tag ) {
			$link         = $link_tag->get_attrs();
			$link['href'] = $new[ $i ]->get_url();

			$head_links[] = $link;
		}

		$this->storage()->set( 'head_links', $head_links );

		return $this;
	}

	/**
	 * @param $list
	 *
	 * @return $this
	 */
	protected function store_inline_styles( $list ) {
		$this->storage()->set( 'inline-styles', $list );

		return $this;
	}

	public function get_links_tags() {
		try {

			$links = $this->storage()->get( 'head_links' );

			$link_tags = array();

			if ( is_array( $links ) ) {
				foreach ( $links as $link ) {
					if ( isset( $link['rel'] ) && $link['rel'] != 'stylesheet' ) {
						$link_tags[] = $link;
					}
				}
			}

			return $link_tags;

		} catch ( Exception $exception ) {
			return array();
		}
	}

	/**
	 * @return Brizy_Editor_Resources_StaticStyle[]
	 */
	public function get_styles() {
		try {

			$links = $this->storage()->get( 'head_links' );

			$static_styles = array();

			if ( is_array( $links ) ) {
				foreach ( $links as $link ) {
					if ( isset( $link['rel'] ) && $link['rel'] == 'stylesheet' ) {
						$static_styles[] = new Brizy_Editor_Resources_StaticStyle( basename( $link['href'] ), $link['href'] );
					}
				}
			}

			return $static_styles;

		} catch ( Exception $exception ) {
			return array();
		}
	}


	public function get_head_scripts() {
		try {

			$links = $this->storage()->get( 'head_scripts' );

			$script_tags = array();

			if ( is_array( $links ) ) {
				foreach ( $links as $link ) {
					$script_tags[] = $link;
				}
			}

		} catch ( Exception $exception ) {
			return array();
		}

		return $script_tags;
	}


	public function get_footer_scripts() {
		try {

			$links = $this->storage()->get( 'footer_scripts' );

			$script_tags = array();

			if ( is_array( $links ) ) {
				foreach ( $links as $link ) {
					$script_tags[] = $link;
				}
			}

		} catch ( Exception $exception ) {
			return array();
		}

		return $script_tags;
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




//
//	/**
//	 * @return bool
//	 */
//	public function is_draft() {
//		return (bool) $this->api_page->get_published();
//	}
//
//	/**
//	 * @param $published
//	 *
//	 * @return $this
//	 */
//	public function set_is_draft( $published ) {
//		$this->api_page->set_published( (bool) $published );
//
//		return $this;
//	}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//	/**
//	 * @return string
//	 */
//	public function get_title() {
//		return get_the_title( $this->get_id() );
//	}
//
//
//	/**
//	 * @param $data
//	 *
//	 * @return $this
//	 * @throws Brizy_Editor_Exceptions_AccessDenied
//	 */
//	public function set_title( $data ) {
//
//		if ( ! $this->can_edit() ) {
//			throw new Brizy_Editor_Exceptions_AccessDenied();
//		}
//
//		wp_update_post( array(
//			'ID'         => $this->get_id(),
//			'post_title' => $data
//		) );
//
//		return $this;
//	}


	/**
	 * @return $this
	 * @throws Brizy_Editor_Exceptions_AccessDenied
	 */
//	public function disable_editor() {
//		if ( ! $this->can_edit() ) {
//			throw new Brizy_Editor_Exceptions_AccessDenied( 'Current user cannot edit page' );
//		}
//
//		$this->storage()->delete( Brizy_Editor_Constants::USES_BRIZY );
//
//		return $this;
//	}

	/**
	 * @return Brizy_Editor_Resources_StaticScript[]
	 */
//	public function get_scripts() {
//		try {
//			return $this->storage()->get( 'scripts' );
//		} catch ( Exception $exception ) {
//			return array();
//		}
//	}

	/**
	 * @return Brizy_Editor_Resources_StaticStyle[]
	 */
//	public function get_styles() {
//		try {
//			return $this
//				->storage()
//				->get( 'styles' );
//		} catch ( Exception $exception ) {
//			return array();
//		}
//	}


	/**
	 * @return array
	 */
	public function get_inline_styles() {
		try {
			return $this
				->storage()
				->get( 'inline-styles' );
		} catch ( Exception $exception ) {
			return array();
		}
	}

	/**
	 * @param Brizy_Editor_Resources_Static[] $list
	 *
	 * @return array
	 */
	public function store_static( $list ) {
		$new = array();

		if ( is_array( $list ) ) {
			foreach ( $list as $item ) {
				try {
					$new[] = Brizy_Editor_Resources_StaticStorage::get( $item )
					                                             ->store()
					                                             ->get_resource();
				} catch ( Exception $exception ) {
					continue;
				}
			}
		}

		return $new;
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
	 * @return string
	 */
	public function get_template() {
		return get_post_meta( $this->get_id(), '_wp_page_template', true );
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


}
