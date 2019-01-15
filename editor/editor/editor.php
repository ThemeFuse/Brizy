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
		$ruleMatches         = array();

		if ( ! is_null( $this->post ) ) {
			$wp_post_id        = $this->post->get_wp_post()->ID;
			$preview_post_link = $this->getPreviewUrl( $this->post->get_wp_post() );

			$change_template_url = set_url_scheme( admin_url( 'admin-post.php?post=' . $this->get_post()->get_parent_id() . '&action=_brizy_change_template' ) );
			$templates           = apply_filters( "brizy:templates", $this->post->get_templates() );
			$isTemplate          = $this->post->get_wp_post()->post_type == Brizy_Admin_Templates::CP_TEMPLATE;
		}

		$post_thumbnail = $this->getThumbnailData( $wp_post_id );


		if ( $isTemplate ) {
			$rule_manager   = new Brizy_Admin_Rules_Manager();
			$template_rules = $rule_manager->getRules( $wp_post_id );

			foreach ( $template_rules as $rule ) {
				/**
				 * @var Brizy_Admin_Rule $rule ;
				 */
				$ruleMatches[] = array(
					'type'       => $rule->getType(),
					'group'      => $rule->getAppliedFor(),
					'entityType' => $rule->getEntityType(),
					'values'     => $rule->getEntityValues()
				);
			}
		} else {
			$ruleMatches[] = array(
				'type'       => Brizy_Admin_Rule::TYPE_INCLUDE,
				'group'      => Brizy_Admin_Rule::POSTS,
				'entityType' => $this->post->get_wp_post()->post_type,
				'values'     => array( $wp_post_id )
			);
		}

		$config    = array(
			'user'            => array( 'role' => 'admin' ),
			'project'         => array(
				'id' => $this->project->getId()
			),
			'urls'            => array(
				'site'             => home_url(),
				'api'              => home_url( '/wp-json/v1' ),
				'assets'           => $this->urlBuilder->editor_build_url(),
				'image'            => $this->urlBuilder->external_media_url() . "",
				'blockThumbnails'  => $this->urlBuilder->external_asset_url( 'template/img-block-thumbs' ) . "",
				'templateIcons'    => $this->urlBuilder->proxy_url( 'template/icons' ),
				'templateFonts'    => 'https://app.brizy.io/fonts/public?path=' . BRIZY_EDITOR_VERSION,
				'pagePreview'      => $preview_post_link,
				'about'            => __bt( 'about-url', apply_filters( 'brizy_about_url', Brizy_Config::ABOUT_URL ) ),
				'backToDashboard'  => get_edit_post_link( $wp_post_id, null ),

				// wp specific
				'changeTemplate'   => $change_template_url,
				'upgradeToPro'     => __bt( 'upgrade-url', apply_filters( 'brizy_upgrade_to_pro_url', Brizy_Config::UPGRADE_TO_PRO_URL ) ),
				'support'          => __bt( 'support-url', apply_filters( 'brizy_support_url', Brizy_Config::SUPPORT_URL ) ),
				'pluginSettings'   => admin_url( 'admin.php?page=' . Brizy_Admin_Settings::menu_slug() ),
				'dashboardNavMenu' => admin_url( 'nav-menus.php' ),
			),
			'form'            => array(
				'submitUrl' => add_query_arg( 'action', 'brizy_submit_form', set_url_scheme( admin_url( 'admin-ajax.php' ) ) )
			),
			'serverTimestamp' => time(),
			'menuData'        => $this->get_menu_data(),
			'wp'              => array(
				'permalink'       => get_permalink( $wp_post_id ),
				'page'            => $wp_post_id,
				'ruleMatches'     => $ruleMatches,
				'featuredImage'   => $post_thumbnail,
				'pageAttachments' => array( 'images' => $this->get_page_attachments() ),
				'templates'       => $templates,
				'api'             => array(
					'hash' => wp_create_nonce( Brizy_Editor_API::nonce ),
					'url'  => set_url_scheme( admin_url( 'admin-ajax.php' ) ),

					'getPage'    => Brizy_Editor_API::AJAX_GET,
					'updatePage' => Brizy_Editor_API::AJAX_UPDATE,

					'getGlobals' => Brizy_Editor_API::AJAX_GET_GLOBALS,
					'setGlobals' => Brizy_Editor_API::AJAX_SET_GLOBALS,

					'getGlobalBlockList'   => Brizy_Admin_Blocks_Api::CREATE_GET_GLOBAL_BLOCKS_ACTION,
					'createGlobalBlock'    => Brizy_Admin_Blocks_Api::CREATE_GLOBAL_BLOCK_ACTION,
					'updateGlobalBlock'    => Brizy_Admin_Blocks_Api::UPDATE_GLOBAL_BLOCK_ACTION,
					'deleteGlobalBlock'    => Brizy_Admin_Blocks_Api::DELETE_GLOBAL_BLOCK_ACTION,
					'getRuleGroupList'     => Brizy_Admin_Templates::RULE_GROUP_LIST,
					'createRule'           => Brizy_Admin_Rules_Api::CREATE_RULE_ACTION,
					'createRules'          => Brizy_Admin_Rules_Api::CREATE_RULES_ACTION,
					'deleteRule'           => Brizy_Admin_Rules_Api::DELETE_RULE_ACTION,
					'getRuleList'          => Brizy_Admin_Rules_Api::LIST_RULE_ACTION,
					'updateBlockPositions' => Brizy_Admin_Blocks_Api::UPDATE_BLOCK_POSITIONS_ACTION,

					'getSavedBlockList' => Brizy_Admin_Blocks_Api::CREATE_GET_SAVED_BLOCKS_ACTION,
					'createSavedBlock'  => Brizy_Admin_Blocks_Api::CREATE_SAVED_BLOCK_ACTION,
					'updateSavedBlock'  => Brizy_Admin_Blocks_Api::UPDATE_SAVED_BLOCK_ACTION,
					'deleteSavedBlock'  => Brizy_Admin_Blocks_Api::DELETE_SAVED_BLOCK_ACTION,

					'media'         => Brizy_Editor_API::AJAX_MEDIA,
					'downloadMedia' => Brizy_Editor_API::AJAX_DOWNLOAD_MEDIA,
					'getMediaUid'   => Brizy_Editor_API::AJAX_MEDIA_METAKEY,


					'saveBlockScreenshot' => Brizy_Editor_BlockScreenshotApi::AJAX_SAVE_BLOCK_SCREENSHOT,

					'getSidebars'      => Brizy_Editor_API::AJAX_SIDEBARS,
					'shortcodeContent' => Brizy_Editor_API::AJAX_SHORTCODE_CONTENT,
					'getMenus'         => Brizy_Editor_API::AJAX_GET_MENU_LIST,
					'getTerms'         => Brizy_Editor_API::AJAX_GET_TERMS,

					//'ping'                       => Brizy_Editor_API::AJAX_PING, // ???
					//'buildContent'               => Brizy_Editor_API::AJAX_BUILD, // ???
					//'sidebarContent'             => Brizy_Editor_API::AJAX_SIDEBAR_CONTENT, // ???
					//'shortcodeList'              => Brizy_Editor_API::AJAX_SHORTCODE_LIST, // ???
					//'getTemplates'               => Brizy_Editor_API::AJAX_GET_TEMPLATES, // ???
					//'getInternalLinks'           => Brizy_Editor_API::AJAX_GET_INTERNAL_LINKS, // ???
					//'updatePost'                 => Brizy_Editor_API::AJAX_SAVE_TRIGGER, // ???
					//'savePage'                   => Brizy_Editor_API::AJAX_SAVE_TRIGGER, // ???
					'getPostObjects'             => Brizy_Editor_API::AJAX_GET_POST_OBJECTS, // ???
					//'getTaxonomies'              => Brizy_Editor_API::AJAX_GET_TAXONOMIES, // ??

					'setFeaturedImage'           => Brizy_Editor_API::AJAX_SET_FEATURED_IMAGE,
					'setFeaturedImageFocalPoint' => Brizy_Editor_API::AJAX_SET_FEATURED_IMAGE_FOCAL_POINT,
					'removeFeaturedImage'        => Brizy_Editor_API::AJAX_REMOVE_FEATURED_IMAGE,

					//'getDefaultForm'             => Brizy_Editor_Forms_Api::AJAX_GET_DEFAULT_FORM, // ???
					'getForm'                    => Brizy_Editor_Forms_Api::AJAX_GET_FORM,
					'createForm'                 => Brizy_Editor_Forms_Api::AJAX_CREATE_FORM,
					'deleteForm'                 => Brizy_Editor_Forms_Api::AJAX_DELETE_FORM,
					//'submitForm'        => Brizy_Editor_Forms_Api::AJAX_SUBMIT_FORM, // ???
					'getIntegration'             => Brizy_Editor_Forms_Api::AJAX_GET_INTEGRATION,
					'createIntegration'          => Brizy_Editor_Forms_Api::AJAX_CREATE_INTEGRATION,
					'updateIntegration'          => Brizy_Editor_Forms_Api::AJAX_UPDATE_INTEGRATION,
					'deleteIntegration'          => Brizy_Editor_Forms_Api::AJAX_DELETE_INTEGRATION,

					//'updateMenuData'             => Brizy_Editor_API::AJAX_UPDATE_MENU_DATA, // ???
					//'updateMenuItemData'         => Brizy_Editor_API::AJAX_UPDATE_MENU_ITEM_DATA, // ???
				),
				'plugins'         => array(
					'dummy'       => true,
					'woocommerce' => $this->get_woocomerce_plugin_info(),
				),
				'hasSidebars'     => count( $wp_registered_sidebars ) > 0,
				'l10n'            => (object) Brizy_Public_EditorBuild_Texts::get_editor_texts(),
				'pageData'        => apply_filters( 'brizy_page_data', array() ),
				'isTemplate'      => $isTemplate
			),
			'applications'    => array(
				'form' => array(
					'submitUrl' => add_query_arg( 'action', 'brizy_submit_form', set_url_scheme( admin_url( 'admin-ajax.php' ) ) )
				)
			),
			'menuData'        => $this->get_menu_data(),
			'branding'        => array( 'brizy' => __bt( 'brizy', 'Brizy' ) )
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


	private function get_menu_data() {
		$menus     = wp_get_nav_menus();
		$menu_data = array();

		foreach ( $menus as $menu ) {

			$custom_menu_data = get_term_meta( $menu->term_id, 'brizy_data', true );

			$menu_uid = get_term_meta( $menu->term_id, 'brizy_uid', true );
			if ( ! $menu_uid ) {
				$menu_uid = md5( $menu->term_id . time() );
				update_term_meta( $menu->term_id, 'brizy_uid', $menu_uid );
			}

			$amenu = array(
				'id'    => $menu_uid,
				'name'  => $menu->name,
				'items' => array()
			);

			$amenu = (object) array_merge( $amenu, get_object_vars( is_object( $custom_menu_data ) ? $custom_menu_data : (object) array() ) );

			$menu_items = wp_get_nav_menu_items( $menu->term_id );

			$menu_items = $this->get_menu_tree( $menu_items );

			if ( count( $menu_items ) > 0 ) {
				$amenu->items = $menu_items;
			}

			$menu_data[] = $amenu;
		}

		return $menu_data;
	}

	/**
	 * @param $items
	 * @param int $parent
	 *
	 * @return array
	 */
	private function get_menu_tree( $items, $parent = 0 ) {
		$result_items = array();

		foreach ( $items as $item ) {
			if ( (int) $item->menu_item_parent !== $parent ) {
				continue;
			}

			$menu_uid = get_post_meta( $item->ID, 'brizy_post_uid', true );

			if ( ! $menu_uid ) {
				$menu_uid = md5( $item->ID . time() );
				update_post_meta( $item->ID, 'brizy_post_uid', $menu_uid );
			}

			$megaMenuItems = $this->getMegaMenuItems();

			$menu_data = get_post_meta( $item->ID, 'brizy_data', true );

			$item_value = array(
				'id'            => $menu_uid,
				'title'         => $item->title,
				'url'           => $item->url,
				'megaMenuItems' => $megaMenuItems,
				'description'   => $item->post_content,
				'position'      => $item->menu_order,
				'attrTitle'     => $item->post_excerpt,
				'target'        => get_post_meta( $item->ID, '_menu_item_target', true ),
				'classes'       => get_post_meta( $item->ID, '_menu_item_classes', true ),
				'xfn'           => get_post_meta( $item->ID, '_menu_item_xfn', true ),
			);

			$an_item = (object) array(
				'type' => 'MenuItem',
			);

			$an_item->value = (object) array_merge( $item_value, get_object_vars( is_object( $menu_data ) ? $menu_data : (object) array() ) );

			$child_items = $this->get_menu_tree( $items, $item->ID );

			$an_item->value->items = array();

			if ( count( $child_items ) > 0 ) {
				$an_item->value->items = $child_items;
			}

			$result_items[] = $an_item;
		}

		return $result_items;
	}

	/**
	 * @return array
	 */
	private function getMegaMenuItems() {

		return array(
			(object) ( array(
				'type'  => "SectionMegaMenu",
				'value' => (object) array( 'items' => array() )
			) )
		);
	}
}
