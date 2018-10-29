<?php

class Brizy_Editor_Editor_Editor {

	/**
	 * @var self
	 */
	static private $insance;

	/**
	 * @var array
	 */
	static private $config;

	/**
	 * @var Brizy_Editor_Post
	 */
	private $post;

	/**
	 * @var Brizy_Editor_Project
	 */
	private $project;

	/**
	 * @var Brizy_Editor_UrlBuilder
	 */
	private $urlBuilder;

	/**
	 * @param Brizy_Editor_Project $project
	 * @param Brizy_Editor_Post $post
	 *
	 * @return Brizy_Editor_Editor_Editor
	 */
	public static function get( $project, $post = null ) {

		if ( self::$insance ) {
			return self::$insance;
		}

		return self::$insance = new self( $project, $post );
	}

	/**
	 * Brizy_Editor_Editor_Editor constructor.
	 *
	 * @param Brizy_Editor_Project $project
	 * @param Brizy_Editor_Post $post
	 */
	public function __construct( $project, $post = null ) {
		$this->post       = $post;
		$this->project    = $project;
		$this->urlBuilder = new Brizy_Editor_UrlBuilder( $project, $post ? $post->get_parent_id() : null );
	}

	/**
	 * @return Brizy_Editor_Post
	 * @throws Exception
	 */
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

		if ( self::$config ) {
			return self::$config;
		}

		global $wp_registered_sidebars;

		$wp_post_id          = null;
		$preview_post_link   = null;
		$change_template_url = null;
		$templates           = null;
		$isTemplate          = false;

		if ( ! is_null( $this->post ) ) {
			$wp_post_id        = $this->post->get_wp_post()->ID;
			$preview_post_link = $this->getPreviewUrl( $this->post->get_wp_post() );

			$change_template_url = set_url_scheme( admin_url( 'admin-post.php?post=' . $this->get_post()->get_parent_id() . '&action=_brizy_change_template' ) );
			$templates           = apply_filters( "brizy:templates", $this->post->get_templates() );
			$isTemplate          = $this->post->get_wp_post()->post_type == Brizy_Admin_Templates::CP_TEMPLATE;
		}

		$post_thumbnail = $this->getThumbnailData( $wp_post_id );


