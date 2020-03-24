<?php

class Brizy_Admin_Templates {

	const CP_TEMPLATE = 'brizy_template';
	const CP_TEMPLATES = 'brizy_templates';
	const RULE_LIST_VEIW = 'brizy_rule_list_view';
	const RULE_TAXONOMY_LIST = 'brizy_taxonomy_list';
	const RULE_CREATE = 'brizy_create';

	/**
	 * @var Brizy_Editor_Post
	 */
	private static $template;

	/**
	 * @var Brizy_Admin_Rules_Manager
	 */
	private $ruleManager;

	/**
	 * Brizy_Admin_Templates constructor.
	 */
	protected function __construct() {

		add_action( 'wp_loaded', array( $this, 'initializeActions' ) );

		$this->ruleManager = new Brizy_Admin_Rules_Manager();
	}

	/**
	 * @return Brizy_Editor_Post
	 */
	public static function getTemplate() {
		return self::$template;
	}

	public function initializeActions() {
		// do other stuff here
		if ( is_admin() ) {
			add_filter( 'post_updated_messages', array( $this, 'filterTemplateMessages' ) );
			add_action( 'add_meta_boxes', array( $this, 'registerTemplateMetaBox' ), 9 );
			add_action( 'transition_post_status', array( $this, 'actionTransitionPostStatus' ), 10, 3 );
			add_action( 'wp_ajax_' . self::RULE_LIST_VEIW, array( $this, 'getTemplateRuleBox' ) );
			add_filter( 'post_row_actions', array( $this, 'removeRowActions' ), 10, 1 );
			add_action( 'admin_init', array( $this, 'addTemplateRoleCaps' ), 10000 );
			add_action( 'admin_enqueue_scripts', array( $this, 'action_register_static' ) );
		} elseif ( ! defined( 'DOING_AJAX' ) && ! is_admin() ) {
			add_action( 'wp', array( $this, 'templateFrontEnd' ) );
			add_action( 'template_include', array( $this, 'templateInclude' ), 20000 );
		}
	}

	/**
	 * @return Brizy_Admin_Templates
	 */
	public static function _init() {
		static $instance;

		if ( ! $instance ) {
			$instance = new self();
		}

		return $instance;
	}

	function action_register_static() {

		if ( is_customize_preview() || get_post_type() !== Brizy_Admin_Templates::CP_TEMPLATE ) {
			return;
		}

		//  hyperapp.js is also used in PRO
		wp_enqueue_script(
			Brizy_Editor::get()->get_slug() . '-hyperapp-js',
			Brizy_Editor::get()->get_url( 'admin/static/js/hyperapp.js' ),
			array( 'jquery', 'underscore' ),
			Brizy_Editor::get()->get_version(),
			true
		);

		wp_enqueue_style(
			Brizy_Editor::get()->get_slug() . '-select2',
			Brizy_Editor::get()->get_url('vendor/select2/select2/dist/css/select2.min.css'),
			array(),
			true
		);

		wp_enqueue_script(
			Brizy_Editor::get()->get_slug() . '-select2',
			Brizy_Editor::get()->get_url('vendor/select2/select2/dist/js/select2.full.min.js'),
			array( 'jquery' )
		);

		wp_enqueue_script(
			Brizy_Editor::get()->get_slug() . '-rules',
			Brizy_Editor::get()->get_url( 'admin/static/js/rules.js' ),
			array( Brizy_Editor::get()->get_slug() . '-hyperapp-js' ),
			Brizy_Editor::get()->get_version(),
			true
		);
		wp_localize_script(
			Brizy_Editor::get()->get_slug() . '-rules',
			'Brizy_Admin_Rules',
			array(
				'url'   => set_url_scheme( admin_url( 'admin-ajax.php' ) ),
				'rules' => $this->ruleManager->getRules( get_the_ID() ),
				'hash'  => wp_create_nonce( Brizy_Admin_Rules_Api::nonce ),
				'id'    => get_the_ID(),
			)
		);
	}

