<?php

class Brizy_Editor_Editor_Editor {
	/**
	 * @var Brizy_Editor_Post
	 */
	private $post;

	/**
	 * @var Brizy_Editor_Project
	 */
	private $project;

	/**
	 * @param Brizy_Editor_Project $project
	 * @param Brizy_Editor_Post $post
	 *
	 * @return Brizy_Editor_Editor_Editor
	 */
	public static function get( Brizy_Editor_Project $project, Brizy_Editor_Post $post = null ) {
		return new self( $project, $post );
	}

	/**
	 * Brizy_Editor_Editor_Editor constructor.
	 *
	 * @param Brizy_Editor_Project $project
	 * @param Brizy_Editor_Post $post
	 */
	public function __construct( Brizy_Editor_Project $project, Brizy_Editor_Post $post = null ) {
		$this->post    = $post;
		$this->project = $project;
	}

	protected function get_post() {

		if ( ! ( $this->post instanceof Brizy_Editor_Post ) ) {
			$class = get_class( $this );
			throw new Exception( "The class {$class} must be initialize with all parameters" );
		}

		return $this->post;
	}

	/**
	 * @throws Exception
	 */
	public function config() {

		$local_page_asset_static_url = sprintf(Brizy_Config::LOCAL_PAGE_ASSET_STATIC_URL, $this->project->get_template_version());

		$config =  array(
			'env'             => 'WP',
			'rootElement'     => '#' . brizy()->get_slug() . '-root-element',
			'editorOptions'   => array(
				'isLegacy'    => false,
				'isMultipage' => false,
				'isVariant'   => false,
			),
			'hosts'           => array(
				'api'     => Brizy_Config::EDITOR_HOST_API,
				'base'    => Brizy_Config::EDITOR_HOST_BASE,
				'origin'  => Brizy_Config::EDITOR_HOST_ORIGIN,
				'primary' => Brizy_Config::EDITOR_HOST_PRIMARY,
			),
			'project'         => $this->project->get_id(),
			'projectLanguage' => array(
				'id'      => 7,
				'variant' => array(
					'id'   => 7,
					'name' => 'A',
				),
			),
			'serverTimestamp' => time(),
			'urls'            => array(
				'api'                 => home_url( '/wp-json/v1' ),
				'base'                => Brizy_Config::EDITOR_BASE_URL,
				'integration'         => Brizy_Config::EDITOR_INTEGRATION_URL,
				'image'               => brizy()->get_asset_url( Brizy_Config::LOCAL_PAGE_MEDIA_STATIC_URL ),
				// proxy
				'origin'              => Brizy_Config::EDITOR_ORIGIN_URL,
				'primary'             => Brizy_Config::EDITOR_STATIC_URL,
				'static'              => brizy()->get_asset_url( $local_page_asset_static_url . '/' . $this->get_post()->get_id() ),
				// proxy
				'change_template_url' => admin_url( 'admin-post.php?post=' . $this->get_post()->get_id() . '&action=_brizy_change_template' )
			),
			'user'            => $this->project->get_id(),
			'versions'        => array(
				'editor'   => null, // null for development.
				'template' => null
			),
			'wp'              => array(
				'permalink' => get_permalink( $this->post->get_id() ),
				'page'      => $this->post->get_id(),
				'templates' => $this->post->get_templates(),
				'api'       => array(
					'hash'             => wp_create_nonce( Brizy_Editor_API::nonce ),
					'url'              => admin_url( 'admin-ajax.php' ),
					'globals'          => array(
						'set' => Brizy_Editor_API::AJAX_SET_GLOBALS,
						'get' => Brizy_Editor_API::AJAX_GET_GLOBALS,
					),
					'media'            => Brizy_Editor_API::AJAX_MEDIA,
					'ping'             => Brizy_Editor_API::AJAX_PING,
					'getPage'          => Brizy_Editor_API::AJAX_GET,
					'updatePage'       => Brizy_Editor_API::AJAX_UPDATE,
					'getSidebars'      => Brizy_Editor_API::AJAX_SIDEBARS,
					'buildContent'     => Brizy_Editor_API::AJAX_BUILD,
					'sidebarContent'   => Brizy_Editor_API::AJAX_SIDEBAR_CONTENT,
					'shortcodeContent' => Brizy_Editor_API::AJAX_SHORTCODE_CONTENT,
					'shortcodeList'    => Brizy_Editor_API::AJAX_SHORTCODE_LIST,
					'getTemplates'     => Brizy_Editor_API::AJAX_GET_TEMPLATES,
					'getInternalLinks' => Brizy_Editor_API::AJAX_GET_INTERNAL_LINKS,
					'getMenus'         => Brizy_Editor_API::AJAX_GET_MENU_LIST,
				),
				'plugins'   => array(
					'woocommerce' => $this->get_woocomerce_plugin_info()
				),
				//'menus' =>  wp_get_nav_menus()
//				'shortcodes' => array(
//					'sidebar' => 'brizy_sidebar'
//				)
			)
		);

		return $config;
	}


	public function get_asset_url() {
		return get_site_url() . sprintf( Brizy_Config::BRIZY_WP_EDITOR_ASSET_PATH, $this->project->get_template_version() );
	}

	public function store_asset( $asset_source, $asset_path ) {

		$full_asset_path = null;
		try {
			// check destination dir
			$dir_path = dirname( rtrim( ABSPATH, '/' ) . $asset_path );

			if ( ! file_exists( $dir_path ) ) {
				mkdir( $dir_path, 0777, true );
			}
			$full_asset_path = rtrim( ABSPATH, '/' ) . $asset_path;

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

		} catch ( Exception $e ) {
			$t = 0;

			// clean up
			if ( $full_asset_path ) {
				@unlink( $full_asset_path );
			}

			return false;
		}

		return true;
	}

	private function get_woocomerce_plugin_info() {
		if ( function_exists( 'wc' ) && defined( 'WC_PLUGIN_FILE' ) ) {
			return array( 'version' => WooCommerce::instance()->version );
		}

		return null;
	}
}
