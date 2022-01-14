<?php

/**
 * Class Brizy_Editor
 */
class Brizy_Editor {

	private static $settings_key = 'post-types';

	private static $instance;

	private static $is_allowed_for_current_user = null;
	/**
	 * All plugin ajax actions and enpoints are going to be prefixed with this string.
	 * This will not affect the database prefix tables or option keys and post meta keys *
	 *
	 * @var string
	 */
	private static $prefix = null;

	public static function get() {

		if ( self::$instance ) {
			return self::$instance;
		}

		self::$instance = new self();

		return self::$instance;
	}

	/**
	 * Return the prefix
	 *
	 * @param string $string
	 *
	 * @return string
	 */
	public static function prefix( $string = null ) {

		if ( ! self::$prefix ) {

			$prefix = 'brizy';

			if ( class_exists( 'BrizyPro_Admin_WhiteLabel' ) && BrizyPro_Admin_WhiteLabel::_init()->getEnabled() ) {
				$prefix = method_exists( 'BrizyPro_Admin_WhiteLabel', 'getPrefix' ) ? BrizyPro_Admin_WhiteLabel::_init()->getPrefix() : get_option( 'brizy_prefix', 'brizy' );
			}

			self::$prefix = $prefix;
		}

		return self::$prefix . trim( $string );
	}

	/**
	 * @deprecated
	 * Return the prefix
	 *
	 * @param string $string
	 *
	 * @return string
	 */
	public static function setPrefix( $string ) {

		if ( $string == '' ) {
			throw new Exception( 'The prefix cannot be empty' );
		}

		update_option( 'brizy_prefix', $string );

		return self::$prefix = $string;
	}


	/**
	 * Brizy_Editor constructor.
	 */
	private function __construct() {

		if ( is_admin() ) {
			Brizy_SystemChecks::run();
		}

		// make sure the project is created
		// do not remove this! we force the project creation here.
		$project = Brizy_Editor_Project::get();

		Brizy_Admin_Flash::instance()->initialize(); // initialize flash

		add_action( 'init', array( $this, 'registerCustomPostTemplates' ), - 4000 );
		add_action( 'init', array( $this, 'runMigrations' ), - 3000 );

		add_action( 'init', array( 'Brizy_MaintenanceMode', 'init' ), - 4000 );
		add_action( 'init', array( $this, 'resetPermalinks' ), - 2000 );
		add_action( 'init', array( $this, 'initialize' ), - 2000 );
	}

	public function initialize() {

		add_action( 'init', array( $this, 'wordpressInit' ), 1000 );
		add_action( 'wp_loaded', array( $this, 'wordpressLoaded' ) );
		add_action( 'wp', array( $this, 'wordpressObjectCreated' ) );
		add_action( 'wp_print_scripts', array( $this, 'forceJqueryQueue' ), 99999 );

		if ( current_user_can( Brizy_Admin_Capabilities::CAP_EDIT_WHOLE_PAGE ) || Brizy_Editor_User::is_administrator() ) {
			Brizy_Admin_Rules_Api::_init();
		}

		if ( ! defined( 'WP_POST_REVISIONS' ) || ( defined( 'WP_POST_REVISIONS' ) && WP_POST_REVISIONS !== false ) ) {
			add_filter( "wp_revisions_to_keep", array( $this, 'revisionsToKeep' ), 10, 2 );
		}

	}

	public function runMigrations() {

		try {
			if ( ! Brizy_Editor_Project::get()->getWpPost() ) {
				return;
			}
		} catch (Exception $e) {
			Brizy_Admin_Flash::instance()->add_error( 'On run migrations, get project throw the message: ' . $e->getMessage() );
		}

		try {
			$migrationManager = new Brizy_Admin_Migrations();
			$migrationManager->runMigrations( BRIZY_VERSION );
		} catch ( Brizy_Admin_Migrations_UpgradeRequiredException $e ) {
			Brizy_Admin_Flash::instance()->add_error( 'Please upgrade Brizy to the latest version.' );
			Brizy_Logger::instance()->critical( 'Unknown migration found. The plugin must be downgraded to the previous version' );
			//throw new Exception( 'Halt plugin execution!' );
		}
	}

