<?php

use Gaufrette\Filesystem;

class Brizy_Admin_OptimizeImages {

	const PAGE_KEY = 'editor-optimize-images';

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
		$this->screenName = add_submenu_page( Brizy_Admin_Settings::menu_slug(),
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

		if ( ! $tab ) {
			echo $this->get_default_tab( $context );
		} else if ( $tab == 'shortpixel' ) {
			echo $this->get_shortpixel_tab( $context );
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
		wp_redirect( menu_page_url( $this->menu_slug(), false ) . ( $tab ? "&tab={$tab}" : '' ) );
		exit;
	}

	public function settings_submit() {
		if ( ! $_POST['tab'] ) {
			$this->optimizer_default_submit();
		} else if ( $_POST['tab'] === 'shortpixel' ) {
			$this->optimizer_shortpixel_submit();
		}
	}

	private function optimizer_default_submit() {

		$settings     = Brizy_Editor_Project::get()->getImageOptimizerSettings();
		$shortpixelId = Brizy_Editor_Asset_Optimize_ShortpixelOptimizer::getId();
		$bunnyId      = Brizy_Editor_Asset_Optimize_BunnyCdnOptimizer::ID;

		$settings[ $shortpixelId ]['active'] = false;
		$settings[ $bunnyId ]['active'] = isset( $_POST['active'] );

		$this->save_storage( $settings );
	}

	private function optimizer_shortpixel_submit() {

		$settings     = Brizy_Editor_Project::get()->getImageOptimizerSettings();
		$shortpixelId = Brizy_Editor_Asset_Optimize_ShortpixelOptimizer::getId();
		$bunnyId      = Brizy_Editor_Asset_Optimize_BunnyCdnOptimizer::ID;

		$settings[ $shortpixelId ]['active'] = isset( $_POST['active'] );

		if ( ! isset( $_POST['active'] ) ) {
			$this->save_storage( $settings );
			return;
		}

		try {

			$shortpixelOptimizer = new Brizy_Editor_Asset_Optimize_ShortpixelOptimizer( [ 'API_KEY' => $_POST['api_key'], 'lossy' => $_POST['lossy'] ] );

			if ( $shortpixelOptimizer->validateConfig() ) {

				$settings[ $bunnyId ]['active'] = false;
				$settings[ $shortpixelId ] = [
					'API_KEY'  => $_POST['api_key'],
					'lossy'    => $_POST['lossy'],
					'active'   => true
				];

				$this->save_storage( $settings );

			} else {
				Brizy_Admin_Flash::instance()->add_error( 'Invalid Shortpixel license provided.' );
			}

		} catch ( Exception $e ) {
			Brizy_Admin_Flash::instance()->add_error( $e->getMessage() );
		}
	}

	private function save_storage( $settings ) {
		try {
			Brizy_Editor_Project::get()->setImageOptimizerSettings( $settings );
			Brizy_Editor_Project::get()->saveStorage();
			Brizy_Admin_Flash::instance()->add_success( 'Settings are saved successfully.' );
		} catch (Exception $e) {
			Brizy_Admin_Flash::instance()->add_error( $e->getMessage() );
		}
	}

	private function get_shortpixel_tab( $context ) {
		$settings = Brizy_Editor_Project::get()->getImageOptimizerSettings();
		$id       = Brizy_Editor_Asset_Optimize_ShortpixelOptimizer::getId();
		$settings = isset( $settings[ $id ] ) ? $settings[ $id ] : [];
		$active   = isset( $settings['active'] ) ? $settings['active'] : false;

		$context['active']          = ! empty( $active );
		$context['shortpixel_link'] = apply_filters( 'brizy_shortpixel_api_key_link', 'https://shortpixel.com/otp/af/QDDDRHB707903' );
		$context['settings']        = $settings ? $settings : [ 'API_KEY' => '', 'lossy' => 1 ];

		if ( $active ) {
			$brizy_editor_project = Brizy_Editor_Project::get();
			$urlBuilder           = new Brizy_Editor_UrlBuilder( $brizy_editor_project );
			$brizy_upload_path    = $urlBuilder->brizy_upload_path();
			$adapter              = new Brizy_Admin_Guafrette_LocalAdapter( $brizy_upload_path );
			$filesystem           = new Filesystem( $adapter );

			$brizy_ids = Brizy_Editor_Post::get_all_brizy_post_ids();
			$urls      = [];
			foreach ( $brizy_ids as $id ) {
				try {
					$urls = $this->extractUrlFromPage( $urls, $id, $filesystem, $brizy_editor_project );
				} catch ( Exception $e ) {
					continue;
				}
			}

			$urls = array_unique( $urls );

			$context['urls']      = $urls;
			$context['count']     = count( $urls );
			$context['svgObject'] = Brizy_Editor_Asset_StaticFile::get_asset_content( str_replace( '/', DIRECTORY_SEPARATOR, BRIZY_PLUGIN_PATH . "/admin/static/img/spinner.svg" ) );
			$context['svg']       = str_replace( '/', DIRECTORY_SEPARATOR, BRIZY_PLUGIN_URL . "/admin/static/img/spinner.svg#circle" );
		}

		return $this->twig->render( 'shortpixel-tab.html.twig', $context );
	}

	private function get_default_tab( $context ) {
		$settings     = Brizy_Editor_Project::get()->getImageOptimizerSettings();
		$optimezer_id = Brizy_Editor_Asset_Optimize_BunnyCdnOptimizer::ID;

		$context['active'] = ! empty( $settings[ $optimezer_id ]['active'] );

		return $this->twig->render( 'optimizer-settings.html.twig', $context );
	}

	private function extractUrlFromPage( $urls, $postId, $filesystem, $project ) {
		$storage = Brizy_Editor_Storage_Post::instance( $postId );
		$data    = $storage->get( Brizy_Editor_Post::BRIZY_POST, false );

		if ( ! isset( $data['compiled_html'] ) ) {
			return $urls;
		}

		$content = base64_decode( $data['compiled_html'] );

		$content = Brizy_SiteUrlReplacer::restoreSiteUrl( $content );

		$closure = function ( $processors ) {
			foreach ( $processors as $i => $processor ) {
				if ( $processor instanceof Brizy_Editor_Asset_MediaAssetProcessor ) {
					unset( $processors[ $i ] );

					return $processors;
				}
			}

			return $processors;
		};

		add_filter( 'brizy_content_processors', $closure );

		$content = apply_filters( 'brizy_content', $content, $project, get_post( $postId ) );

		remove_filter( 'brizy_content_processors', $closure );

		return $this->extract_media_urls( $urls, $content, $filesystem );
	}

	/**
	 * @param $content
	 * @param Filesystem $filesystem
	 *
	 * @return array
	 */
	private function extract_media_urls( $urls, $content, $filesystem ) {

		global $wpdb;

		$pt = $wpdb->posts;
		$mt = $wpdb->postmeta;

		$site_url = str_replace( [ 'http://', 'https://', '/', '.' ], [ '', '', '\/', '\.' ], home_url() );

		//preg_match_all( '/' . $site_url . '\/?(\?' . Brizy_Public_CropProxy::ENDPOINT . '=(.[^"\',\s)]*))/im', $content, $matches );
		$endpoint = Brizy_Editor::prefix( Brizy_Public_CropProxy::ENDPOINT );
		preg_match_all( '/(http|https):\/\/' . $site_url . '\/?(\?' . $endpoint . '=(.[^"\',\s)]*))/im', $content, $matches );

		if ( ! isset( $matches[0] ) || count( $matches[0] ) == 0 ) {
			return $urls;
		}

		$time           = time();
		$t              = null;
		$attachmentUids = [];
		$uniqueUrls     = array_unique( $matches[0] );
		foreach ( $uniqueUrls as $i => $url ) {

			$parsed_url = parse_url( html_entity_decode( $url ) );

			if ( ! isset( $parsed_url['query'] ) ) {
				continue;
			}

			parse_str( $parsed_url['query'], $params );

			if ( ! isset( $params[ $endpoint ] ) ) {
				continue;
			}

			$mediaUid = $params[ $endpoint ];

			//if ( strpos( $mediaUid, 'wp-' ) !== false ) {
			$attachmentUids[] = [
				'url'          => $url,
				'parsed_url'   => $parsed_url,
				'parsed_query' => $params,
				'uid'          => $mediaUid,
				'uidQuery'     => "'{$mediaUid}'"
			];
			//}
		}

		if ( count( $attachmentUids ) === 0 ) {
			return $urls;
		}

		$uids_subquery = implode( ',', array_unique( array_map( function ( $o ) {
			return $o['uidQuery'];
		}, $attachmentUids ) ) );

		$query = "SELECT 
						{$pt}.ID,
						{$mt}.meta_value AS UID
					FROM {$pt}
						INNER JOIN {$mt} ON ( {$pt}.ID = {$mt}.post_id AND {$mt}.meta_key = 'brizy_attachment_uid' ) AND {$mt}.meta_value IN (" . $uids_subquery . ")
					WHERE 
						 {$pt}.post_type = 'attachment'
					ORDER BY {$pt}.post_date DESC";

		$attachmentIds = $wpdb->get_results( $query );

		$attachmentUids = array_map( function ( $o ) use ( $attachmentIds ) {
			foreach ( $attachmentIds as $row ) {
				if ( $row->UID == $o['uid'] ) {
					$o['attachmentID'] = $row->ID;

					return $o;
				}
			}

			return $o;
		}, $attachmentUids );


		foreach ( $attachmentUids as $uidRes ) {

			$parsed_url = $uidRes['parsed_url'];

			if ( ! isset( $parsed_url['query'] ) || ! isset( $uidRes['attachmentID'] ) ) {
				continue;
			}

			$params = $uidRes['parsed_query'];


			$media_url   = get_attached_file( $uidRes['attachmentID'] );
			$brizy_media = basename( $media_url );

			$wp_imageFullName = sprintf( "%s/assets/images/%s/optimized/%s", $params[ Brizy_Editor::prefix( '_post' ) ], $params[ Brizy_Editor::prefix( '_crop' ) ], $brizy_media );

			if ( ! $filesystem->has( $wp_imageFullName ) ) {
				$urls[] = $uidRes['url'] . "&brizy_optimize=1&t=" . $time;
			}
		}

		return $urls;
	}

	/**
	 * @return array
	 */
	private function getDefaultViewContext() {
		$context = [
			'tab_list' => $this->get_tabs(),
			'nonce'    => wp_nonce_field( - 1, "_wpnonce", true, false )
		];

		return $context;
	}

	/**
	 * @return string|void
	 */
	private function get_selected_tab() {
		return empty( $_REQUEST['tab'] ) ? null : esc_attr( $_REQUEST['tab'] );
	}

	/**
	 * @return mixed|void
	 */
	private function get_tabs() {
		$selected_tab = $this->get_selected_tab();
		$tabs         = [
			[
				'id'          => '',
				'label'       => __( 'Default', 'brizy' ),
				'is_selected' => ! $selected_tab,
				'href'        => menu_page_url( self::menu_slug(), false )
			],
			[
				'id'          => '',
				'label'       => __( 'Shortpixel', 'brizy' ),
				'is_selected' => $selected_tab,
				'href'        => menu_page_url( self::menu_slug(), false ) . "&tab=shortpixel"
			],
		];

		return apply_filters( 'brizy_optimizer_tabs', $tabs );
	}

}