	/**
	 * @param $messages
	 *
	 * @return mixed
	 */
	function filterTemplateMessages( $messages ) {
		$post             = get_post();
		$post_type        = get_post_type( $post );
		$post_type_object = get_post_type_object( $post_type );

		$messages[ self::CP_TEMPLATE ] = array(
			0  => '', // Unused. Messages start at index 1.
			1  => __( 'Template updated.' ),
			2  => __( 'Custom field updated.' ),
			3  => __( 'Custom field deleted.' ),
			4  => __( 'Template updated.' ),
			/* translators: %s: date and time of the revision */
			5  => isset( $_GET['revision'] ) ? sprintf( __( 'Template restored to revision from %s' ), wp_post_revision_title( (int) $_GET['revision'], false ) ) : false,
			6  => __( 'Template published.' ),
			7  => __( 'Template saved.' ),
			8  => __( 'Template submitted.' ),
			9  => sprintf(
				__( 'Template scheduled for: <strong>%1$s</strong>.' ),
				// translators: Publish box date format, see http://php.net/date
				date_i18n( __( 'M j, Y @ G:i' ), strtotime( $post->post_date ) )
			),
			10 => __( 'Template draft updated.' )
		);

		if ( $post_type_object->publicly_queryable && 'Template' === $post_type ) {
			$permalink = get_permalink( $post->ID );

			$view_link                 = sprintf( ' <a href="%s">%s</a>', esc_url( $permalink ), __( 'View Template' ) );
			$messages[ $post_type ][1] .= $view_link;
			$messages[ $post_type ][6] .= $view_link;
			$messages[ $post_type ][9] .= $view_link;

			$preview_permalink          = add_query_arg( 'preview', 'true', $permalink );
			$preview_link               = sprintf( ' <a target="_blank" href="%s">%s</a>', esc_url( $preview_permalink ), __( 'Preview Template' ) );
			$messages[ $post_type ][8]  .= $preview_link;
			$messages[ $post_type ][10] .= $preview_link;
		}

		return $messages;
	}

	public function addTemplateRoleCaps() {
		$roles = wp_roles()->roles;
		foreach ( $roles as $name => $role ) {
			$roleObject = get_role( $name );

			/*if ( $roleObject->has_cap( 'brizy_edit_whole_page' ) || $roleObject->has_cap( 'brizy_edit_content_only' ) ) {
				$roleObject->add_cap( 'read_' . self::CP_TEMPLATE );
				$roleObject->add_cap( 'read_private_' . self::CP_TEMPLATES );
				$roleObject->add_cap( 'edit_' . self::CP_TEMPLATE );
				$roleObject->add_cap( 'edit_' . self::CP_TEMPLATES );
				$roleObject->add_cap( 'edit_others_' . self::CP_TEMPLATES );
				$roleObject->add_cap( 'edit_published_' . self::CP_TEMPLATES );
				$roleObject->add_cap( 'publish_' . self::CP_TEMPLATES );
				$roleObject->add_cap( 'delete_others_' . self::CP_TEMPLATES );
				$roleObject->add_cap( 'delete_private_' . self::CP_TEMPLATES );
				$roleObject->add_cap( 'delete_published_' . self::CP_TEMPLATES );
			} else */
			{
				$roleObject->remove_cap( 'read_' . self::CP_TEMPLATE );
				$roleObject->remove_cap( 'read_private_' . self::CP_TEMPLATES );
				$roleObject->remove_cap( 'edit_' . self::CP_TEMPLATE );
				$roleObject->remove_cap( 'edit_' . self::CP_TEMPLATES );
				$roleObject->remove_cap( 'edit_others_' . self::CP_TEMPLATES );
				$roleObject->remove_cap( 'edit_published_' . self::CP_TEMPLATES );
				$roleObject->remove_cap( 'publish_' . self::CP_TEMPLATES );
				$roleObject->remove_cap( 'delete_others_' . self::CP_TEMPLATES );
				$roleObject->remove_cap( 'delete_private_' . self::CP_TEMPLATES );
				$roleObject->remove_cap( 'delete_published_' . self::CP_TEMPLATES );
			}
		}
	}

	static public function registerSupportedPostType() {
		add_filter( 'brizy_supported_post_types', function ( $posts ) {
			$posts[] = Brizy_Admin_Templates::CP_TEMPLATE;

			return $posts;
		} );
	}

