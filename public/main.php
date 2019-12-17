<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Public_Main {

	/**
	 * @var Brizy_Editor_Post
	 */
	private $post;


	/**
	 * Brizy_Public_Main constructor.
	 *
	 * @param $post
	 */
	public function __construct( $post ) {

		$this->post = $post;
	}

	public function initialize_wordpress_editor() {

		if ( $this->is_editing_page_without_editor() ) {
			add_action( 'admin_bar_menu', array( $this, '_action_add_admin_bar_update_button' ), 9999 );
		}
	}

	public function initialize_front_end() {


		if ( $this->is_editing_page_with_editor() && Brizy_Editor::is_user_allowed() ) {
			// When some plugins want to redirect to their templates.
			remove_all_actions( 'template_redirect' );
			add_action( 'template_include', array( $this, 'templateInclude' ), 10000 );

		} elseif ( $this->is_editing_page_with_editor_on_iframe() && Brizy_Editor::is_user_allowed() ) {
			add_action( 'template_include', array( $this, 'templateIncludeForEditor' ), 10000 );
			add_filter( 'show_admin_bar', '__return_false' );
			add_filter( 'the_content', array( $this, '_filter_the_content' ) );
			add_action( 'brizy_template_content', array( $this, '_action_the_content' ) );
			add_filter( 'body_class', array( $this, 'body_class_editor' ) );
			add_action( 'wp_enqueue_scripts', array( $this, '_action_enqueue_editor_assets' ), 9999 );

			$this->plugin_live_composer_fixes();

			/*
				The plugin https://wordpress.org/plugins/wp-copyright-protection/ loads a script js which disable the right click on frontend.
				Its purpose is to prevent users from copying the text from the site, a way to prevent copyright.
			 */
			remove_action( 'wp_head', 'wp_copyright_protection' );


		} elseif ( $this->is_view_page() ) {

			if ( post_password_required( $this->post->get_wp_post() ) ) {
				return;
			}

			$this->preparePost();

			add_action( 'template_include', array( $this, 'templateIncludeForEditor' ), 10000 );
			remove_filter( 'the_content', 'wpautop' );
			// insert the compiled head and content
			add_filter( 'body_class', array( $this, 'body_class_frontend' ) );
			add_action( 'wp_head', array( $this, 'insert_page_head' ) );
			add_filter( 'the_content', array( $this, 'insert_page_content' ), - 10000 );
			add_action( 'admin_bar_menu', array( $this, 'toolbar_link' ), 999 );
			add_action( 'wp_enqueue_scripts', array( $this, '_action_enqueue_preview_assets' ), 9999 );
			$this->plugin_live_composer_fixes();
		}
	}

	/**
	 * @internal
	 */
	function _action_add_admin_bar_update_button() {
		global $wp_admin_bar;

		$wp_admin_bar->add_menu( array(
			'id'    => Brizy_Editor::get()->get_slug() . '-post-preview-url',
			'title' => __( 'Preview' ),
			'href'  => get_preview_post_link(),
			'meta'  => array(
				'target' => '_blank'
			)
		) );

		$status = get_post_status( $this->post->get_id() );
		if ( in_array( $status, array( 'publish', 'future', 'private' ) ) ) {
			$wp_admin_bar->add_menu( array(
				'id'    => Brizy_Editor::get()->get_slug() . '-post-view-url',
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

		wp_enqueue_style( 'brizy-editor', "${assets_url}/editor/css/editor.css", array(), null );
		wp_register_script( 'brizy-editor-polyfill', "${assets_url}/editor/js/polyfill.js", array(), null, true );
		wp_register_script( 'brizy-editor-vendor', "${assets_url}/editor/js/editor.vendor.js", array(), null, true );
		wp_enqueue_script( 'brizy-editor', "${assets_url}/editor/js/editor.js", array(
			'brizy-editor-polyfill',
			'brizy-editor-vendor'
		), null, true );
		wp_add_inline_script( 'brizy-editor', "var __VISUAL_CONFIG__ = ${config_json};", 'before' );

		do_action( 'brizy_editor_enqueue_scripts' );

		// include REST api authenticate nonce
		wp_localize_script( 'wp-api', 'wpApiSettings', array(
			'root'          => esc_url_raw( rest_url() ),
			'nonce'         => wp_create_nonce( 'wp_rest' ),
			'editorVersion' => BRIZY_EDITOR_VERSION,
			'pluginVersion' => BRIZY_VERSION,
		) );

	}


	/**
	 * @internal
	 */
	public function _action_enqueue_preview_assets() {
		$config_object = $this->getConfigObject();
		$assets_url    = $config_object->urls->assets;
		$current_user  = wp_get_current_user();
		$config_json   = json_encode( array(
			'serverTimestamp' => time(),
			'currentUser'     => [
				'user_login'     => $current_user->user_login,
				'user_email'     => $current_user->user_email,
				'user_level'     => $current_user->user_level,
				'user_firstname' => $current_user->user_firstname,
				'user_lastname'  => $current_user->user_lastname,
				'display_name'   => $current_user->display_name,
				'ID'             => $current_user->ID,
				'roles'          => $current_user->roles
			]
		) );

		wp_enqueue_style( 'brizy-preview', "${assets_url}/editor/css/preview.css", array(), null );
		wp_register_script( 'brizy-preview-polyfill', "${assets_url}/editor/js/polyfill.js", array(), null, true );
		wp_enqueue_script( 'brizy-preview', "${assets_url}/editor/js/preview.js", array( 'brizy-preview-polyfill' ), null, true );
		wp_add_inline_script( 'brizy-preview', "var __CONFIG__ = ${config_json};", 'before' );

		do_action( 'brizy_preview_enqueue_scripts' );
	}

	public function toolbar_link( $wp_admin_bar ) {

		global $wp_post_types;

		if ( ! Brizy_Editor::is_user_allowed() ) {
			return;
		}

		$type          = $this->post->get_wp_post()->post_type;
		$postTypeLabel = $wp_post_types[ $type ]->labels->singular_name;
		$args          = array(
			'id'    => 'brizy_Edit_page_link',
			'title' => __( "Edit " . $postTypeLabel . " with " . __bt( 'brizy', 'Brizy' ) ),
			'href'  => $this->post->edit_url(),
			'meta'  => array()
		);
		$wp_admin_bar->add_node( $args );
	}

	public function templateIncludeForEditor( $template ) {
		global $post;

		if ( ! $post ) {
			return $template;
		}

		$template_path = get_post_meta( $post->ID, '_wp_page_template', true );
		$template_path = ! $template_path && $post->post_type == Brizy_Admin_Templates::CP_TEMPLATE ? Brizy_Config::BRIZY_TEMPLATE_FILE_NAME : $template_path;

		if ( in_array( basename( $template_path ), array(
			Brizy_Config::BRIZY_BLANK_TEMPLATE_FILE_NAME,
			Brizy_Config::BRIZY_TEMPLATE_FILE_NAME
		) ) ) {
			return Brizy_Editor::get()->get_path( '/public/views/templates/' . $template_path );
		}

		return $template;
	}

	public function templateInclude( $atemplate ) {

		$config_object = $this->getConfigObject();

		$iframe_url = add_query_arg(
			array( Brizy_Editor_Constants::EDIT_KEY_IFRAME => '' ),
			get_permalink( $this->post->get_wp_post()->ID )
		);

		$favicon = '';
		if ( has_site_icon() ) {
			ob_start();
			ob_clean();
			wp_site_icon();
			$favicon = ob_get_clean();
		}

		$context = array(
			'editorData'    => $config_object,
			'editorVersion' => BRIZY_EDITOR_VERSION,
			'iframe_url'    => $iframe_url,
			'page_title'    => apply_filters( 'the_title', $this->post->get_wp_post()->post_title, $this->post->get_wp_post()->ID ),
			'favicon'       => $favicon
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
		$classes[] = ( function_exists( 'wp_is_mobile' ) && wp_is_mobile() ) ? 'brz-is-mobile' : '';

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
		return ! is_admin() && isset( $_REQUEST[ Brizy_Editor_Constants::EDIT_KEY ] ) && $this->post->uses_editor();
	}

	/**
	 * @return bool
	 */
	public function is_editing_page_with_editor_on_iframe() {
		return ! is_admin() && isset( $_REQUEST[ Brizy_Editor_Constants::EDIT_KEY_IFRAME ] ) && $this->post->uses_editor();
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
		return ! is_admin() && $this->post->uses_editor() && ! isset( $_GET[ Brizy_Editor_Constants::EDIT_KEY_IFRAME ] ) && ! isset( $_GET[ Brizy_Editor_Constants::EDIT_KEY ] );
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

	public function _action_the_content( $content ) {
		echo $this->_filter_the_content( $content );
	}

	/**
	 *  Show the compiled page head content
	 */
	public function insert_page_head() {

		$params = array( 'content' => '' );

		if ( ! $this->post->get_compiled_html() ) {

			$compiled_html_head = $this->post->get_compiled_html_head();
			$compiled_html_head = Brizy_SiteUrlReplacer::restoreSiteUrl( $compiled_html_head );
			$this->post->set_needs_compile( true )
			           ->save();

			$params['content'] = $compiled_html_head;
		} else {
			$compiled_page     = $this->post->get_compiled_page();
			$head              = $compiled_page->get_head();
			$params['content'] = $head;
		}

		$params['content'] = apply_filters( 'brizy_content', $params['content'], Brizy_Editor_Project::get(), $this->post->get_wp_post(), 'head' );

		echo Brizy_TwigEngine::instance( self::path( 'views' ) )
		                     ->render( 'head-partial.html.twig', $params );

		return;
	}

	/**
	 * @param $content
	 *
	 * @return null|string|string[]
	 * @throws Exception
	 */
	public function insert_page_content( $content ) {

		global $post;

		if ( false === strpos( $content, 'brz-root__container' ) ||
		     ( $post && $post->ID !== $this->post->get_parent_id() ) ) {
			return $content;
		}

		if ( ! $this->post->get_compiled_html() ) {
			$compiled_html_body = $this->post->get_compiled_html_body();
			$content            = Brizy_SiteUrlReplacer::restoreSiteUrl( $compiled_html_body );
			$this->post->set_needs_compile( true )->save();
		} else {
			$compiled_page = $this->post->get_compiled_page();
			$content       = $compiled_page->get_body();
		}

		$content = apply_filters( 'brizy_content', $content, Brizy_Editor_Project::get(), $this->post->get_wp_post(), 'body' );

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


	private function getConfigObject() {
		$editor        = Brizy_Editor_Editor_Editor::get( Brizy_Editor_Project::get(), $this->post );
		$config_json   = json_encode( $editor->config() );
		$config_object = json_decode( $config_json );

		return $config_object;
	}

	private function preparePost() {
		$is_preview    = is_preview() || isset( $_GET['preview'] );
		$needs_compile = ! $this->post->isCompiledWithCurrentVersion() || $this->post->get_needs_compile();

		if ( $is_preview ) {
			$user_id      = get_current_user_id();
			$postParentId = $this->post->get_parent_id();
			$autosaveId   = Brizy_Editor_Post::getAutoSavePost( $postParentId, $user_id );

			if ( $autosaveId ) {
				$this->post    = Brizy_Editor_Post::get( $autosaveId );
				$needs_compile = ! $this->post->isCompiledWithCurrentVersion() || $this->post->get_needs_compile();
			} else {
				// we make this false becasue the page was saved.
				$is_preview = false;
			}
		}

		try {
			if ( $is_preview || $needs_compile ) {
				$this->post->compile_page();
			}

			if ( ! $is_preview && $needs_compile ) {
				$this->post->save();
				$this->post->save_wp_post();
			}

		} catch ( Exception $e ) {
			Brizy_Logger::instance()->exception( $e );
		}
	}

	private function plugin_live_composer_fixes() {
		// Conflict with Live Composer builder when it has set a template for single post.
		remove_filter( 'the_content', 'dslc_filter_content', 101 );
		// Remove button "Edit Template" from single when it is builded with brizy.
		remove_filter( 'wp_footer', array( 'DSLC_EditorInterface', 'show_lc_button_on_front' ) );
	}
}