	public function wordpressInit() {

		// watch all supported posts and create meta revisions
		$metaManager = new Brizy_Admin_Post_RevisionManager();
		$metaManager->addMonitor( new Brizy_Admin_Post_BrizyPostsMonitor() );
		$metaManager->addMonitor( new Brizy_Admin_Post_ProjectPostMonitor() );

		//Brizy_Editor_Asset_Cleaner::_init();
		Brizy_Admin_PanelPostContent::_init();
		Brizy_Admin_Templates::instance();
		Brizy_Admin_Popups_Main::_init();
		Brizy_Admin_FormEntries::_init();
		Brizy_Admin_Fonts_Main::_init();
		Brizy_Admin_Blocks_Main::_init();
        Brizy_Admin_Stories_Main::_init();

		if ( Brizy_Editor_User::is_user_allowed() ) {
			Brizy_Admin_Svg_Main::_init();
            Brizy_Admin_Json_Main::_init();
			Brizy_Admin_Layouts_Main::_init();
			Brizy_Admin_Membership_Membership::_init();

			// the cloud will be always initialized with the exception when the white label is enabled
			if ( !(class_exists( 'BrizyPro_Admin_WhiteLabel' ) && BrizyPro_Admin_WhiteLabel::_init()->getEnabled()) ) {
				Brizy_Admin_Cloud::_init();
			}
		}

		$this->initializeAssetLoaders();

		$supported_post_types   = $this->supported_post_types();
		$supported_post_types[] = Brizy_Admin_Templates::CP_TEMPLATE;

		foreach ( $supported_post_types as $type ) {
			add_filter( "theme_{$type}_templates", array( $this, 'registerPageTemplates' ) );
		}
	}

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

		if ( $post && $post->uses_editor() ) {

			if ( is_user_logged_in() ) {
				$this->handleBackEndEditor( $post );
			}
		}

		if ( ! class_exists( 'BrizyPro_Admin_WhiteLabel' ) || ! BrizyPro_Admin_WhiteLabel::_init()->getEnabled() ) {
			if ( current_user_can( 'manage_options' ) ) {
				add_action( 'wp_dashboard_setup', function () {
					Brizy_Admin_DashboardWidget::_init();
				} );
			}
		}

