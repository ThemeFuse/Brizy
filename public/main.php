<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Public_Main {

	/**
	 * @var Brizy_Editor_Project
	 */
	private $project;

	/**
	 * @var Brizy_Editor_Post
	 */
	private $post;

	/**
	 * @var Twig_Template
	 */
	private $twig_template;

	/**
	 * @var Brizy_Editor_UrlBuilder
	 */
	private $url_builder;

	/**
	 * Brizy_Public_Main constructor.
	 *
	 * @param $project
	 * @param $post
	 */
	public function __construct( $project, $post ) {

		$this->project     = $project;
		$this->post        = $post;
		$this->url_builder = new Brizy_Editor_UrlBuilder( $project, $post );
	}

	public function initialize_wordpress_editor() {

		if ( $this->is_editing_page_without_editor() ) {
			add_action( 'admin_bar_menu', array( $this, '_action_add_admin_bar_update_button' ), 9999 );
		}
	}

	public function initialize_front_end() {

		if ( $this->is_editing_page_with_editor() && Brizy_Editor::is_user_allowed() ) {
			add_action( 'template_include', array( $this, 'templateInclude' ), 10000 );
		} elseif ( $this->is_editing_page_with_editor_on_iframe() && Brizy_Editor::is_user_allowed() ) {
			add_action( 'template_include', array( $this, 'templateIncludeForEditor' ), 10000 );
			add_filter( 'show_admin_bar', '__return_false' );
			add_filter( 'the_content', array( $this, '_filter_the_content' ) );
			add_filter( 'body_class', array( $this, 'body_class_editor' ) );
			add_action( 'wp_enqueue_scripts', array( $this, '_action_enqueue_editor_assets' ), 9999 );
		} elseif ( $this->is_view_page() ) {

			if ( post_password_required( $this->post->get_wp_post() ) ) {
				return;
			}

			$this->compilePage();
			add_action( 'template_include', array( $this, 'templateIncludeForEditor' ), 10000 );
			remove_filter( 'the_content', 'wpautop' );
			// insert the compiled head and content
			add_filter( 'body_class', array( $this, 'body_class_frontend' ) );
			add_action( 'wp_head', array( $this, 'insert_page_head' ) );
			add_filter( 'the_content', array( $this, 'insert_page_content' ), - 10000 );
			add_action( 'admin_bar_menu', array( $this, 'toolbar_link' ), 999 );
			add_action( 'wp_enqueue_scripts', array( $this, '_action_enqueue_preview_assets' ), 9999 );
		}
	}

	/**
	 * @internal
	 */
	function _action_add_admin_bar_update_button() {
		global $wp_admin_bar;

		$wp_admin_bar->add_menu( array(
			'id'    => brizy()->get_slug() . '-post-preview-url',
			'title' => __( 'Preview' ),
			'href'  => get_preview_post_link(),
			'meta'  => array(
				'target' => '_blank'
			)
		) );

		$status = get_post_status( $this->post->get_id() );
		if ( in_array( $status, array( 'publish', 'future', 'private' ) ) ) {
			$wp_admin_bar->add_menu( array(
				'id'    => brizy()->get_slug() . '-post-view-url',
				'title' => __( 'View' ),
				'href'  => get_permalink(),
				'meta'  => array(
					'target' => '_blank'
				)
			) );
		}
	}

	/**
	 * @internal
	 */
	public function _action_enqueue_editor_assets() {
		if ( wp_script_is( 'jquery' ) === false ) {
			wp_register_script( 'jquery-core', "/wp-includes/js/jquery/jquery.js" );
			wp_register_script( 'jquery-migrate', "/wp-includes/js/jquery/jquery-migrate.min.js" );
			wp_register_script( 'jquery', false, array( 'jquery-core', 'jquery-migrate' ) );
		}

		if ( wp_script_is( 'wp-mediaelement' ) === false ) {
			wp_register_script( 'wp-mediaelement', "/wp-includes/js/mediaelement/wp-mediaelement.min.js", array( 'mediaelement' ), false, 1 );
		}

		if ( wp_style_is( 'wp-mediaelement' ) === false ) {
			wp_register_style( 'wp-mediaelement', "/wp-includes/js/mediaelement/wp-mediaelement.min.css", array( 'mediaelement' ) );
		}

		wp_enqueue_media();

		$config_object = $this->getConfigObject();
		$assets_url    = $config_object->urls->assets;
		$config_json   = json_encode( $config_object );

		wp_enqueue_style( 'brizy-editor', "${assets_url}/editor/css/editor.css", array(), BRIZY_EDITOR_VERSION );
		wp_register_script( 'brizy-editor-polyfill', "https://cdn.polyfill.io/v2/polyfill.js?features=IntersectionObserver,IntersectionObserverEntry", array(), null, true );
		wp_register_script( 'brizy-editor-vendor', "${assets_url}/editor/js/editor.vendor.js", array( 'jquery' ), BRIZY_EDITOR_VERSION, true );
		wp_enqueue_script( 'brizy-editor', "${assets_url}/editor/js/editor.js", array(
			'brizy-editor-vendor',
			'brizy-editor-polyfill'
		), BRIZY_EDITOR_VERSION, true );
		wp_add_inline_script( 'brizy-editor', "var __VISUAL_CONFIG__ = ${config_json};", 'before' );

		do_action( 'brizy_editor_enqueue_scripts' );
	}

	/**
	 * @internal
	 */
	public function _action_enqueue_preview_assets() {
		if ( wp_script_is( 'jquery' ) === false ) {
			wp_register_script( 'jquery-core', "/wp-includes/js/jquery/jquery.js" );
			wp_register_script( 'jquery-migrate', "/wp-includes/js/jquery/jquery-migrate.min.js" );
			wp_register_script( 'jquery', false, array( 'jquery-core', 'jquery-migrate' ) );
		}

		$config_object = $this->getConfigObject();
		$assets_url    = $config_object->urls->assets;
		$config_json   = json_encode( array(
			'serverTimestamp' => time()
		) );

		wp_enqueue_style( 'brizy-preview', "${assets_url}/editor/css/preview.css", array(), BRIZY_EDITOR_VERSION );
		wp_register_script( 'brizy-polyfill', "https://cdn.polyfill.io/v2/polyfill.js?features=IntersectionObserver,IntersectionObserverEntry", array(), null, true );
		wp_enqueue_script( 'brizy-preview', "${assets_url}/editor/js/preview.js", array(
			'jquery',
			'brizy-polyfill'
		), BRIZY_EDITOR_VERSION, true );
		wp_add_inline_script( 'brizy-preview', "var __CONFIG__ = ${config_json};", 'before' );

		do_action( 'brizy_preview_enqueue_scripts' );
	}

	public function toolbar_link( $wp_admin_bar ) {

		global $wp_post_types;

		if ( ! Brizy_Editor::is_user_allowed() ) {
			return;
		}

		$type = $this->post->get_wp_post()->post_type;
		$postTypeLabel = $wp_post_types[$type]->labels->singular_name;
		$args = array(
			'id'    => 'brizy_Edit_page_link',
			'title' => __( "Edit ".$postTypeLabel." with Brizy" ),
			'href'  => $this->post->edit_url(),
			'meta'  => array()
		);
		$wp_admin_bar->add_node( $args );
	}

	public function templateIncludeForEditor($template) {
		global $post;

		if ( ! $post ) {
			return $template;
		}

		$template_path = get_post_meta( $post->ID, '_wp_page_template', true );

		if ( in_array( basename( $template_path ), array(
			Brizy_Config::BRIZY_BLANK_TEMPLATE_FILE_NAME,
			Brizy_Config::BRIZY_TEMPLATE_FILE_NAME
		) ) ) {
			return Brizy_Editor::get()->get_path( '/public/views/templates/brizy-blank-template.php' );
		}

		return $template;
	}

	public function templateInclude( $atemplate ) {

		$config_object = $this->getConfigObject();

		$iframe_url = add_query_arg(
			array( Brizy_Editor_Constants::EDIT_KEY_IFRAME => '' ),
			get_permalink( $this->post->get_wp_post()->ID )
		);

		$context = array(
			'editorData'    => $config_object,
			'editorVersion' => BRIZY_EDITOR_VERSION,
			'iframe_url'    => $iframe_url,
			'page_title'    => apply_filters( 'the_title', $this->post->get_wp_post()->post_title )
		);

		if ( defined( 'BRIZY_DEVELOPMENT' ) ) {
			$context['DEBUG'] = true;
		}

		echo Brizy_TwigEngine::instance( self::path( 'views' ) )
		                     ->render( 'page.html.twig', $context );

		return self::path( 'views/empty.php' );
	}

	public function body_class_frontend( $classes ) {

		$classes[] = 'brz';

		return $classes;
	}

	public function body_class_editor( $classes ) {

		$classes[] = 'brz';
		$classes[] = 'brz-ed';
		$classes[] = 'brz-ed--desktop';

		return $classes;
	}

	/**
	 * @return bool
	 */
	public function is_editing_page_with_editor() {
		return ! is_admin() && isset( $_GET[ Brizy_Editor_Constants::EDIT_KEY ] ) && $this->post->uses_editor();
	}

	/**
	 * @return bool
	 */
	public function is_editing_page_with_editor_on_iframe() {
		return ! is_admin() && isset( $_GET[ Brizy_Editor_Constants::EDIT_KEY_IFRAME ] ) && $this->post->uses_editor();
	}

	/**
	 * @return bool
	 */
	public function is_editing_page_without_editor() {
		return isset( $_REQUEST['post'] ) && $_REQUEST['post'] == $this->post->get_id();
	}

	/**
	 * @return bool
	 */
	public function is_view_page() {
		return ! is_admin() && $this->post->uses_editor() && !isset( $_GET[ Brizy_Editor_Constants::EDIT_KEY_IFRAME ] ) && !isset( $_GET[ Brizy_Editor_Constants::EDIT_KEY ] );
	}

	/**
	 * @param $content
	 *
	 * @return string
	 *
	 * @internal
	 */
	function _filter_the_content( $content ) {

		if ( is_main_query() ) {

			try {

				$config_object = $this->getConfigObject();

				$context = array(
					'editorData'    => $config_object,
					'editorVersion' => BRIZY_EDITOR_VERSION
				);

				if ( WP_DEBUG ) {
					$context['DEBUG'] = true;
				}

				$render_block = Brizy_TwigEngine::instance( self::path( 'views' ) )
				                                ->render( 'editor.html.twig', $context );

				return $render_block;
			} catch ( Exception $e ) {
				return $e->getMessage();
			}
		}

		return $content;
	}


	/**
	 *  Show the compiled page head content
	 */
	public function insert_page_head() {

		$context = array( 'content' => '' );
		if ( ! $this->post->get_compiled_html() ) {

			$compiled_html_head = $this->post->get_compiled_html_head();
			$compiled_html_head = Brizy_SiteUrlReplacer::restoreSiteUrl( $compiled_html_head );

			$this->post->set_needs_compile( true )
			           ->save();

			$context['content'] = $compiled_html_head;

		} else {
			$compiled_page = $this->post->get_compiled_page( $this->project );

			$compiled_page->addAssetProcessor( new Brizy_Editor_Asset_StripTagsProcessor( array( '<title>' ) ) );

			$head = $compiled_page->get_head();

			$context['content'] = $head;
		}

		echo Brizy_TwigEngine::instance( self::path( 'views' ) )
		                     ->render( 'head-partial.html.twig', $context );

		return;
	}

	/**
	 * @param $content
	 *
	 * @return null|string|string[]
	 * @throws Exception
	 */
	public function insert_page_content( $content ) {
		if ( ! $this->post->get_compiled_html() ) {
			$compiled_html_body = $this->post->get_compiled_html_body();
			$content            = Brizy_SiteUrlReplacer::restoreSiteUrl( $compiled_html_body );
			$this->post->set_needs_compile( true )->save();
		} else {
			$compiled_page = $this->post->get_compiled_page( $this->project );
			$content       = $compiled_page->get_body();
		}

		return $content;
	}

	/**
	 * @param string $rel
	 *
	 * @return string
	 */
	public static function path( $rel ) {
		return dirname( __FILE__ ) . "/$rel";
	}

	/**
	 * @param null $template_path
	 *
	 * @return Twig_TemplateWrapper
	 */
	private function getTwigTemplate( $template_path = null ) {

		if ( isset( $this->twig_template[ $template_path ] ) ) {
			return $this->twig_template[ $template_path ];
		}

		$loader = new Twig_Loader_Array( array(
			'editor' => file_get_contents( $template_path )
		) );

		$twig_cache = $this->url_builder->upload_path( 'brizy/twig' );

		if ( ! file_exists( $twig_cache ) ) {
			@mkdir( $twig_cache, 0755, true );
		}

		$options = array();
		if ( file_exists( $twig_cache ) ) {
			$options['cache'] = $twig_cache;
		}

		$twig          = new Twig_Environment( $loader, $options );
		$twig_template = $twig->load( 'editor' );

		return $this->twig_template[ $template_path ] = $twig_template;
	}

	private function getConfigObject() {
		$editor        = Brizy_Editor_Editor_Editor::get( $this->project, $this->post );
		$config_json   = json_encode( $editor->config() );
		$config_object = json_decode( $config_json );

		return $config_object;
	}

	private function compilePage() {
		$is_preview    = is_preview() || isset( $_GET['preview'] );
		$needs_compile = ! $this->post->isCompiledWithCurrentVersion() || $this->post->get_needs_compile();

		if ( $is_preview || $needs_compile ) {
			try {
				$this->post->compile_page();

				if ( ! $is_preview && $needs_compile ) {
					$this->post->save();
				}

			} catch ( Exception $e ) {
				Brizy_Logger::instance()->exception( $e );
			}
		}
	}
}
