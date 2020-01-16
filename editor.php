<?php

/**
 * Class Brizy_Editor
 */
class Brizy_Editor {

	private static $is_allowed_for_current_user;

	private static $settings_key = 'post-types';

	private static $instance;

	public static function get() {

		if ( self::$instance ) {
			return self::$instance;
		}

		self::$instance = new self();

		return self::$instance;
	}


	/**
	 * Brizy_Editor constructor.
	 */
	private function __construct() {

		Brizy_Admin_Flash::instance()->initialize(); // initialize flash
		try {
			add_action( 'init', array( $this, 'registerCustomPostTemplates' ), - 4000 );
			add_action( 'init', array( $this, 'runMigrations' ), - 3000 );
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->critical( 'Migration process ERROR', [ $e ] );

			return;
		}
		add_action( 'init', array( $this, 'resetPermalinks' ), - 2000 );
		add_action( 'init', array( $this, 'initialize' ), - 2000 );
	}

	public function initialize() {

		add_action( 'init', array( $this, 'wordpressInit' ), 1000 );
		add_action( 'wp_loaded', array( $this, 'wordpressLoaded' ) );
		add_action( 'wp', array( $this, 'wordpressObjectCreated' ) );

		if ( current_user_can( Brizy_Admin_Capabilities::CAP_EDIT_WHOLE_PAGE ) || Brizy_Editor::is_administrator() ) {
			Brizy_Admin_Rules_Api::_init();
		}

		add_filter( "wp_revisions_to_keep", array( $this, 'revisionsToKeep' ), 10, 2 );
		//add_action( 'wp_head', array( $this, 'brizy_settings_header' ) );
		add_action( 'wp_footer', array( $this, 'brizy_settings_footer' ) );

	}

	public function runMigrations() {

		try {
			$migrationManager = new Brizy_Admin_Migrations();
			$migrationManager->runMigrations( BRIZY_VERSION );
		} catch ( Brizy_Admin_Migrations_UpgradeRequiredException $e ) {
			Brizy_Admin_Flash::instance()->add_error( 'Please upgrade Brizy to the latest version.' );
			Brizy_Logger::instance()->critical( 'Unknown migration found. The plugin must be downgraded to the previous version' );
			throw new Exception( 'Halt plugin execution!' );
		}
	}

	public function wordpressInit() {

		Brizy_Admin_FormEntries::_init();
		Brizy_Admin_Templates::_init();
		Brizy_Admin_Blocks_Main::_init();
		Brizy_Admin_Fonts_Main::_init();
		Brizy_Admin_Svg_Main::_init();
		Brizy_Admin_Popups_Main::_init();
		Brizy_Admin_OptimizeImages::_init();


		$this->loadShortcodes();
		$this->initializeAssetLoaders();

		$supported_post_types   = $this->supported_post_types();
		$supported_post_types[] = Brizy_Admin_Templates::CP_TEMPLATE;

		foreach ( $supported_post_types as $type ) {
			add_filter( "theme_{$type}_templates", array( $this, 'registerPageTemplates' ) );
		}
	}

	/**
	 *
	 */
	public function wordpressLoaded() {

		$pid  = Brizy_Editor::get()->currentPostId();
		$post = null;

		try {
			// do not delete this line
			$user = Brizy_Editor_User::get();

			if ( $pid ) {
				$post = Brizy_Editor_Post::get( $pid );
			}
		} catch ( Exception $e ) {
		}

		$this->loadEditorApi( $post, $user );
		$this->loadEditorAdminSettings();

		function brizy_add_dashboard_widgets() {
			try {
				Brizy_Admin_DashboardWidget::_init();
			} catch ( Exception $e ) {
				// ignore this exceptions for now.
			}
		}

		if ( $post && $post->uses_editor() ) {

			if ( is_user_logged_in() ) {
				$this->handleBackEndEditor( $post );
			}
		}

		add_action( 'wp_dashboard_setup', 'brizy_add_dashboard_widgets' );
		add_filter( 'brizy_content', array( $this, 'brizy_content' ), 10, 3 );
	}

	public function wordpressObjectCreated() {
		$pid  = Brizy_Editor::get()->currentPostId();
		$post = null;
		try {
			// do not delete this line
			$user = Brizy_Editor_User::get();

			if ( $pid ) {
				$post = Brizy_Editor_Post::get( $pid );
			}
		} catch ( Exception $e ) {
			return;
		}

		if ( $post && $post->uses_editor() ) {
			$this->handleFrontEndEditor( $post );
		}


	}

	public function revisionsToKeep( $num, $post ) {
		try {
			if ( in_array( $post->post_type, array( Brizy_Editor_Project::BRIZY_PROJECT ) ) ) {
				return BRIZY_MAX_REVISIONS_TO_KEEP;
			}

			if ( Brizy_Editor_Post::get( $post )->uses_editor() ) {
				$num = BRIZY_MAX_REVISIONS_TO_KEEP;
			}
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->critical( $e->getMessage(), array( $e ) );

		}

		return $num;
	}

