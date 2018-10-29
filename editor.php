<?php

/**
 * Class Brizy_Editor
 */
class Brizy_Editor {

	private static $is_allowed_for_current_user;

	private static $settings_key = 'post-types';

	private static $instance;

	/**
	 * Brizy_Editor constructor.
	 */
	private function __construct() {

		Brizy_Admin_Flash::instance()->initialize(); // initialize flash

		try {
			$this->runMigrations();
		} catch ( Brizy_Admin_Migrations_UpgradeRequiredException $e ) {
			Brizy_Admin_Flash::instance()->add_error( 'Please upgrade Brizy to the latest version.' );

			return;
		}

		add_action( 'init', array( $this, 'initialize' ), - 2000 );
	}

	public function initialize() {

		add_action( 'init', array( $this, 'loadCompatibilityClasses' ), - 1500 );
		add_action( 'init', array( $this, 'wordpressInit' ), 1000 );
		add_action( 'wp_loaded', array( $this, 'wordpressLoaded' ) );
		add_action( 'wp', array( $this, 'wordpressObjectCreated' ) );

		if ( current_user_can( Brizy_Admin_Capabilities::CAP_EDIT_WHOLE_PAGE ) ) {
			Brizy_Admin_Rules_Api::_init();
		}

		add_filter( "brizy:templates", array( $this, 'filterPublicTemplates' ) );

	}

	public function runMigrations() {
		$migrationManager = new Brizy_Admin_Migrations();
		$migrationManager->runMigrations( BRIZY_VERSION );
	}

	public function wordpressInit() {

		Brizy_Admin_Templates::_init();

		$this->loadShortcodes();
		$this->registerCustomPostTemplates();
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
			$user    = Brizy_Editor_User::get();
			$project = Brizy_Editor_Project::get();

			if ( $pid ) {
				$post = Brizy_Editor_Post::get( $pid );

				// check post for migration status
				$migrations = new Brizy_Admin_Migrations();
				$migrations->runMigrationsBasedOnPost( $post, BRIZY_VERSION );
			}
		} catch ( Exception $e ) {
		}

