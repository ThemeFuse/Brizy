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
	public static function get( Brizy_Editor_Project $project, Brizy_Editor_Post $post ) {

		$postId = $post && $post->get_id() ? $post->get_id() : 0;
		if ( isset( self::$insance[ $postId ] ) ) {
			return self::$insance[ $postId ];
		}

		return self::$insance[ $postId ] = new self( $project, $post );
	}

	/**
	 * Brizy_Editor_Editor_Editor constructor.
	 *
	 * @param Brizy_Editor_Project $project
	 * @param Brizy_Editor_Post $post
	 */
	public function __construct( Brizy_Editor_Project $project, Brizy_Editor_Post $post = null ) {
		$this->post       = $post;
		$this->project    = $project;
		$this->urlBuilder = new Brizy_Editor_UrlBuilder( $project, $post ? $post->get_parent_id() : null );
	}

	/**
	 * @throws Exception
	 */
	public function config() {

		$cachePostId = $this->post ? $this->post->get_id() : 0;
		if ( isset( self::$config[ $cachePostId ] ) ) {
			return self::$config[ $cachePostId ];
		}

		global $wp_registered_sidebars;

		$wp_post_id          = null;
		$preview_post_link   = null;
		$change_template_url = null;
		$templates           = null;

		$parent_post_type  = get_post_type( $this->post->get_parent_id() );
		$wp_post_id        = $this->post->get_wp_post()->ID;
		$preview_post_link = $this->getPreviewUrl( $this->post->get_wp_post() );

		$change_template_url = set_url_scheme( admin_url( 'admin-post.php?post=' . $this->post->get_parent_id() . '&action=_brizy_change_template' ) );
		$templates           = $this->post->get_templates();
		$isTemplate          = $parent_post_type === Brizy_Admin_Templates::CP_TEMPLATE;
		$isPopup             = $parent_post_type === Brizy_Admin_Popups_Main::CP_POPUP;

		$config = array(
			'user'            => array( 'role' => 'admin' ),
			'project'         => array(
				'id' => $this->project->getId()
			),
			'urls'            => array(
				'site'               => home_url(),
				'api'                => home_url( '/wp-json/v1' ),
				'assets'             => $this->urlBuilder->editor_build_url(),
				'image'              => $this->urlBuilder->external_media_url() . "",
				'blockThumbnails'    => $this->urlBuilder->external_asset_url( 'thumbs' ) . "",
				'templateThumbnails' => $this->urlBuilder->external_asset_url( 'thumbs' ) . "",
				'templateIcons'      => $this->urlBuilder->proxy_url( 'editor/icons' ),
				'templateFonts'      => $this->urlBuilder->external_fonts_url(),
				'editorFonts'        => home_url(),
				'pagePreview'        => $preview_post_link,
				'about'              => __bt( 'about-url', apply_filters( 'brizy_about_url', Brizy_Config::ABOUT_URL ) ),
				'backToDashboard'    => get_edit_post_link( $wp_post_id, null ),

				// wp specific
				'changeTemplate'     => $change_template_url,
				'upgradeToPro'       => __bt( 'upgrade-url', apply_filters( 'brizy_upgrade_to_pro_url', Brizy_Config::UPGRADE_TO_PRO_URL ) ),
				'support'            => __bt( 'support-url', apply_filters( 'brizy_support_url', Brizy_Config::SUPPORT_URL ) ),
				'pluginSettings'     => admin_url( 'admin.php?page=' . Brizy_Admin_Settings::menu_slug() ),
				'dashboardNavMenu'   => admin_url( 'nav-menus.php' ),
				'customFile'         => home_url( '?brizy_attachment=' )
			),
			'form'            => array(
				'submitUrl' => '{{brizy_dc_ajax_url}}?action=' . Brizy_Editor_Forms_Api::AJAX_SUBMIT_FORM
			),
			'serverTimestamp' => time(),
			'menuData'        => $this->get_menu_data(),
			'wp'              => array(
				'permalink'       => get_permalink( $wp_post_id ),
				'page'            => $wp_post_id,
				'ruleMatches'     => $this->getTempalteRuleMatches( $isTemplate, $wp_post_id ),
				'featuredImage'   => $this->getThumbnailData( $wp_post_id ),
				'pageAttachments' => array( 'images' => $this->get_page_attachments() ),
				'templates'       => $templates,
				'api'             => array(
					'hash' => wp_create_nonce( Brizy_Editor_API::nonce ),
					'url'  => set_url_scheme( admin_url( 'admin-ajax.php' ) ),

					'getPage'    => Brizy_Editor_API::AJAX_GET,
					'updatePage' => Brizy_Editor_API::AJAX_UPDATE,

					'getProject'     => Brizy_Editor_API::AJAX_GET_PROJECT,
					'setProject'     => Brizy_Editor_API::AJAX_SET_PROJECT,
					'setProjectMeta' => Brizy_Editor_API::AJAX_UPDATE_EDITOR_META_DATA,

					'getGlobalBlockList'   => Brizy_Admin_Blocks_Api::GET_GLOBAL_BLOCKS_ACTION,
					'createGlobalBlock'    => Brizy_Admin_Blocks_Api::CREATE_GLOBAL_BLOCK_ACTION,
					'updateGlobalBlock'    => Brizy_Admin_Blocks_Api::UPDATE_GLOBAL_BLOCK_ACTION,
					'deleteGlobalBlock'    => Brizy_Admin_Blocks_Api::DELETE_GLOBAL_BLOCK_ACTION,
					'getRuleGroupList'     => Brizy_Admin_Templates::RULE_GROUP_LIST,
					'createRule'           => Brizy_Admin_Rules_Api::CREATE_RULE_ACTION,
					'createRules'          => Brizy_Admin_Rules_Api::CREATE_RULES_ACTION,
					'updateRules'          => Brizy_Admin_Rules_Api::UPDATE_RULES_ACTION,
					'deleteRule'           => Brizy_Admin_Rules_Api::DELETE_RULE_ACTION,
					'getRuleList'          => Brizy_Admin_Rules_Api::LIST_RULE_ACTION,
					'updateBlockPositions' => Brizy_Admin_Blocks_Api::UPDATE_BLOCK_POSITIONS_ACTION,

					'getSavedBlockList' => Brizy_Admin_Blocks_Api::GET_SAVED_BLOCKS_ACTION,
					'createSavedBlock'  => Brizy_Admin_Blocks_Api::CREATE_SAVED_BLOCK_ACTION,
					'updateSavedBlock'  => Brizy_Admin_Blocks_Api::UPDATE_SAVED_BLOCK_ACTION,
					'deleteSavedBlock'  => Brizy_Admin_Blocks_Api::DELETE_SAVED_BLOCK_ACTION,

					'media'              => Brizy_Editor_API::AJAX_MEDIA,
					'downloadMedia'      => Brizy_Editor_API::AJAX_DOWNLOAD_MEDIA,
					'getMediaUid'        => Brizy_Editor_API::AJAX_MEDIA_METAKEY,
					'getAttachmentUid'   => Brizy_Editor_API::AJAX_CREATE_ATTACHMENT_UID,
					'getServerTimeStamp' => Brizy_Editor_API::AJAX_TIMESTAMP,


					'createBlockScreenshot' => Brizy_Editor_BlockScreenshotApi::AJAX_CREATE_BLOCK_SCREENSHOT,
					'updateBlockScreenshot' => Brizy_Editor_BlockScreenshotApi::AJAX_UPDATE_BLOCK_SCREENSHOT,

					'getSidebars'      => Brizy_Editor_API::AJAX_SIDEBARS,
					'shortcodeContent' => Brizy_Editor_API::AJAX_SHORTCODE_CONTENT,
					'getMenus'         => Brizy_Editor_API::AJAX_GET_MENU_LIST,
					'getTerms'         => Brizy_Editor_API::AJAX_GET_TERMS,


					'getPostObjects' => Brizy_Editor_API::AJAX_GET_POST_OBJECTS, // ???

					'setFeaturedImage'           => Brizy_Editor_API::AJAX_SET_FEATURED_IMAGE,
					'setFeaturedImageFocalPoint' => Brizy_Editor_API::AJAX_SET_FEATURED_IMAGE_FOCAL_POINT,
					'removeFeaturedImage'        => Brizy_Editor_API::AJAX_REMOVE_FEATURED_IMAGE,

					'getForm'           => Brizy_Editor_Forms_Api::AJAX_GET_FORM,
					'createForm'        => Brizy_Editor_Forms_Api::AJAX_CREATE_FORM,
					'updateForm'        => Brizy_Editor_Forms_Api::AJAX_UPDATE_FORM,
					'deleteForm'        => Brizy_Editor_Forms_Api::AJAX_DELETE_FORM,
					'getIntegration'    => Brizy_Editor_Forms_Api::AJAX_GET_INTEGRATION,
					'createIntegration' => Brizy_Editor_Forms_Api::AJAX_CREATE_INTEGRATION,
					'updateIntegration' => Brizy_Editor_Forms_Api::AJAX_UPDATE_INTEGRATION,
					'deleteIntegration' => Brizy_Editor_Forms_Api::AJAX_DELETE_INTEGRATION,

					'createFont' => Brizy_Admin_Fonts_Api::AJAX_CREATE_FONT_ACTION,
					'deleteFont' => Brizy_Admin_Fonts_Api::AJAX_DELETE_FONT_ACTION,
					'getFonts'   => Brizy_Admin_Fonts_Api::AJAX_GET_FONTS_ACTION,

					'getAccount'    => Brizy_Editor_Accounts_Api::BRIZY_GET_ACCOUNT,
					'getAccounts'   => Brizy_Editor_Accounts_Api::BRIZY_GET_ACCOUNTS,
					'addAccount'    => Brizy_Editor_Accounts_Api::BRIZY_ADD_ACCOUNT,
					'updateAccount' => Brizy_Editor_Accounts_Api::BRIZY_UPDATE_ACCOUNT,
					'deleteAccount' => Brizy_Editor_Accounts_Api::BRIZY_DELETE_ACCOUNT,

					'validateRecaptchaAccount' => Brizy_Editor_Forms_Api::AJAX_VALIDATE_RECAPTCHA_ACCOUNT,

				),
				'plugins'         => array(
					'dummy'       => true,
					'woocommerce' => $this->get_woocomerce_plugin_info(),
				),
				'hasSidebars'     => count( $wp_registered_sidebars ) > 0,
				'l10n'            => $this->getTexts(),
				'pageData'        => apply_filters( 'brizy_page_data', array() ),
				'isTemplate'      => $isTemplate,
				'isGlobalPopup'   => $isPopup,
				'availableRoles'  => $this->roleList()
			),
			'applications'    => array(
				'form' => array(
					'submitUrl' => '{{brizy_dc_ajax_url}}?action=' . Brizy_Editor_Forms_Api::AJAX_SUBMIT_FORM
				),
			),
			'server'          => array(
				'maxUploadSize' => $this->fileUploadMaxSize()
			),
			'branding'        => array( 'brizy' => __bt( 'brizy', 'Brizy' ) ),
			'editorVersion'   => BRIZY_EDITOR_VERSION
		);

		$manager = new Brizy_Editor_Accounts_ServiceAccountManager( Brizy_Editor_Project::get() );

		$config = $this->addRecaptchaAccounts( $manager, $config );

		$config = $this->addSocialAccounts( $manager, $config );

		return self::$config[ $cachePostId ] = apply_filters( 'brizy_editor_config', $config );
	}

	/**
	 * @return object
	 */
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

	/**
	 * @return array|null
	 */
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


			if ( ! function_exists( 'addQueryStringToUrl' ) ) {
				function addQueryStringToUrl( $link, $query ) {
					$parsedUrl = parse_url( $link );
					$separator = ( ! isset( $parsedUrl['query'] ) || $parsedUrl['query'] == null ) ? '?' : '&';
					$link      .= $separator . $query;

					return $link;
				}
			}


			// find first include rule
			foreach ( $rules as $rule ) {
				/**
				 * @var Brizy_Admin_Rule $rule ;
				 */
				if ( $rule->getType() == Brizy_Admin_Rule::TYPE_INCLUDE ) {
					break;
				}
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

						$link = $this->getOneArchiveLink();

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
								return addQueryStringToUrl( get_home_url( null, (string) time() ), 'preview=1' );
								break;
							case 'home_page':
								$get_option = get_option( 'page_for_posts' );

								if ( $get_option ) {
									return addQueryStringToUrl( get_permalink( $get_option ), 'preview=1' );
								}
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

	/**
	 * @return array
	 */
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

	/**
	 * @param Brizy_Editor_Accounts_ServiceAccountManager $manager
	 * @param array $config
	 *
	 * @return array
	 */
	private function addRecaptchaAccounts( Brizy_Editor_Accounts_ServiceAccountManager $manager, array $config ) {
		$accounts = $manager->getAccountsByGroup( Brizy_Editor_Accounts_AbstractAccount::RECAPTCHA_GROUP );

		if ( isset( $accounts[0] ) && $accounts[0] instanceof Brizy_Editor_Accounts_RecaptchaAccount ) {
			$config['applications']['form']['recaptcha']['siteKey'] = $accounts[0]->getSiteKey();
		}

		return $config;
	}

	/**
	 * @param Brizy_Editor_Accounts_ServiceAccountManager $manager
	 * @param array $config
	 *
	 * @return array
	 */
	private function addSocialAccounts( Brizy_Editor_Accounts_ServiceAccountManager $manager, array $config ) {
		$accounts = $manager->getAccountsByGroup( Brizy_Editor_Accounts_AbstractAccount::SOCIAL_GROUP );

		foreach ( $accounts as $account ) {
			if ( isset( $account ) && $account instanceof Brizy_Editor_Accounts_SocialAccount ) {
				$config['applications'][ $account->getGroup() ][] = $account->convertToOptionValue();
			}
		}

		return $config;
	}


	private function fileUploadMaxSize() {
		static $max_size = - 1;

		if ( $max_size < 0 ) {
			// Start with post_max_size.
			$post_max_size = $this->parseSize( ini_get( 'post_max_size' ) );
			if ( $post_max_size > 0 ) {
				$max_size = number_format( $post_max_size / 1048576, 2 );
			}

			// If upload_max_size is less, then reduce. Except if upload_max_size is
			// zero, which indicates no limit.
			$upload_max = $this->parseSize( ini_get( 'upload_max_filesize' ) );
			if ( $upload_max > 0 && $upload_max < $max_size ) {
				$max_size = number_format( $upload_max / 1048576, 2 );
			}
		}

		return $max_size;
	}

	private function parseSize( $size ) {
		$unit = preg_replace( '/[^bkmgtpezy]/i', '', $size ); // Remove the non-unit characters from the size.
		$size = preg_replace( '/[^0-9\.]/', '', $size ); // Remove the non-numeric characters from the size.
		if ( $unit ) {
			// Find the position of the unit in the ordered string which is the power of magnitude to multiply a kilobyte by.
			return round( $size * pow( 1024, stripos( 'bkmgtpezy', $unit[0] ) ) );
		} else {
			return round( $size );
		}
	}

	/**
	 * @return array
	 */
	private function roleList() {
		$editable_roles = wp_roles()->roles;
		$editable_roles = apply_filters( 'editable_roles', $editable_roles );
		$roles          = array();
		foreach ( $editable_roles as $role => $details ) {
			$sub['role'] = esc_attr( $role );
			$sub['name'] = translate_user_role( $details['name'] );
			$roles[]     = $sub;
		}

		return $roles;
	}

	private function getOneArchiveLink( $args = '' ) {
		global $wpdb, $wp_locale;

		$defaults = array(
			'type'      => 'monthly',
			'limit'     => '',
			'order'     => 'DESC',
			'post_type' => 'post',
			'year'      => get_query_var( 'year' ),
			'monthnum'  => get_query_var( 'monthnum' ),
			'day'       => get_query_var( 'day' ),
			'w'         => get_query_var( 'w' ),
		);

		$r = wp_parse_args( $args, $defaults );

		$post_type_object = get_post_type_object( $r['post_type'] );
		if ( ! is_post_type_viewable( $post_type_object ) ) {
			return;
		}
		$r['post_type'] = $post_type_object->name;

		if ( '' == $r['type'] ) {
			$r['type'] = 'monthly';
		}

		if ( ! empty( $r['limit'] ) ) {
			$r['limit'] = absint( $r['limit'] );
			$r['limit'] = ' LIMIT ' . $r['limit'];
		}

		$order = strtoupper( $r['order'] );
		if ( $order !== 'ASC' ) {
			$order = 'DESC';
		}

		// this is what will separate dates on weekly archive links
		$archive_week_separator = '&#8211;';

		$sql_where = $wpdb->prepare( "WHERE post_type = %s AND post_status = 'publish'", $r['post_type'] );

		/**
		 * Filters the SQL WHERE clause for retrieving archives.
		 *
		 * @param string $sql_where Portion of SQL query containing the WHERE clause.
		 * @param array $r An array of default arguments.
		 *
		 * @since 2.2.0
		 *
		 */
		$where = apply_filters( 'getarchives_where', $sql_where, $r );

		/**
		 * Filters the SQL JOIN clause for retrieving archives.
		 *
		 * @param string $sql_join Portion of SQL query containing JOIN clause.
		 * @param array $r An array of default arguments.
		 *
		 * @since 2.2.0
		 *
		 */
		$join = apply_filters( 'getarchives_join', '', $r );

		$output = '';

		$last_changed = wp_cache_get_last_changed( 'posts' );

		$limit = $r['limit'];

		if ( 'monthly' == $r['type'] ) {
			$query = "SELECT YEAR(post_date) AS `year`, MONTH(post_date) AS `month`, count(ID) as posts FROM $wpdb->posts $join $where GROUP BY YEAR(post_date), MONTH(post_date) ORDER BY post_date $order $limit";
			$key   = md5( $query );
			$key   = "wp_get_archives:$key:$last_changed";
			if ( ! $results = wp_cache_get( $key, 'posts' ) ) {
				$results = $wpdb->get_results( $query );
				wp_cache_set( $key, $results, 'posts' );
			}
			if ( $results ) {
				foreach ( (array) $results as $result ) {
					$url = get_month_link( $result->year, $result->month );
					if ( 'post' !== $r['post_type'] ) {
						$url = add_query_arg( 'post_type', $r['post_type'], $url );
					}

					return $url;
				}
			}
		}
	}

	/**
	 * @return string
	 * @throws Exception
	 */
	private function getTexts() {
		if (BRIZY_DEVELOPMENT) {
			$brizy_public_editor_build_texts = '\Brizy_Public_EditorBuild_Dev_Texts';
		} else {
			$version = '';
			foreach ( explode( '-', BRIZY_EDITOR_VERSION ) as $tmp ) {
				$version .= ucfirst( $tmp );
			}
			$brizy_public_editor_build_texts = '\Brizy_Public_EditorBuild_' . $version . '_Texts';
		}

		if ( ! class_exists( $brizy_public_editor_build_texts ) ) {
			if ( BRIZY_DEVELOPMENT ) {
				throw new \Exception( 'You must build the editor first.' );
			} else {
				throw new \Exception( 'Unable to find class ' . $brizy_public_editor_build_texts );
			}
		}

		return (object) $brizy_public_editor_build_texts::get_editor_texts();
	}

	/**
	 * @param $isTemplate
	 * @param $wp_post_id
	 * @param array $ruleMatches
	 *
	 * @return array
	 * @throws Exception
	 */
	private function getTempalteRuleMatches( $isTemplate, $wp_post_id ) {

		$ruleMatches = array();

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

		return $ruleMatches;
	}
}