	static public function registerCustomPostTemplate() {

		$labels = array(
			'name'               => _x( 'Templates', 'post type general name', 'brizy' ),
			'singular_name'      => _x( 'Template', 'post type singular name', 'brizy' ),
			'menu_name'          => _x( 'Templates', 'admin menu', 'brizy' ),
			'name_admin_bar'     => _x( 'Template', 'add new on admin bar', 'brizy' ),
			'add_new'            => _x( 'Add New', self::CP_TEMPLATE, 'brizy' ),
			'add_new_item'       => __( 'Add New Template', 'brizy' ),
			'new_item'           => __( 'New Template', 'brizy' ),
			'edit_item'          => __( 'Edit Template', 'brizy' ),
			'view_item'          => __( 'View Template', 'brizy' ),
			'all_items'          => __( 'Templates', 'brizy' ),
			'search_items'       => __( 'Search Templates', 'brizy' ),
			'parent_item_colon'  => __( 'Parent Templates:', 'brizy' ),
			'not_found'          => __( 'No Templates found.', 'brizy' ),
			'not_found_in_trash' => __( 'No Templates found in Trash.', 'brizy' )
		);

		register_post_type( self::CP_TEMPLATE,
			array(
				'labels'              => $labels,
				'public'              => false,
				'has_archive'         => false,
				'description'         => __bt( 'brizy', 'Brizy' ) . ' ' . __( 'templates', 'brizy' ) . '.',
				'publicly_queryable'  => Brizy_Editor::is_user_allowed(),
				'show_ui'             => true,
				'show_in_menu'        => Brizy_Admin_Settings::menu_slug(),
				'query_var'           => false,
				'rewrite'             => array( 'slug' => 'brizy-template' ),
				'capability_type'     => 'page',
				//'map_meta_cap'        => true,
				'hierarchical'        => false,
				'show_in_rest'        => false,
				'can_export'          => true,
				'exclude_from_search' => true,
				'supports'            => array( 'title', 'revisions', 'page-attributes' )
			)
		);
	}

	public function registerTemplateMetaBox() {
		add_meta_box( 'template-rules', __( 'Display Conditions' ), array(
			$this,
			'templateRulesBox'
		), self::CP_TEMPLATE, 'normal', 'high' );
	}

	public function removeRowActions( $actions ) {
		if ( get_post_type() === self::CP_TEMPLATE ) {
			unset( $actions['view'] );
		}

		return $actions;
	}

	public function templateRulesBox() {
		try {

			$templateId = isset( $_REQUEST['post'] ) ? (int) $_REQUEST['post'] : get_the_ID();

			if ( ! $templateId ) {
				throw new Exception();
			}

			$rules = $this->ruleManager->getRules( $templateId );

			$nonce   = wp_create_nonce( Brizy_Editor_API::nonce );
			$context = array(
				'rules'         => $rules,
				'types'         => array(),
				'apply_for'     => array(),
				'templateId'    => $templateId,
				'reload_action' => admin_url( 'admin-ajax.php?action=' . self::RULE_LIST_VEIW . '&post=' . $templateId . '&hash=' . $nonce ),
				'submit_action' => admin_url( 'admin-ajax.php?action=' . Brizy_Admin_Rules_Api::CREATE_RULE_ACTION ),
				'delete_action' => admin_url( 'admin-ajax.php?action=' . Brizy_Admin_Rules_Api::DELETE_RULE_ACTION . '&postId=' . $templateId . '&hash=' . $nonce ),
				'nonce'         => $nonce
			);

			echo Brizy_TwigEngine::instance( path_join( BRIZY_PLUGIN_PATH, "admin/views" ) )
			                     ->render( 'rules-box.html.twig', $context );
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->error( $e->getMessage(), array( 'exception' => $e ) );
			esc_html_e( 'Unable to show the rule box.', 'brizy' );
		}
	}

	public function getTemplateRuleBox() {
		$this->templateRulesBox();
		exit;
	}

//	private function get_post_list(  $postType, $excludePostType = array() ) {
//
//		global $wp_post_types;
//
//		$post_query = array(
//			'post_type'      => $postType,
//			'posts_per_page' => - 1,
//			'post_status'    => $postType == 'attachment' ? 'inherit' : array(
//				'publish',
//				'pending',
//				'draft',
//				'future',
//				'private'
//			),
//			'orderby'        => 'post_title',
//			'order'          => 'ASC'
//		);
//
//		$posts = new WP_Query( $post_query );
//
//		$result = array();
//
//		foreach ( $posts->posts as $post ) {
//
//			if ( in_array( $post->post_type, $excludePostType ) ) {
//				continue;
//			}
//
//			$result[] = (object) array(
//				'ID'              => $post->ID,
//				'uid'             => $this->create_uid( $post->ID ),
//				'post_type'       => $post->post_type,
//				'post_type_label' => $wp_post_types[ $post->post_type ]->label,
//				'title'           => apply_filters( 'the_title', $post->post_title )
//			);
//		}
//
//		return $result;
//	}


