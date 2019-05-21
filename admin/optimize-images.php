<?php

use Gaufrette\Filesystem;

class Brizy_Admin_OptimizeImages {

	const PAGE_KEY = 'brizy-optimize-images';

	/**
	 * @var Brizy_TwigEngine
	 */
	private $twig;

	/**
	 * @var string
	 */
	private $screenName;

	/**
	 * @return Brizy_Admin_OptimizeImages
	 */
	public static function _init() {
		static $instance;

		if ( ! $instance ) {
			$instance = new self();
		}

		return $instance;
	}

	/**
	 * @return string
	 */
	public static function menu_slug() {
		return self::PAGE_KEY;
	}

	/**
	 * Brizy_Admin_OptimizeImages constructor.
	 */
	public function __construct() {
		add_action( 'admin_menu', array( $this, 'addSubmenuPage' ), 11 );
		add_action( 'current_screen', array( $this, 'action_validate_form_submit' ) );
		add_action( 'brizy_optimizer_submit', array( $this, 'settings_submit' ) );
		$this->twig = Brizy_TwigEngine::instance( BRIZY_PLUGIN_PATH . "/admin/views/optimizer/" );
	}

	public function addSubmenuPage() {
		$this->screenName  = add_submenu_page( Brizy_Admin_Settings::menu_slug(),
			__( 'Optimize Images' ),
			__( 'Optimize Images' ),
			'manage_options',
			self::menu_slug(),
			array( $this, 'render' )
		);
	}

	public function render() {
		$context = $this->getDefaultViewContext();
		$tab     = $this->get_selected_tab();
		switch ( $tab ) {
			default:
			case 'general':
				echo $this->get_general_tab( $context );
				break;
			case 'settings':
				echo $this->get_settings_tab( $context );
				break;

		}
	}

	/**
	 * @internal
	 **/
	public function action_validate_form_submit() {

		$screen = get_current_screen();

		if ( $this->screenName != $screen->id ) {
			return;
		}

		if ( count( $_POST ) == 0 ) {
			return;
		}

		if ( ! isset( $_POST['_wpnonce'] ) || ! wp_verify_nonce( $_POST['_wpnonce'] ) ) {
			return;
		}

		do_action( 'brizy_optimizer_submit' );
		$tab = $this->get_selected_tab();
		wp_redirect( menu_page_url( $this->menu_slug(), false ) . ( $tab ? '&tab=' . $tab : '' ) );
		exit;
	}


	private function get_general_tab( $context ) {
		$settings          = Brizy_Editor_Project::get()->getImageOptimizerSettings();
		$urlBuilder        = new Brizy_Editor_UrlBuilder( Brizy_Editor_Project::get() );
		$brizy_upload_path = $urlBuilder->brizy_upload_path();
		$adapter           = new Brizy_Admin_Guafrette_LocalAdapter( $brizy_upload_path );
		$filesystem        = new Filesystem( $adapter );

		$brizy_ids = Brizy_Editor_Post::get_all_brizy_post_ids();
		$urls      = array();
		foreach ( $brizy_ids as $id ) {
			try {
				$brizyPost = Brizy_Editor_Post::get( $id );

				if ( ! $brizyPost->get_compiled_html() ) {
					$content = $brizyPost->get_compiled_html_body();
				} else {
					$compiled_page = $brizyPost->get_compiled_page();
					$content       = $compiled_page->get_head() . $compiled_page->get_body();
				}

				$content = Brizy_SiteUrlReplacer::restoreSiteUrl( $content );

				$content = apply_filters( 'brizy_content', $content, Brizy_Editor_Project::get(), $brizyPost->get_wp_post() );

				$urls = array_merge( $urls, $this->extract_media_urls( $content, $filesystem ) );
			} catch ( Exception $e ) {
				continue;
			}
		}

		$urls = array_unique( $urls );

		$context['urls']         = $urls;
		$context['count']        = count( $urls );
		$context['svgObject']    = file_get_contents( str_replace( '/', DIRECTORY_SEPARATOR, BRIZY_PLUGIN_PATH . "/admin/static/img/spinner.svg" ) );
		$context['svg']          = str_replace( '/', DIRECTORY_SEPARATOR, BRIZY_PLUGIN_URL . "/admin/static/img/spinner.svg#circle" );
		$context['submit_label'] = __( 'Optimize images' );
		$context['enabled']      = ( isset( $settings['shortpixel']['API_KEY'] ) && $settings['shortpixel']['API_KEY'] != '' ) ? 1 : 0;


		return $this->twig->render( 'optimizer-general.html.twig', $context );
	}

	public function settings_submit() {

		switch ( $_POST['tab'] ) {
			case 'settings':
				switch ( $_POST['optimizer'] ) {
					case Brizy_Editor_Asset_Optimize_ShortpixelOptimizer::ID:
						$this->shortpixel_settings_submit();
						break;
				}
				break;
		}
	}

