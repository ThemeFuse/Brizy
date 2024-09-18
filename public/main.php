<?php

if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Public_Main {

	/**
	 * @var Brizy_Public_Main[]
	 */
	static $instance = null;

	/**
	 * @var Brizy_Editor_Post
	 */
	private $post;

	/**
	 * Brizy_Public_Main constructor.
	 *
	 * @param Brizy_Editor_Entity $post
	 */
	private function __construct( Brizy_Editor_Entity $post ) {
		$this->post = $post;
	}

	/**
	 * @param Brizy_Editor_Entity $post
	 *
	 * @return Brizy_Public_Main
	 * @throws Exception
	 */
	static public function get( Brizy_Editor_Entity $post ) {
		if ( ! $post->getWpPost() ) {
			throw new Exception( 'Unable to create Brizy_Public_Main instance with null wp post' );
		}

		$wpPostId = $post->getWpPost()->ID;

		if ( isset( self::$instance[ $wpPostId ] ) ) {
			return self::$instance[ $wpPostId ];
		}

		return self::$instance[ $wpPostId ] = new self( $post );
	}

	public function editMode() {

		if ( self::is_editing_page_with_editor( $this->post ) ) {
			add_action( 'admin_action_in-front-editor', [ $this, 'loadEditPage' ] );
		} elseif ( self::is_editing_page_with_editor_on_iframe( $this->post ) ) {
			add_filter( 'template_include', array( $this, 'templateIncludeForEditor' ), 10000 );
			add_filter( 'show_admin_bar', '__return_false' );
			add_filter( 'body_class', array( $this, 'body_class_editor' ) );
			add_action( 'wp_enqueue_scripts', array( $this, '_action_enqueue_editor_assets' ), 9999 );
			add_filter( 'the_content', array( $this, '_filter_the_content' ), - 12000 );
			add_action( 'brizy_template_content', array( $this, '_action_the_content' ) );
			add_action( 'post_password_required', '__return_false' );
		}

		do_action( 'brizy_edit_mode', $this->post );
	}

	public function previewMode() {
		if ( ! self::is_view_page( $this->post ) || wp_doing_ajax() ) {
			return;
		}

		do_action( 'brizy_preview_mode', $this->post );

		$this->preparePost();

		add_action( 'template_include', array( $this, 'templateIncludeForEditor' ), 10000 );
		remove_filter( 'the_content', 'wpautop' );
		remove_filter( 'the_content', 'wptexturize' );
		remove_filter( 'the_content', 'shortcode_unautop' );
		// insert the compiled head and content
		add_filter( 'body_class', array( $this, 'body_class_frontend' ) );
		add_action( 'wp_head', array( $this, 'insert_page_head' ) );
		add_action( 'admin_bar_menu', array( $this, 'toolbar_link' ), 999 );
		add_action( 'wp_enqueue_scripts', array( $this, '_action_enqueue_preview_assets' ), 9999 );
		add_filter( 'the_content', array( $this, 'insert_page_content' ), - 12000 );
		add_filter( 'the_excerpt', array( $this, 'brizy_post_excerpt' ), 10, 2 );
		add_filter( 'get_the_excerpt', array( $this, 'brizy_post_excerpt' ), 10, 2 );
		add_action( 'brizy_template_content', array( $this, 'brizy_the_content' ) );
	}

	/**
	 * @internal
	 */
	public function _action_enqueue_editor_assets() {
		do_action( 'brizy_pre_editor_enqueue_scripts' );

		if ( wp_script_is( 'wp-mediaelement' ) === false ) {
			wp_register_script(
				'wp-mediaelement',
				"/wp-includes/js/mediaelement/wp-mediaelement.min.js",
				array( 'mediaelement' ),
				false,
				1
			);
		}

		if ( wp_style_is( 'wp-mediaelement' ) === false ) {
			wp_register_style(
				'wp-mediaelement',
				"/wp-includes/js/mediaelement/wp-mediaelement.min.css",
				array( 'mediaelement' )
			);
		}

		wp_enqueue_media();

		$urlBuilder           = new Brizy_Editor_UrlBuilder();
		$config_object        = $this->getConfigObject();
		$client_config_object = $this->getClientConfigObject();


		$assets_url       = $config_object->urls->assets;
		$client_asset_url = $urlBuilder->plugin_url( "/public" );
		$editor_js_deps   = [
			'brizy-react-vendor',
			'brizy-react-dom-vendor',
			'brizy-editor-polyfill',
			'brizy-editor-vendor',
		];
		$editor_js_config = json_encode( $config_object );
		$client_js_config = json_encode( $client_config_object );

		if ( class_exists( 'WooCommerce' ) ) {
			$editor_js_deps[] = 'zoom';
			$editor_js_deps[] = 'photoswipe';
			$editor_js_deps[] = 'flexslider';
			$editor_js_deps[] = 'wc-single-product';
		}

		$ver = BRIZY_EDITOR_VERSION;
		wp_enqueue_style( 'brizy-editor', "$assets_url/editor/css/editor.min.css", array(), $ver );
		wp_register_script( 'brizy-editor-polyfill', "$assets_url/editor/js/polyfill.min.js", array(), $ver, true );
		wp_register_script( 'brizy-react-vendor', "$assets_url/editor/js/react.js", array(), $ver, true );
		wp_register_script( 'brizy-react-dom-vendor', "$assets_url/editor/js/react-dom.js", array(), $ver, true );
		wp_register_script( 'brizy-editor-vendor', "$assets_url/editor/js/editor.vendor.min.js", array(), $ver, true );
		wp_enqueue_script(
			'brizy-client-editor',
			"$client_asset_url/editor-client/build/index.js",
			[ 'brizy-editor-vendor' ],
			BRIZY_VERSION,
			true
		);
		wp_enqueue_script(
			'brizy-editor',
			"$assets_url/editor/js/editor.min.js",
			apply_filters( 'brizy_editor_js_deps', $editor_js_deps ),
			$ver,
			true
		);
		wp_add_inline_script( 'brizy-editor-vendor', "var __VISUAL_CONFIG__ = $editor_js_config; ", 'after' );
		wp_add_inline_script(
			'brizy-client-editor',
			"var __BRZ_PLUGIN_ENV__ = $client_js_config; ",
			'before'
		);

		do_action( 'brizy_editor_enqueue_scripts' );

		// include REST api authenticate nonce
		wp_localize_script(
			'wp-api',
			'wpApiSettings',
			array(
				'root'          => esc_url_raw( rest_url() ),
				'nonce'         => wp_create_nonce( 'wp_rest' ),
				'editorVersion' => BRIZY_EDITOR_VERSION,
				'pluginVersion' => BRIZY_VERSION,
			)
		);

		if ( BRIZY_DEVELOPMENT === true ) {
			wp_add_inline_script(
				'brizy-editor',
				"window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.parent.__REACT_DEVTOOLS_GLOBAL_HOOK__;",
				'before'
			);
		}
	}

	/**
	 * Do not remove this function it is used to compatibilities like astra theme
	 *
	 * @internal
	 */
	public function _action_enqueue_preview_assets() {
		Brizy_Public_AssetEnqueueManager::_init()->enqueuePost( $this->post );
		//$urlBuilder = new Brizy_Editor_UrlBuilder();
		//wp_enqueue_style( 'brizy-project-styles', $urlBuilder->compiled_project_styles_url(), array(), BRIZY_VERSION );
		do_action( 'brizy_preview_enqueue_scripts', $this->post, 20000 );
	}

	public function toolbar_link( $wp_admin_bar ) {
		global $wp_post_types;

		if ( ! Brizy_Editor_User::is_user_allowed() ) {
			return;
		}

		$type          = $this->post->getWpPost()->post_type;
		$postTypeLabel = $wp_post_types[ $type ]->labels->singular_name;
		$args          = array(
			'id'    => 'brizy_Edit_page_link',
			'title' => sprintf( __( 'Edit %s with %s', 'brizy' ), $postTypeLabel, __bt( 'brizy', 'Brizy' ) ),
			'href'  => apply_filters( 'brizy_toolbar_link', $this->post->edit_url(), $this->post ),
			'meta'  => array(),
		);
		$wp_admin_bar->add_node( $args );
	}

	public function templateIncludeForEditor( $template ) {
		$post = $this->post->getWpPost();

		$parentPostId = $post->ID;
		if ( wp_is_post_autosave( $post->ID ) ) {
			$parentPostId = wp_get_post_parent_id( $post->ID );
		}

		$template_path = get_post_meta( $parentPostId, '_wp_page_template', true );
		$template_path = ! $template_path && $post->post_type == Brizy_Admin_Templates::CP_TEMPLATE ? Brizy_Config::BRIZY_TEMPLATE_FILE_NAME : $template_path;

		if ( in_array(
			basename( $template_path ),
			array(
				Brizy_Config::BRIZY_BLANK_TEMPLATE_FILE_NAME,
				Brizy_Config::BRIZY_TEMPLATE_FILE_NAME,
			)
		) ) {
			$urlBuilder = new Brizy_Editor_UrlBuilder();

			return $urlBuilder->plugin_path( '/public/views/templates/' . $template_path );
		}

		return $template;
	}

	public function body_class_frontend( $classes ) {
		$classes[] = 'brz';

		return $classes;
	}

	public function body_class_editor( $classes ) {

		$classes[] = 'brz';
		$classes[] = 'brz-ed';
		$classes[] = 'brz-ed--desktop';

		if ( class_exists( 'WooCommerce' ) ) {
			if ( $this->post->getWpPost()->post_type == Brizy_Admin_Templates::CP_TEMPLATE ) {
				$classes[] = 'woocommerce';
			}
		}

		return $classes;
	}

	/**
	 * @return bool
	 */
	public static function is_editing_page_with_editor( Brizy_Editor_Post $post = null ) {

		return is_admin() &&
		       isset( $_REQUEST['action'] ) && $_REQUEST['action'] == 'in-front-editor' &&
		       ( $post ? $post->uses_editor() : true );
	}

	/**
	 * @return bool
	 */
	public static function is_editing_page_with_editor_on_iframe( Brizy_Editor_Post $post = null ) {
		return ! is_admin() && ! empty( $_REQUEST['is-editor-iframe'] ) && ( $post ? $post->uses_editor() : true );
	}

	public static function is_editing( Brizy_Editor_Post $post = null ) {
		return self::is_editing_page_with_editor( $post ) || self::is_editing_page_with_editor_on_iframe( $post );
	}

	/**
	 * @return bool
	 */
	public static function is_view_page( Brizy_Editor_Post $post = null ) {
		$isView = false;

		if ( ! is_admin() && $post && $post->uses_editor() && ! isset( $_GET['is-editor-iframe'] ) ) {
			$isView = true;

			if ( in_array(
				     get_post_status( $post->getWpPost() ),
				     [ 'future', 'draft', 'pending', 'private' ]
			     ) && ! Brizy_Editor_User::is_user_allowed() ) {
				$isView = false;
			}
		}

		return $isView;
	}

	/**
	 * @param $content
	 *
	 * @return string
	 *
	 * @internal
	 */
	function _filter_the_content( $content ) {

		if ( is_main_query() && ! doing_filter( 'brizy_content' ) ) {
			return '<div id="brz-ed-root"></div><div id="brz-popups"></div>';
		}

		return $content;
	}

	public function _action_the_content() {
		echo $this->_filter_the_content( '' );
	}

	/**
	 *  Show the compiled page head content
	 */
	public function insert_page_head() {
		if ( ! $this->post->get_compiled_html() ) {
			$compiled_html_head = $this->post->get_compiled_html_head();
			$compiled_html_head = Brizy_SiteUrlReplacer::restoreSiteUrl( $compiled_html_head );
			$this->post->set_needs_compile( true )->saveStorage();
			$html = $compiled_html_head;
		} else {
			$compiled_page = $this->post->get_compiled_page();
			$head          = $compiled_page->get_head();
			$html          = $head;
		}

		if ( empty( $html ) ) {
			return;
		}

		echo apply_filters(
			'brizy_content',
			$html,
			Brizy_Editor_Project::get(),
			$this->post->getWpPost(),
			'head'
		);
	}

	public function brizy_post_excerpt( $content, $post = null ) {

		if ( Brizy_Editor_Entity::isBrizyEnabled( $post ) ) {
			$extractor = new \BrizyPlaceholders\Extractor( new Brizy_Content_Providers_FreeProvider() );
			list( $placeholders, $content ) = $extractor->extractIgnoringRegistry( $content, function () {
				return '';
			} );
		}

		return $content;

	}

	/**
	 * @param $content
	 *
	 * @return null|string|string[]
	 * @throws Exception
	 */
	public function insert_page_content( $content ) {

		if ( doing_filter( 'brizy_dc_excerpt' ) ) {
			return $content;
		}

		if ( doing_filter( 'get_the_excerpt' ) ) {
			return $this->brizy_post_excerpt( $content );
		}

		if ( false === strpos( $content, 'brz-root__container' ) ) {
			return $content;
		}

		$project = Brizy_Editor_Project::get();
		if ( $this->post->get_compiled_scripts() ) {
			$content = $this->post->get_compiled_html();
		} else {
			if ( ! $this->post->get_compiled_html() ) {
				$compiled_html_body = $this->post->get_compiled_html_body();
				$content            = Brizy_SiteUrlReplacer::restoreSiteUrl( $compiled_html_body );
				$this->post->set_needs_compile( true )->saveStorage();
			} else {
				$compiled_page = $this->post->get_compiled_page();
				$content       = $compiled_page->get_body();
			}
		}

		return apply_filters(
			'brizy_content',
			$content,
			$project,
			$this->post->getWpPost(),
			'body'
		);
	}

	public function brizy_the_content() {
		echo do_shortcode( $this->insert_page_content( 'brz-root__container' ) );
	}

	/**
	 * @param string $rel
	 *
	 * @return string
	 */
	public static function path( $rel ) {
		return dirname( __FILE__ ) . "/$rel";
	}

	private function getConfigObject( $context = Brizy_Editor_Editor_Editor::EDITOR_CONTEXT ) {
		$editor        = Brizy_Editor_Editor_Editor::get( Brizy_Editor_Project::get(), $this->post );
		$config_json   = json_encode( $editor->config( $context ) );
		$config_object = json_decode( $config_json );

		return $config_object;
	}

	private function getClientConfigObject( $context = Brizy_Editor_Editor_Editor::EDITOR_CONTEXT ) {
		$editor        = Brizy_Editor_Editor_Editor::get( Brizy_Editor_Project::get(), $this->post );
		$config_json   = json_encode( $editor->getClientConfig( $context ) );
		$config_object = json_decode( $config_json );

		return $config_object;
	}

	private function preparePost() {

//		$is_preview    = is_preview() || isset( $_GET['preview'] );
//		$needs_compile = ! $this->post->isCompiledWithCurrentVersion() || $this->post->get_needs_compile();
//		$autosaveId    = null;
//		if ( $is_preview ) {
//			$user_id      = get_current_user_id();
//			$postParentId = $this->post->getWpPostId();
//			$autosaveId   = Brizy_Editor_Post::getAutoSavePost( $postParentId, $user_id );
//
//			if ( $autosaveId ) {
//				$this->post    = Brizy_Editor_Post::get( $autosaveId );
//				$needs_compile = ! $this->post->isCompiledWithCurrentVersion() || $this->post->get_needs_compile();
//			} else {
//				// we make this false because the page was saved.
//				$is_preview = false;
//			}
//		}

		try {
			$compiler = new Brizy_Editor_Compiler(
				Brizy_Editor_Project::get(),
				new Brizy_Admin_Blocks_Manager( Brizy_Admin_Blocks_Main::CP_GLOBAL ),
				new Brizy_Editor_UrlBuilder( Brizy_Editor_Project::get(), $this->post ),
				Brizy_Config::getCompilerUrls(),
				Brizy_Config::getCompilerDownloadUrl()
			);

			if ( $compiler->needsCompile( $this->post ) ) {
				$editorConfig = Brizy_Editor_Editor_Editor::get( Brizy_Editor_Project::get(), $this->post )
				                                          ->config( Brizy_Editor_Editor_Editor::COMPILE_CONTEXT );
				$compiler->compilePost( $this->post, $editorConfig );
			}

		} catch ( Exception $e ) {
			Brizy_Logger::instance()->exception( $e );
		}
	}

	/**
	 * @return void
	 * @throws Exception
	 */
	public function loadEditPage() {

		query_posts( [
			'p'         => $this->post->getWpPostId(),
			'post_type' => get_post_type( $this->post->getWpPostId() ),
		] );

		// Send MIME Type header like WP admin-header.
		@header( 'Content-Type: ' . get_option( 'html_type' ) . '; charset=' . get_option( 'blog_charset' ) );

		$config_object = $this->getConfigObject();

		$favicon = '';
		if ( has_site_icon() ) {
			ob_start();
			ob_clean();
			wp_site_icon();
			$favicon = ob_get_clean();
		}

		$context = [
			'iframe_url' => add_query_arg(
				[
					'is-editor-iframe' => time(),
					'post'             => $this->post->getWpPostId(),
				],
				get_permalink( $this->post->getWpPostId() )
			),
			'page_title' => apply_filters(
				'the_title',
				$this->post->getWpPost()->post_title,
				$this->post->getWpPostId()
			),
			'favicon'    => $favicon,
			'styles'     => [ $config_object->urls->assets . "/editor/css/editor.min.css?ver=" . BRIZY_EDITOR_VERSION ],
			'scripts'    => [ $config_object->urls->assets . "/editor/js/polyfill.min.js?ver=" . BRIZY_EDITOR_VERSION ],
		];


		$context = apply_filters( 'brizy_editor_page_context', $context );

		if ( ! $context ) {
			throw new Exception( 'Invalid template context. Probably a bad filter implementation' );
		}

		Brizy_Editor_View::render( BRIZY_PLUGIN_PATH . '/public/views/page', $context );

		die();
	}
}