	/**
	 * @return Brizy_Editor_Post|null
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public function getTemplateForCurrentPage() {

		list( $applyFor, $entityType, $entityValues ) = Brizy_Admin_Rules_Manager::getCurrentPageGroupAndType();

		$is_preview = is_preview();

		$templates = get_posts( array(
			'post_type'   => self::CP_TEMPLATE,
			'numberposts' => - 1,
			'post_status' => $is_preview ? 'any' : 'publish'
		) );

		$templates = Brizy_Admin_Rules_Manager::sortEntitiesByRuleWeight( $templates, [
			'type'         => $applyFor,
			'entityType'   => $entityType,
			'entityValues' => $entityValues
		] );

		foreach ( $templates as $atemplate ) {
			$ruleSet = $this->ruleManager->getRuleSet( $atemplate->ID );
			if ( $ruleSet->isMatching( $applyFor, $entityType, $entityValues ) ) {
				return Brizy_Editor_Post::get( $atemplate->ID );
			}
		}

		return null;
	}

	/**
	 * @param $template
	 *
	 * @return string
	 */
	public function templateInclude( $template ) {

		if ( ! self::getTemplate() ) {
			return $template;
		}

		$templateName = self::getTemplate()->get_template();

		if ( ! $templateName || $templateName == 'default' ) {
			return path_join( BRIZY_PLUGIN_PATH, 'public/views/templates/' . Brizy_Config::BRIZY_TEMPLATE_FILE_NAME );
		}

		if ( in_array( $templateName, array(
			Brizy_Config::BRIZY_BLANK_TEMPLATE_FILE_NAME,
			Brizy_Config::BRIZY_TEMPLATE_FILE_NAME
		) ) ) {
			return Brizy_Editor::get()->get_path( '/public/views/templates/' . $templateName );
		}

		return $template;
	}

	public function templateFrontEnd() {
		global $wp_query;
		$pid = Brizy_Editor::get()->currentPostId();

		$is_using_brizy = false;
		try {
			if ( in_array( get_post_type( $pid ), Brizy_Editor::get()->supported_post_types() ) ) {
				$is_using_brizy = Brizy_Editor_Post::get( $pid )->uses_editor();
			}
		} catch ( Exception $e ) {

		}
		try {

			if ( is_null( $pid ) || ! $is_using_brizy ) {
				self::$template = $this->getTemplateForCurrentPage();

				if ( ! self::getTemplate() ) {
					return;
				}

				$is_preview    = is_preview() || isset( $_GET['preview'] );
				$needs_compile = $is_preview || ! self::getTemplate()->isCompiledWithCurrentVersion() || self::getTemplate()->get_needs_compile();

				if ( $needs_compile ) {
					try {
						self::getTemplate()->compile_page();
						if ( ! $is_preview && $needs_compile ) {
							self::getTemplate()->saveStorage();
							self::getTemplate()->savePost();
						}
					} catch ( Exception $e ) {
						//ignore
						Brizy_Logger::instance()->error( $e->getMessage(), [] );
					}
				}

				if ( $pid ) {
					$this->pid = $pid;
				}

				remove_filter( 'the_content', 'wpautop' );

				// insert the compiled head and content
				add_filter( 'body_class', array( $this, 'bodyClassFrontend' ) );
				add_action( 'wp_head', array( $this, 'insertPageHead' ) );
				add_action( 'brizy_template_content', array( $this, 'insertPageContent' ), - 12000 );
				add_filter( 'the_content', array( $this, 'filterPageContent' ), - 12000 );
				add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_preview_assets' ), 9999 );
			}

		} catch ( Exception $e ) {
			//ignore
			Brizy_Logger::instance()->error( $e->getMessage(), [] );
		}
	}


	/**
	 * @internal
	 */
	public function enqueue_preview_assets() {
		if ( wp_script_is( 'jquery' ) === false ) {
			wp_register_script( 'jquery-core', "/wp-includes/js/jquery/jquery.js" );
			wp_register_script( 'jquery-migrate', "/wp-includes/js/jquery/jquery-migrate.min.js" );
			wp_register_script( 'jquery', false, array( 'jquery-core', 'jquery-migrate' ) );
		}

		$urlBuilder = new Brizy_Editor_UrlBuilder( Brizy_Editor_Project::get() );
		$assets_url = $urlBuilder->editor_build_url();


		wp_enqueue_style( 'brizy-preview', "${assets_url}/editor/css/preview.css", array(), BRIZY_EDITOR_VERSION );
		wp_register_script( 'brizy-polyfill', "${assets_url}/editor/js/polyfill.js", array(), null, true );
		wp_enqueue_script( 'brizy-preview', "${assets_url}/editor/js/preview.js", array(
			'jquery',
			'brizy-polyfill'
		), BRIZY_EDITOR_VERSION, true );
		//wp_add_inline_script( 'brizy-preview', "var __CONFIG__ = ${config_json};", 'before' );
		wp_add_inline_script( 'brizy-preview', "jQuery(document).ready(function(){window.Brizy.emit('init.dom',jQuery(document.body))});", 'after' );

		do_action( 'brizy_preview_enqueue_scripts' );
	}