		$config = array(
			'hosts'           => array(
				'api'     => Brizy_Config::EDITOR_HOST_API,
				'base'    => Brizy_Config::EDITOR_HOST_BASE,
				'origin'  => Brizy_Config::EDITOR_HOST_ORIGIN,
				'primary' => Brizy_Config::EDITOR_HOST_PRIMARY,
			),
			'project'         => $this->project->getId(),
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
				'base'                => Brizy_Config::getEditorBaseUrls() . "",
				'integration'         => Brizy_Config::EDITOR_INTEGRATION_URL,
				'image'               => $this->urlBuilder->external_media_url() . "",
				'origin'              => Brizy_Config::EDITOR_ORIGIN_URL,
				'pagePreview'         => $preview_post_link,
				'pluginSettings'      => admin_url( 'admin.php?page=' . Brizy_Admin_Settings::menu_slug() ),
				'change_template_url' => $change_template_url,
				'backToWordpress'     => get_edit_post_link( $wp_post_id, null ),
				'assets'              => $this->urlBuilder->editor_asset_url(),
				'pageAssets'          => $this->urlBuilder->page_upload_url(),
				'templateFonts'       => 'https://app.brizy.io/fonts/public?path=' . BRIZY_EDITOR_VERSION,
				'blockThumbnails'     => $this->urlBuilder->external_asset_url( 'template/img-block-thumbs' ) . "",
				'templateIcons'       => $this->urlBuilder->proxy_url( 'template/icons' ),
				'site'                => home_url(),
				'upgradeToPro'        => apply_filters( 'brizy_upgrade_to_pro_url', Brizy_Config::UPGRADE_TO_PRO_URL )
			),
			'user'            => array( 'role' => 'admin' ),
			'wp'              => array(
				'permalink'       => get_permalink( $wp_post_id ),
				'page'            => $wp_post_id,
				'featuredImage'   => $post_thumbnail,
				'pageAttachments' => array( 'images' => $this->get_page_attachments() ),
				'templates'       => $templates,
				'api'             => array(
					'hash'                       => wp_create_nonce( Brizy_Editor_API::nonce ),
					'url'                        => set_url_scheme( admin_url( 'admin-ajax.php' ) ),
					'globals'                    => array(
						'set' => Brizy_Editor_API::AJAX_SET_GLOBALS,
						'get' => Brizy_Editor_API::AJAX_GET_GLOBALS,
					),
					'media'                      => Brizy_Editor_API::AJAX_MEDIA,
					'ping'                       => Brizy_Editor_API::AJAX_PING,
					'getPage'                    => Brizy_Editor_API::AJAX_GET,
					'updatePage'                 => Brizy_Editor_API::AJAX_UPDATE,
					'getSidebars'                => Brizy_Editor_API::AJAX_SIDEBARS,
					'buildContent'               => Brizy_Editor_API::AJAX_BUILD,
					'sidebarContent'             => Brizy_Editor_API::AJAX_SIDEBAR_CONTENT,
					'shortcodeContent'           => Brizy_Editor_API::AJAX_SHORTCODE_CONTENT,
					'shortcodeList'              => Brizy_Editor_API::AJAX_SHORTCODE_LIST,
					'getTemplates'               => Brizy_Editor_API::AJAX_GET_TEMPLATES,
					'getInternalLinks'           => Brizy_Editor_API::AJAX_GET_INTERNAL_LINKS,
					'getMenus'                   => Brizy_Editor_API::AJAX_GET_MENU_LIST,
					'updatePost'                 => Brizy_Editor_API::AJAX_SAVE_TRIGGER,
					'savePage'                   => Brizy_Editor_API::AJAX_SAVE_TRIGGER,
					'getTerms'                   => Brizy_Editor_API::AJAX_GET_TERMS,
					'getTaxonomies'              => Brizy_Editor_API::AJAX_GET_TAXONOMIES,
					'downloadMedia'              => Brizy_Editor_API::AJAX_DOWNLOAD_MEDIA,
					'getMediaUid'                => Brizy_Editor_API::AJAX_MEDIA_METAKEY,
					'setFeaturedImage'           => Brizy_Editor_API::AJAX_SET_FEATURED_IMAGE,
					'setFeaturedImageFocalPoint' => Brizy_Editor_API::AJAX_SET_FEATURED_IMAGE_FOCAL_POINT,
					'removeFeaturedImage'        => Brizy_Editor_API::AJAX_REMOVE_FEATURED_IMAGE,
				),
				'plugins'         => array(
					'dummy'       => true,
					'woocommerce' => $this->get_woocomerce_plugin_info(),
				),
				'hasSidebars'     => count( $wp_registered_sidebars ) > 0,
				'l10n'            => Brizy_Languages_Texts::get_editor_texts(),
				'pageData'        => apply_filters( 'brizy_page_data', array() ),
				'isTemplate'      => $isTemplate
			),
			'applications'    => array(
				'form' => array(
					'iframeUrl' => $this->urlBuilder->application_form_url(),
					'apiUrl'    => Brizy_Config::BRIZY_APPLICATION_INTEGRATION_URL,
					'wpApiUrl'  => set_url_scheme( admin_url( 'admin-ajax.php' ) ),
					'submitUrl' => add_query_arg( 'action', 'brizy_submit_form', set_url_scheme( admin_url( 'admin-ajax.php' ) ) )
				)
			),
		);

		return self::$config = apply_filters( 'brizy_editor_config', $config );
	}

	private function get_page_attachments() {
		global $wpdb;
		$query = $wpdb->prepare(
			"SELECT 
					pm.*
				FROM 
					{$wpdb->prefix}postmeta pm 
				    JOIN {$wpdb->prefix}postmeta pm2 ON pm2.post_id=pm.post_id AND pm2.meta_key='brizy_post_uid' AND pm2.meta_value=%s
				WHERE pm.meta_key='brizy_attachment_uid'
				GROUP BY pm.post_id", $this->post->get_uid() );

		$results         = $wpdb->get_results( $query );
		$attachment_data = array();
		foreach ( $results as $row ) {
			$attachment_data[ $row->meta_value ] = true;
		}

		return (object) $attachment_data;
	}

	public function get_asset_url( $template_version = null ) {

		$upload_dir_info = wp_upload_dir( null, true );

		if ( is_null( $template_version ) ) {
			$template_version = BRIZY_EDITOR_VERSION;
		}

		return $upload_dir_info['baseurl'] . sprintf( Brizy_Config::BRIZY_WP_EDITOR_ASSET_PATH, $template_version );
	}

	private function get_woocomerce_plugin_info() {
		if ( function_exists( 'wc' ) && defined( 'WC_PLUGIN_FILE' ) ) {
			return array( 'version' => WooCommerce::instance()->version );
		}

		return null;
	}

	/**
	 * @param $wp_post_id
	 *
	 * @return array|null
	 */
	private function getThumbnailData( $wp_post_id ) {
		$post_thumbnail_id = get_post_thumbnail_id( $wp_post_id );
		$post_thumbnail    = "";

		if ( $post_thumbnail_id ) {
			$post_thumbnail_focal_point = get_post_meta( $wp_post_id, 'brizy_attachment_focal_point', true );

			if ( ! is_array( $post_thumbnail_focal_point ) ) {
				$post_thumbnail_focal_point = array( 'x' => "", 'y' => "" );
			}

			$post_thumbnail = array(
				'id'     => $post_thumbnail_id,
				'url'    => get_the_post_thumbnail_url( $wp_post_id ),
				'pointX' => isset( $post_thumbnail_focal_point['x'] ) ? $post_thumbnail_focal_point['x'] : "",
				'pointY' => isset( $post_thumbnail_focal_point['y'] ) ? $post_thumbnail_focal_point['y'] : "",
			);
		}

		return $post_thumbnail;
	}

	/**
	 * @param $wp_post
	 *
	 * @return null|string
	 * @throws Brizy_Editor_Exceptions_NotFound
	 * @throws Brizy_Editor_Exceptions_UnsupportedPostType
	 */
	private function getPreviewUrl( $wp_post ) {

		if ( $wp_post->post_type == Brizy_Admin_Templates::CP_TEMPLATE ) {

			$ruleManager = new Brizy_Admin_Rules_Manager();
			$rules       = $ruleManager->getRules( $wp_post->ID );
			$rule        = null;
			// find first include rule
			foreach ( $rules as $rule ) {
				/**
				 * @var Brizy_Admin_Rule $rule ;
				 */
				if ( $rule->getType() == Brizy_Admin_Rule::TYPE_INCLUDE ) {
					break;
				}
			}

			function addQueryStringToUrl( $link, $query ) {
				$parsedUrl = parse_url( $link );
				$separator = ( ! isset( $parsedUrl['query'] ) || $parsedUrl['query'] == null ) ? '?' : '&';
				$link      .= $separator . $query;

				return $link;
			}

			if ( $rule ) {

				switch ( $rule->getAppliedFor() ) {
					case  Brizy_Admin_Rule::POSTS :
						$args = array(
							'post_type' => $rule->getEntityType(),
						);

						if ( count( $rule->getEntityValues() ) ) {
							$args['post__in'] = $rule->getEntityValues();
						}

						$array = get_posts( $args );

						foreach ( $array as $p ) {

							if ( $p->post_typ == 'attachment' ) {
								return addQueryStringToUrl( get_attachment_link( $p->ID ), 'preview=1' );
							}

							if ( ! Brizy_Editor_Post::checkIfPostTypeIsSupported( $p->ID, false ) || ! Brizy_Editor_Post::get( $p )->uses_editor() ) {
								$wp_post = $p;
								break;
							}

						}
						break;
					case Brizy_Admin_Rule::TAXONOMY :
						$args = array(
							'taxonomy'   => $rule->getEntityType(),
							'hide_empty' => false,
						);
						if ( count( $rule->getEntityValues() ) ) {
							$args['term_taxonomy_id'] = $rule->getEntityValues();
						}

						$array = get_terms( $args );

						if ( count( $array ) == 0 ) {
							break;
						}
						$term = array_pop( $array );
						$link = get_term_link( $term );

						return addQueryStringToUrl( $link, 'preview=1' );
						break;
					case  Brizy_Admin_Rule::ARCHIVE :
						if ( $rule->getEntityType() ) {
							$link = get_post_type_archive_link( $rule->getEntityType() );

							return addQueryStringToUrl( $link, 'preview=1' );
						}

						global $wp_post_types;

						$archivePostTypes = array_filter( $wp_post_types, function ( $type ) {
							return $type->public && $type->show_ui && $type->has_archive;
						} );

						if ( count( $archivePostTypes ) == 0 ) {
							break;
						}

						$postTypes = array_pop( $archivePostTypes );

						$link = get_post_type_archive_link( $postTypes->name );

						return addQueryStringToUrl( $link, 'preview=1' );
						break;
					case  Brizy_Admin_Rule::TEMPLATE :

						//  array( 'title' => 'Author page', 'value' => 'author', 'groupValue' => Brizy_Admin_Rule::TEMPLATE ),
						//  array( 'title' => 'Search page', 'value' => 'search', 'groupValue' => Brizy_Admin_Rule::TEMPLATE ),
						//  array( 'title' => 'Home page', 'value' => 'front_page', 'groupValue' => Brizy_Admin_Rule::TEMPLATE ),
						//  array( 'title' => '404 page', 'value' => '404', 'groupValue' => Brizy_Admin_Rule::TEMPLATE ),
						//  array( 'title' => 'Archive page', 'value' => '', 'groupValue' => Brizy_Admin_Rule::ARCHIVE ),
						switch ( $rule->getEntityType() ) {
							case 'author':
								$authors = get_users();
								$author  = array_pop( $authors );
								$link    = get_author_posts_url( $author->ID );

								return addQueryStringToUrl( $link, 'preview=1' );
								break;

							case 'search':
								return addQueryStringToUrl( get_search_link( 'find-me' ), 'preview=1' );
								break;
							case '404':
								//return addQueryStringToUrl( get_post_permalink( new WP_Post((object)array("ID"=>time())) ), 'preview=1' );
								break;
							case 'front_page':
								return addQueryStringToUrl( home_url(), 'preview=1' );
								break;
						}

						break;
				}

			}
		}

		return get_preview_post_link( $wp_post, array(
			'preview_id'    => $wp_post->ID,
			'preview_nonce' => wp_create_nonce( 'post_preview_' . $wp_post->ID )
		) );
	}


}