		$this->loadEditorApi( $project, $post, $user );
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
				$this->handleBackEndEditor( $user, $project, $post );
			}
		}

		add_action( 'wp_dashboard_setup', 'brizy_add_dashboard_widgets' );
		add_action( 'pre_get_posts', array( $this, 'remove_templates_from_search' ) );
	}

	public function loadCompatibilityClasses() {
		if ( function_exists( 'w3tc_add_ob_callback' ) || function_exists( 'w3tc_class_autoload' ) ) {
			new Brizy_Compatibilities_Wtc();
		}

		if ( function_exists( 'gutenberg_init' ) ) {
			new Brizy_Compatibilities_Gutenberg();
		}

		if ( function_exists( 'autoptimize' ) ) {
			new Brizy_Compatibilities_Autoptimize();
		}
	}

	/**
	 * @param $templates
	 *
	 * @return array
	 */
	public function filterPublicTemplates( $templates ) {

		$list = wp_get_theme()->get_page_templates();

		foreach ( $list as $key => $title ) {
			$templates[] = array(
				'id'    => $key,
				'title' => $title
			);
		}

		return $templates;
	}


	/**
	 * @param $templates
	 *
	 * @return array
	 */
	function registerPageTemplates( $templates ) {
		return array_merge( $templates,
			array(
				Brizy_Config::BRIZY_BLANK_TEMPLATE_FILE_NAME => __( 'Brizy Template', 'brizy' )
			) );
	}


	public function registerCustomPostTemplates() {
		Brizy_Editor_Project::registerCustomPostType();
		Brizy_Admin_Templates::registerCustomPostTemplate();
	}

	/**
	 * @param Brizy_Editor_User $user
	 * @param Brizy_Editor_Project $project
	 * @param Brizy_Editor_Post $post
	 */
	public function handleFrontEndEditor( $user, $project, $post ) {
		try {
			$main = new Brizy_Public_Main( $project, $post );
			$main->initialize_front_end();
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->exception( $e );
		}
	}

	/**
	 * @param Brizy_Editor_User $user
	 * @param Brizy_Editor_Project $project
	 * @param Brizy_Editor_Post $post
	 */
	public function handleBackEndEditor( $user, $project, $post ) {

		try {
			$main = new Brizy_Public_Main( $project, $post );
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
	private function loadEditorApi( $project, $post, $user ) {
		try {
			new Brizy_Editor_API( $project, $post );

			// for other apis
			do_action( 'brizy_register_api_methods', array( $user, $project, $post ) );
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

			}
		} catch ( Exception $exception ) {
			Brizy_Admin_Flash::instance()->add_error( 'Unable to empty the trash. Please try again later.' );
			wp_redirect( $_SERVER['HTTP_REFERER'] );
			exit;
		}
	}


	public function wordpressObjectCreated() {
		$pid  = Brizy_Editor::get()->currentPostId();
		$post = null;
		try {
			// do not delete this line
			$user = Brizy_Editor_User::get();

			$project = Brizy_Editor_Project::get();

			if ( $pid ) {
				$post = Brizy_Editor_Post::get( $pid );
			}
		} catch ( Exception $e ) {
			return;
		}

		if ( $post && $post->uses_editor() ) {
			$this->handleFrontEndEditor( $user, $project, $post );
		}
	}


	private function loadShortcodes() {
		$a = new Brizy_Shortcode_Sidebar();
		$b = new Brizy_Shortcode_Posts();
		$c = new Brizy_Shortcode_Navigation();
	}

	private function initializeAssetLoaders() {
		try {
			$project     = Brizy_Editor_Project::get();
			$url_builder = new Brizy_Editor_UrlBuilder( $project );

			$config    = null;
			$proxy     = new Brizy_Public_AssetProxy( $url_builder, $config );
			$crop_roxy = new Brizy_Public_CropProxy( $url_builder, $config );
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->exception( $e );
		}
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
		} elseif
		( ( $apid = get_queried_object_id() ) && ( is_single() || is_page() ) && $wp_query->queried_object instanceof WP_Post ) {
			$pid = (int) $apid;
		} elseif ( function_exists( 'is_shop' ) && is_shop() ) {
			$pid = wc_get_page_id( 'shop' );
		}

		return $pid;
	}

	public static function get() {
		return self::$instance ? self::$instance : self::$instance = new self();
	}

	public static function is_administrator() {

		if ( ! is_user_logged_in() ) {
			return false;
		}

		$user = wp_get_current_user();

		return in_array( 'administrator', (array) $user->roles );
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
		return 'Brizy';
	}

	protected function get_post_types() {
		try {
			return Brizy_Editor_Storage_Common::instance()->get( self::$settings_key );
		} catch ( Brizy_Editor_Exceptions_NotFound $exception ) {
			Brizy_Editor_Storage_Common::instance()->set( self::$settings_key, $this->default_supported_post_types() );

			return $this->default_supported_post_types();
		}
	}

	/**
	 * @param $query
	 */
	public function remove_templates_from_search( $query ) {

		if ( is_admin() || ! $query->is_main_query() ) {
			return;
		}

		if ( $query->is_search() ) {

			$post_type_to_remove   = Brizy_Admin_Templates::CP_TEMPLATE;
			$searchable_post_types = get_post_types( array( 'exclude_from_search' => false ) );

			/* make sure you got the proper results, and that your post type is in the results */
			if ( is_array( $searchable_post_types ) && in_array( $post_type_to_remove, $searchable_post_types ) ) {
				/* remove the post type from the array */
				unset( $searchable_post_types[ $post_type_to_remove ] );
				/* set the query to the remaining searchable post types */
				$query->set( 'post_type', $searchable_post_types );
			}
		}
	}
}