	private function shortpixel_settings_submit() {
		$settings = Brizy_Editor_Project::get()->getImageOptimizerSettings();

		$shortpixelSettings = $settings[ Brizy_Editor_Asset_Optimize_ShortpixelOptimizer::getId() ] = array(
			'API_KEY' => $_POST['api_key'],
			'lossy'   => $_POST['lossy']
		);

		try {
			$shortpixelOptimizer = new Brizy_Editor_Asset_Optimize_ShortpixelOptimizer( $shortpixelSettings );

			if ( ! $shortpixelSettings['API_KEY'] ) {
				Brizy_Admin_Flash::instance()->add_warning( 'You have disabled Shortpixel.' );
				Brizy_Editor_Project::get()->setImageOptimizerSettings( $settings );
				Brizy_Editor_Project::get()->save();

				return;
			}

			if ( $shortpixelOptimizer->validateConfig() ) {
				Brizy_Editor_Project::get()->setImageOptimizerSettings( $settings );
				Brizy_Editor_Project::get()->save();

				Brizy_Admin_Flash::instance()->add_success( 'Settings saved.' );
			} else {
				Brizy_Admin_Flash::instance()->add_error( 'Invalid Shortpixel license provided.' );

			}
		} catch ( Exception $e ) {
			Brizy_Admin_Flash::instance()->add_error( $e->getMessage() );
		}
	}

	private function get_settings_tab( $context ) {
		$settings                = Brizy_Editor_Project::get()->getImageOptimizerSettings();
		$context['submit_label'] = __( 'Save' );
		$context['settings']     = isset( $settings['shortpixel'] ) ? $settings['shortpixel'] : array(
			'API_KEY' => '',
			"lossy"   => 1
		);

		return $this->twig->render( 'optimizer-settings.html.twig', $context );
	}

	/**
	 * @param $content
	 * @param Filesystem $filesystem
	 *
	 * @return array
	 */
	private function extract_media_urls( $content, $filesystem ) {

		$result   = array();
		$site_url = str_replace( array( 'http://', 'https://' ), '', home_url() );

		$site_url = str_replace( array( '/', '.' ), array( '\/', '\.' ), $site_url );

		preg_match_all( '/' . $site_url . '\/?(\?' . Brizy_Public_CropProxy::ENDPOINT . '=(.[^"\',\s)]*))/im', $content, $matches );
		preg_match_all( '/(http|https):\/\/' . $site_url . '\/?(\?' . Brizy_Public_CropProxy::ENDPOINT . '=(.[^"\',\s)]*))/im', $content, $matches );

		if ( ! isset( $matches[0] ) || count( $matches[0] ) == 0 ) {
			return $result;
		}

		$time = time();
		$t    = null;
		foreach ( $matches[0] as $i => $url ) {

			$parsed_url = parse_url( html_entity_decode( $matches[0][ $i ] ) );

			if ( ! isset( $parsed_url['query'] ) ) {
				continue;
			}

			parse_str( $parsed_url['query'], $params );


			if ( ! isset( $params[ Brizy_Public_CropProxy::ENDPOINT ] ) ) {
				continue;
			}

			$brizy_media = $params[ Brizy_Public_CropProxy::ENDPOINT ];

			if ( strpos( $params[ Brizy_Public_CropProxy::ENDPOINT ], 'wp-' ) !== false ) {
				$attachments = get_posts( array(
					'meta_key'   => 'brizy_attachment_uid',
					'meta_value' => $params[ Brizy_Public_CropProxy::ENDPOINT ],
					'post_type'  => 'attachment',
				) );

				if ( isset( $attachments[0] ) ) {
					$attachment = $attachments[0];
				}

				$media_url = get_attached_file( $attachment->ID );

				$brizy_media = basename( $media_url );

			}


			$wp_imageFullName = sprintf( "%s/assets/images/%s/optimized/%s", $params['brizy_post'], $params['brizy_crop'], $brizy_media );
			//$imageFullName = sprintf( "%s/assets/images/%s/optimized/%s", $params['brizy_post'], $params['brizy_crop'], $params['brizy_media'] );

			if ( ! $filesystem->has( $wp_imageFullName ) ) {
				$result[] = $url . "&brizy_optimize=1&t=" . $time;
			}

		}

		return $result;
	}

	/**
	 * @return array
	 */
	private function getDefaultViewContext() {
		$context = array(
			'tab_list' => $this->get_tabs(),
			'nonce'    => wp_nonce_field( - 1, "_wpnonce", true, false )
		);

		return $context;
	}

	/**
	 * @return string|void
	 */
	private function get_selected_tab() {
		return $tab = ( ! empty( $_REQUEST['tab'] ) ) ? esc_attr( $_REQUEST['tab'] ) : 'general';
	}

	/**
	 * @return mixed|void
	 */
	private function get_tabs() {
		$selected_tab = $this->get_selected_tab();
		$tabs         = array(
			array(
				'id'          => 'general',
				'label'       => 'Optimize',
				'is_selected' => is_null( $selected_tab ) || $selected_tab == 'general',
				'href'        => menu_page_url( self::menu_slug(), false ) . "&tab=general"
			),
			array(
				'id'          => 'settings',
				'label'       => 'Settings',
				'is_selected' => $selected_tab == 'settings',
				'href'        => menu_page_url( self::menu_slug(), false ) . "&tab=settings"
			),
		);

		return apply_filters( 'brizy_optimizer_tabs', $tabs );
	}


}