	public function bodyClassFrontend( $classes ) {

		$classes[] = 'brz';

		return $classes;
	}

	/**
	 *  Show the compiled page head content
	 */
	public function insertPageHead() {

		if ( ! self::getTemplate() ) {
			return;
		}
		$pid = Brizy_Editor::get()->currentPostId();

		$post = self::getTemplate()->getWpPost();

		if ( $pid ) {
			$post = get_post( $pid );
		}


		$compiled_page = self::getTemplate()->get_compiled_page();

		$head = apply_filters( 'brizy_content', $compiled_page->get_head(), Brizy_Editor_Project::get(), $post, 'head' );
		?>
        <!-- BRIZY HEAD -->
		<?php echo $head; ?>
        <!-- END BRIZY HEAD -->
		<?php
	}


	/**
	 * @param $content
	 *
	 * @return null|string|string[]
	 * @throws Exception
	 */
	public function insertPageContent() {

		if ( ! self::getTemplate() ) {
			return;
		}

		$pid = Brizy_Editor::get()->currentPostId();

		$post = self::getTemplate()->getWpPost();

		if ( $pid ) {
			$post = get_post( $pid );
		}

		$compiled_page = self::getTemplate()->get_compiled_page();

		$content = apply_filters( 'brizy_content', $compiled_page->get_body(), Brizy_Editor_Project::get(), $post, 'body' );

		echo do_shortcode( $content );
	}

	/**
	 * @param $content
	 *
	 * @return null|string|string[]
	 * @throws Exception
	 */
	public function filterPageContent( $content ) {

		if ( ! self::getTemplate() ) {
			return $content;
		}
		$pid           = Brizy_Editor::get()->currentPostId();
		$brizyPost     = get_post( $pid );
		$compiled_page = self::getTemplate()->get_compiled_page();

		return apply_filters( 'brizy_content', $compiled_page->get_body(), Brizy_Editor_Project::get(), $brizyPost, 'body' );
	}

	/**
	 * Check for rules conflicts on transition post from trash to another post status.
	 * If we have some conflicts between the rules from the transition post rules and other rules from existing posts,
	 * then we remove conflicting rules from the restored post.
	 *
	 * @param string $new_status New post status.
	 * @param string $old_status Old post status.
	 * @param WP_Post $post Transition post.
	 */
	public function actionTransitionPostStatus( $new_status, $old_status, $post ) {

		if ( 'trash' !== $old_status || self::CP_TEMPLATE !== $post->post_type ) {
			return;
		}

		$post_id      = $post->ID;
		$rule_manager = new Brizy_Admin_Rules_Manager();
		$post_rules   = $rule_manager->getRules( $post_id );

		if ( ! $post_rules ) {
			return;
		}

		$all_rules     = $rule_manager->getAllRulesSet( array( 'post__not_in' => array( $post_id ) ) )->getRules();
		$has_conflicts = false;

		foreach ( $post_rules as $post_rule ) {

			foreach ( $all_rules as $arule ) {

				if ( $post_rule->isEqual( $arule ) ) {
					$rule_manager->deleteRule( $post_id, $post_rule->getId() );
					$has_conflicts = true;
				}
			}
		}

		if ( $has_conflicts ) {
			Brizy_Admin_Flash::instance()->add_error( 'Conflict of rules: Some rules have been deleted for restored posts. Please check them.' );
		}
	}


	public static function getPostSample( $templateId ) {
		$wp_post = get_post( $templateId );
		if ( $wp_post->post_type !== Brizy_Admin_Templates::CP_TEMPLATE &&
		     $wp_post->post_type !== Brizy_Admin_Popups_Main::CP_POPUP ) {
			return $wp_post;
		}


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

					return array_pop( $array );
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

					return array_pop( $array );
					break;
				case  Brizy_Admin_Rule::ARCHIVE :
					return null;
					break;
				case  Brizy_Admin_Rule::TEMPLATE :

					switch ( $rule->getEntityType() ) {
						case 'author':
							$authors = get_users();

							return array_pop( $authors );
							break;

						case '404':
						case 'search':
							return null;
							break;
						case 'home_page':
							$get_option = get_option( 'page_for_posts' );

							if ( $get_option ) {
								return get_post( $get_option );
							}
							break;
						case 'front_page':
							$get_option = get_option( 'page_on_front' );

							if ( $get_option ) {
								return get_post( $get_option );
							}
							break;
					}

					break;
			}

		}
	}
}