		add_filter( 'brizy_content', array( $this, 'brizy_content' ), 10, 3 );
	}

	public function wordpressObjectCreated() {
		$pid  = Brizy_Editor::get()->currentPostId();
		$post = null;

		if ( Brizy_Editor_Entity::isBrizyEnabled($pid) ) {

			try {
				// do not delete this line
				$user = Brizy_Editor_User::get();

				if ( $pid ) {
					$post = Brizy_Editor_Post::get( $pid );
				}
			} catch ( Exception $e ) {
				return;
			}

			$this->handleFrontEndEditor( $post );
		}
	}

	public function revisionsToKeep( $num, $post ) {
		try {
			$revisionCount = apply_filters( 'brizy_revisions_max_count', BRIZY_MAX_REVISIONS_TO_KEEP );

			// $num can be -1
			if ( $revisionCount > $num && $num >= 0 ) {
				return $num;
			}

			if ( in_array( $post->post_type, array( Brizy_Editor_Project::BRIZY_PROJECT ) ) ) {
				return $revisionCount;
			}

			if ( Brizy_Editor_Entity::isBrizyEnabled($post->ID) ) {
				$num = $revisionCount;
			}
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->debug( $e->getMessage(), array( $e ) );
		}

		return $num;
	}

	/**
	 * Reset permalinks after plugin upgrade or enable
	 */
	public function resetPermalinks() {

		$this->registerCustomPostTemplates();

		if ( defined( 'BRIZY_PRO_VERSION' ) && class_exists( 'BrizyPro_Main' ) ) {
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
		Brizy_Admin_Layouts_Main::registerCustomPosts();
		Brizy_Admin_Fonts_Main::registerCustomPosts();
		Brizy_Admin_FormEntries::registerCustomPost();
        Brizy_Admin_Stories_Main::registerCustomPosts();
        Brizy_Admin_Popups_Main::registerCustomPosts();
        Brizy_Admin_Blocks_Main::registerCustomPosts();
		Brizy_Admin_Templates::registerCustomPostTemplate();
	}

	/**
	 * @param Brizy_Editor_Post $post
	 */
	public function handleFrontEndEditor( $post ) {
		try {
			$main = Brizy_Public_Main::get( $post );
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
			$main = Brizy_Public_Main::get( $post );
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
			if ( Brizy_Editor_User::is_user_allowed() ) {
				new Brizy_Editor_RestExtend();
				new Brizy_Editor_API( $post );
				new Brizy_Editor_BlockScreenshotApi( $post );
				Brizy_Editor_Accounts_Api::_init();
			}

			new Brizy_Editor_Forms_Api( $post );

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
				$this->initFeedback();
			}

			if ( is_network_admin() ) {
				Brizy_Admin_NetworkSettings::_init();
			} elseif ( is_admin() ) {
				Brizy_Admin_Settings::_init();
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

	public function forceJqueryQueue() {
		if ( ! wp_script_is( 'jquery', 'enqueued' ) ) {
			wp_enqueue_script( 'jquery' );
		}
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
		( isset( $_REQUEST[ Brizy_Editor::prefix( '_post' ) ] ) ) {
			$pid = (int) $_REQUEST[ Brizy_Editor::prefix( '_post' ) ];
		} elseif ( $wp_query && $wp_query->is_posts_page ) {
			$pid = (int) get_queried_object_id();
		} elseif
		( $wp_query && ( $apid = get_queried_object_id() ) && ( is_single() || is_page() ) && $wp_query->queried_object instanceof WP_Post ) {
			$pid = (int) $apid;
		} elseif ( function_exists( 'is_shop' ) && is_shop() ) {
			$pid = wc_get_page_id( 'shop' );
		}

		return $pid;
	}

	static public function get_slug() {
		return apply_filters( 'brizy-slug', 'brizy' );
	}

	public function get_path( $rel = '/' ) {
		return BRIZY_PLUGIN_PATH . DIRECTORY_SEPARATOR . ltrim( $rel, DIRECTORY_SEPARATOR );
	}

	public function get_url( $rel = '' ) {
		return BRIZY_PLUGIN_URL . "/" . ltrim( $rel, "/" );
	}

	public function get_version() {
		return BRIZY_VERSION;
	}

	/**
	 * @param $wp_post_id
	 * @param bool $throw
	 *
	 * @return bool
	 * @throws Brizy_Editor_Exceptions_UnsupportedPostType
	 */
	public static function checkIfPostTypeIsSupported( $wp_post_id, $throw = true ) {
		$type = get_post_type( $wp_post_id );

		$supported_post_types   = self::get()->supported_post_types();
		$supported_post_types[] = 'revision';

		if ( ! in_array( $type, $supported_post_types ) ) {

			if ( $throw ) {
				throw new Brizy_Editor_Exceptions_UnsupportedPostType(
					"Brizy editor doesn't support '{$type}' post type"
				);
			} else {
				return false;
			}
		}

		return true;
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

	public function lockProject() {
		if ( ! function_exists( 'wp_set_post_lock' ) ) {
			require_once ABSPATH . 'wp-admin/includes/post.php';
		}
		wp_set_post_lock( Brizy_Editor_Project::get()->getWpPostId() );
	}

	public function removeProjectLock() {
		delete_post_meta( Brizy_Editor_Project::get()->getWpPostId(), '_edit_lock' );
	}

	public function checkIfProjectIsLocked() {
		if ( ! function_exists( 'wp_check_post_lock' ) ) {
			require_once ABSPATH . 'wp-admin/includes/post.php';
		}

		return wp_check_post_lock( Brizy_Editor_Project::get()->getWpPostId() );
	}


	private function initFeedback() {

		$feedback = true;

		if ( class_exists( 'BrizyPro_Admin_WhiteLabel' ) ) {

			$whiteLabel = BrizyPro_Admin_WhiteLabel::_init();
			$callable   = is_callable( [ $whiteLabel, 'getEnabled' ] );

			if ( ( $callable && $whiteLabel->getEnabled() ) || ! $callable ) {
				$feedback = false;
			}
		}

		if ( $feedback && current_user_can( 'manage_options' ) ) {
			new Brizy_Admin_Feedback();
		}
	}

	/**
	 * @deprecated Use Brizy_Editor_User::is_user_allowed()
	 */
	public static function is_user_allowed() {

		if ( ! is_user_logged_in() ) {
			return false;
		}

		if ( current_user_can( 'manage_options' ) ) {
			return true;
		}

		if ( is_null( self::$is_allowed_for_current_user ) ) {
			self::$is_allowed_for_current_user = (
					current_user_can( Brizy_Admin_Capabilities::CAP_EDIT_WHOLE_PAGE )
					||
					current_user_can( Brizy_Admin_Capabilities::CAP_EDIT_CONTENT_ONLY )
				);
		}

		return self::$is_allowed_for_current_user;
	}

	/**
	 * Get all image sizes.
	 *
	 * Retrieve available image sizes with data like `width`, `height` and `crop`.
	 *
	 * @return array An array of available image sizes.
	 */
	static public function get_all_image_sizes() {
		global $_wp_additional_image_sizes;

		static $image_sizes = [];

		if ( $image_sizes ) {
			return $image_sizes;
		}

		foreach ( [ 'thumbnail', 'medium', 'medium_large', 'large' ] as $size ) {
			$image_sizes[ $size ] = [
				'width'  => (int) get_option( $size . '_size_w' ),
				'height' => (int) get_option( $size . '_size_h' ),
				'crop'   => (bool) get_option( $size . '_crop' ),
			];
		}

		if ( $_wp_additional_image_sizes ) {
			$image_sizes = array_merge( $image_sizes, $_wp_additional_image_sizes );
		}

		/** The filter image_size_names_choose is documented in wp-admin/includes/media.php */
		$image_sizes = array_filter( apply_filters( 'image_size_names_choose', $image_sizes ), function( $size ) {
			return ! empty( $size['width'] ) && ! empty( $size['height'] );
		} );

		foreach ( $image_sizes as $sizeName => $sizeAttrs ) {
			$label = ucwords( str_replace( '_', ' ', $sizeName ) );
			if ( is_array( $sizeAttrs ) ) {
				$label .= sprintf( ' - %d x %d', $sizeAttrs['width'], $sizeAttrs['height'] );
			}

			$image_sizes[ $sizeName ]['label'] = $label;
		}

		if ( ! array_key_exists( 'original', $image_sizes ) ) {
            $image_sizes = ['original'=>['label'=>__( 'Original', 'brizy' )]] + $image_sizes;
		}

		return $image_sizes;
	}
}