	/**
	 * Reset permalinks after plugin upgrade or enable
	 */
	public function resetPermalinks() {

		$this->registerCustomPostTemplates();

		if(defined('BRIZY_PRO_VERSION')) {
			$mainInstance = new BrizyPro_Main();
			$mainInstance->registerCustomPosts();
		}

		if ( get_option( 'brizy-regenerate-permalinks', false ) ) {
			flush_rewrite_rules();
			delete_option( 'brizy-regenerate-permalinks' );
		}
	}

	/**
	 * @param $templates
	 *
	 * @return array
	 */
	function registerPageTemplates( $templates ) {
		return array_merge( $templates,
			array(
				Brizy_Config::BRIZY_BLANK_TEMPLATE_FILE_NAME => __bt( 'brizy', 'Brizy' ) . __( ' Template', 'brizy' )
			) );
	}


	public function registerCustomPostTemplates() {
		Brizy_Editor_Project::registerCustomPostType();

		Brizy_Admin_Blocks_Main::registerCustomPosts();
		Brizy_Admin_Blocks_Main::registerSupportedPostType();

		Brizy_Admin_Fonts_Main::registerCustomPosts();
		Brizy_Admin_FormEntries::registerCustomPost();

		Brizy_Admin_Templates::registerCustomPostTemplate();
		Brizy_Admin_Templates::registerSupportedPostType();

		Brizy_Admin_Popups_Main::registerCustomPosts();
		Brizy_Admin_Popups_Main::registerSupportedPostType();
	}

	/**
	 * @param Brizy_Editor_Post $post
	 */
	public function handleFrontEndEditor( $post ) {
		try {
			$main = new Brizy_Public_Main( $post );
			$main->initialize_front_end();
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->exception( $e );
		}
	}

	/**
	 * @param Brizy_Editor_Post $post
	 */
	public function handleBackEndEditor( $post ) {

		try {
			$main = new Brizy_Public_Main( $post );
			$main->initialize_wordpress_editor();
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->exception( $e );
		}
	}

	/**
	 * @param $project
	 * @param $post
	 * @param $user
	 */
	private function loadEditorApi( $post, $user ) {
		try {
			new Brizy_Editor_RestExtend(  );
			new Brizy_Editor_API( $post );
			new Brizy_Editor_BlockScreenshotApi( $post );
			new Brizy_Editor_Forms_Api( $post );

			Brizy_Editor_Accounts_Api::_init();

			// for other apis
			do_action( 'brizy_register_api_methods', $user, $post );
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->exception( $e );
		}
	}

	private function loadEditorAdminSettings() {
		try {
			new Brizy_Admin_Capabilities( Brizy_Editor_Storage_Common::instance() );

			if ( is_admin() ) {
				Brizy_Admin_Main::instance();
				Brizy_Admin_Settings::_init();

				$this->initFeedback();
			}
		} catch ( Exception $exception ) {
			Brizy_Admin_Flash::instance()->add_error( 'Unable to empty the trash. Please try again later.' );
			wp_safe_redirect( $_SERVER['HTTP_REFERER'] );
			exit;
		}
	}

	public function brizy_content( $content, $project, $wpPost, $contentType = 'document' ) {

		$context       = Brizy_Content_ContextFactory::createContext( $project, null, $wpPost, null );
		$mainProcessor = new Brizy_Content_MainProcessor( $context );

		return $mainProcessor->process( $content );
	}

	private function loadShortcodes() {
		new Brizy_Shortcode_Sidebar();
		new Brizy_Shortcode_Posts();
		new Brizy_Shortcode_Navigation();
		new Brizy_Shortcode_PostField();
		new Brizy_Shortcode_PostInfo();
	}

	private function initializeAssetLoaders() {
		try {
			$url_builder = new Brizy_Editor_UrlBuilder( null );

			$config           = null;
			$proxy            = new Brizy_Public_AssetProxy( $url_builder, $config );
			$crop_proxy       = new Brizy_Public_CropProxy( $url_builder, $config );
			$attachment_proxy = new Brizy_Public_AttachmentProxy( $url_builder, $config );
			$screenshot_roxy  = new Brizy_Public_BlockScreenshotProxy( new Brizy_Editor_UrlBuilder( null ), $config );
			$screenshot_roxy  = new Brizy_Public_FileProxy( new Brizy_Editor_UrlBuilder( null ), $config );
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->exception( $e );
		}
	}


	public function brizy_settings_header() {
		$params = array();

		$context = array(
			'site_settings'  => array(
				'title'       => html_entity_decode( get_bloginfo( 'name' ) ),
				'description' => html_entity_decode( get_bloginfo( 'description' ) ),
				'favicon'     => get_option( 'brizy-settings-favicon' ),
				'favicon_url' => site_url( get_option( 'brizy-settings-favicon' ) )
			),
			'social_sharing' => array(
				'title'         => html_entity_decode( get_option( 'brizy-social-title' ) ),
				'description'   => html_entity_decode( get_option( 'brizy-social-description' ) ),
				'thumbnail'     => get_option( 'brizy-social-thumbnail' ),
				'thumbnail_url' => site_url( get_option( 'brizy-social-thumbnail' ) )
			),
			'custom_css'     => html_entity_decode( get_option( 'brizy-custom-css' ) ),
			'code_injection' => array(
				'header_code' => html_entity_decode( get_option( 'brizy-header-injection' ) ),
				'footer_code' => html_entity_decode( get_option( 'brizy-footer-injection' ) )
			),
			'site_url'       => site_url(),
			'language'       => get_locale(),
		);

		echo Brizy_TwigEngine::instance( dirname( __FILE__ ) . '/public/views' )
		                     ->render( 'head-site-settings.html.twig', $context );
	}

	public function brizy_settings_footer() {
		$params                     = array();
		$params['footer_injection'] = get_option( 'brizy-footer-injection' );

		echo Brizy_TwigEngine::instance( dirname( __FILE__ ) . '/public/views' )
		                     ->render( 'footer-partial.html.twig', $params );
	}


	/*
	 * ====================================================================================================
	 * =====================================================================================================
	 * =====================================================================================================
	 * =====================================================================================================
	 * =====================================================================================================
	 */

	function currentPostId() {
		$pid = null;
		global $wp_query;

		if ( isset( $_REQUEST['post'] ) ) {
			$pid = (int) $_REQUEST['post'];
		} elseif
		( isset( $_REQUEST['page_id'] ) ) {
			$pid = (int) $_REQUEST['page_id'];
		} elseif
		( isset( $_POST['post_ID'] ) ) {
			$pid = (int) $_POST['post_ID'];
		} elseif
		( isset( $_POST['id'] ) ) {
			$pid = (int) $_POST['id'];
		} elseif
		( isset( $_REQUEST['brizy_post'] ) ) {
			$pid = (int) $_REQUEST['brizy_post'];
		} elseif ( $wp_query->is_posts_page ) {
			$pid = (int) get_queried_object_id();
		} elseif
		( ( $apid = get_queried_object_id() ) && ( is_single() || is_page() ) && $wp_query->queried_object instanceof WP_Post ) {
			$pid = (int) $apid;
		} elseif ( function_exists( 'is_shop' ) && is_shop() ) {
			$pid = wc_get_page_id( 'shop' );
		}

		return $pid;
	}


	public static function is_administrator() {

		if ( ! is_user_logged_in() ) {
			return false;
		}

		return is_admin() || is_super_admin();
	}

	public static function is_subscriber() {

		if ( ! is_user_logged_in() ) {
			return false;
		}

		$user = wp_get_current_user();

		return in_array( 'subscriber', (array) $user->roles );
	}

	public static function is_user_allowed() {

		if ( ! is_user_logged_in() ) {
			return false;
		}

		if ( self::is_administrator() ) {
			return true;
		}

		if ( is_null( self::$is_allowed_for_current_user ) ) {
			self::$is_allowed_for_current_user =
				(
					current_user_can( Brizy_Admin_Capabilities::CAP_EDIT_WHOLE_PAGE ) ||
					current_user_can( Brizy_Admin_Capabilities::CAP_EDIT_CONTENT_ONLY )
				);
		}

		return self::$is_allowed_for_current_user;
	}

	public function get_path(
		$rel = '/'
	) {

		return BRIZY_PLUGIN_PATH . DIRECTORY_SEPARATOR . ltrim( $rel, DIRECTORY_SEPARATOR );
	}

	public function get_url(
		$rel = ''
	) {
		return BRIZY_PLUGIN_URL . "/" . ltrim( $rel, "/" );
	}

	public function get_domain() {
		return 'brizy';
	}

	public function get_version() {
		return BRIZY_VERSION;
	}

	public function get_slug() {
		return 'brizy';
	}

	public function supported_post_types() {
		$types = $this->get_post_types();

		return apply_filters( 'brizy_supported_post_types', apply_filters( 'brizy:post_types', $types ) );
	}

	public function default_supported_post_types() {
		return array( 'page', 'post' );
	}

	public function get_name() {
		return __bt( 'brizy', 'Brizy' );
	}

	protected function get_post_types() {
		try {
			return Brizy_Editor_Storage_Common::instance()->get( self::$settings_key );
		} catch ( Brizy_Editor_Exceptions_NotFound $exception ) {
			Brizy_Editor_Storage_Common::instance()->set( self::$settings_key, $this->default_supported_post_types() );

			return $this->default_supported_post_types();
		}
	}

	private function initFeedback() {

		$feedback = true;

		if ( defined( 'BRIZY_PRO_VERSION' ) ) {

			$whiteLabel = BrizyPro_Admin_WhiteLabel::_init();
			$callable   = is_callable( [ $whiteLabel, 'getEnabled' ] );

			if ( ( $callable && $whiteLabel->getEnabled() ) || ! $callable ) {
				$feedback = false;
			}
		}

		if ( $feedback ) {
			new Brizy_Admin_Feedback();
		}
	}
}