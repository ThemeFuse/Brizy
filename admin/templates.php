<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 7/3/18
 * Time: 3:11 PM
 */

add_filter( 'brizy_supported_post_types', 'brizy_addTemplateSupport' );

function brizy_addTemplateSupport( $posts ) {
	$posts[] = Brizy_Admin_Templates::CP_TEMPLATE;

	return $posts;
}

class Brizy_Admin_Templates {

	const CP_TEMPLATE = 'brizy_template';
	const RULE_LIST_VEIW = 'brizy_rule_list_view';
	const RULE_GROUP_LIST = 'brizy_rule_group_list';
	const RULE_TAXONOMY_LIST = 'brizy_taxonomy_list';
	const RULE_CREATE = 'brizy_create';

	/**
	 * @var Brizy_Editor_Post
	 */
	private $template;

	/**
	 * @var Brizy_Admin_Rules_Manager
	 */
	private $ruleManager;

	/**
	 * Brizy_Admin_Templates constructor.
	 */
	protected function __construct() {

		$this->registerCustomPostTemplate();

		if ( ! Brizy_Editor::is_user_allowed() ) {
			return;
		}

		add_action( 'wp_loaded', array( $this, 'initializeActions' ) );

		$this->ruleManager = new Brizy_Admin_Rules_Manager();
	}

	public function initializeActions() {
		// do other stuff here
		if ( is_admin() ) {
			add_filter( 'post_updated_messages', array( $this, 'filterTemplateMessages' ) );
			add_action( 'add_meta_boxes', array( $this, 'registerTemplateMetaBox' ), 9 );
			add_action( 'wp_ajax_' . self::RULE_LIST_VEIW, array( $this, 'getTemplateRuleBox' ) );
			add_action( 'wp_ajax_' . self::RULE_GROUP_LIST, array( $this, 'getGroupList' ) );
			add_action( 'wp_ajax_' . self::RULE_CREATE, array( $this, 'ruleCreate' ) );
			add_filter( 'post_row_actions', array( $this, 'removeRowActions' ), 10, 1 );
			add_action( 'admin_enqueue_scripts', array( $this, 'action_register_static' ) );

		} elseif ( ! is_admin() && ! defined( 'DOING_AJAX' ) ) {
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

		wp_enqueue_script(
			brizy()->get_slug() . '-hyperapp-js',
			brizy()->get_url( 'admin/static/js/hyperapp.js' ),
			array( 'jquery', 'underscore' ),
			brizy()->get_version(),
			true
		);

		wp_enqueue_script(
			brizy()->get_slug() . '-select2',
			'https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/js/select2.min.js',
			array( 'jquery' )
		);
		wp_enqueue_script(
			brizy()->get_slug() . '-rules',
			brizy()->get_url( 'admin/static/js/rules.js' ),
			array( brizy()->get_slug() . '-hyperapp-js' ),
			brizy()->get_version(),
			true
		);
		wp_localize_script(
			brizy()->get_slug() . '-rules',
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

	public function registerCustomPostTemplate() {


		$labels = array(
			'name'               => _x( 'Templates', 'post type general name' ),
			'singular_name'      => _x( 'Template', 'post type singular name' ),
			'menu_name'          => _x( 'Templates', 'admin menu' ),
			'name_admin_bar'     => _x( 'Template', 'add new on admin bar' ),
			'add_new'            => _x( 'Add New', self::CP_TEMPLATE ),
			'add_new_item'       => __( 'Add New Template' ),
			'new_item'           => __( 'New Template' ),
			'edit_item'          => __( 'Edit Template' ),
			'view_item'          => __( 'View Template' ),
			'all_items'          => __( 'Templates' ),
			'search_items'       => __( 'Search Templates' ),
			'parent_item_colon'  => __( 'Parent Templates:' ),
			'not_found'          => __( 'No Templates found.' ),
			'not_found_in_trash' => __( 'No Templates found in Trash.' )
		);

		register_post_type( self::CP_TEMPLATE,
			array(
				'labels'              => $labels,
				'public'              => false,
				'has_archive'         => false,
				'description'         => __( 'Brizy templates.' ),
				'publicly_queryable'  => Brizy_Editor::is_user_allowed(),
				'show_ui'             => true,
				'show_in_menu'        => Brizy_Admin_Settings::menu_slug(),
				'query_var'           => false,
				'rewrite'             => array( 'slug' => 'brizy-template' ),
				'capability_type'     => 'post',
				'hierarchical'        => false,
				'show_in_rest'        => false,
				'exclude_from_search' => false,
				'supports'            => array( 'title', 'revisions', 'page-attributes' )
			)
		);
	}

	public function ruleCreate() {
		$t = 0;
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
			?>Unable to show the rule box.<?php
		}
	}

	public function getTemplateRuleBox() {
		$this->templateRulesBox();
		exit;
	}

	public function getGroupList() {
		$closure = function ( $v ) {
			return array(
				'title'      => $v->label,
				'value'      => $v->name,
				'groupValue' => $v->groupValue
			);
		};

		$groups = array(
			array(
				'title' => 'Pages',
				'value' => Brizy_Admin_Rule::POSTS,
				'items' => array_map( $closure, $this->getCustomPostsList( Brizy_Admin_Rule::POSTS ) )
			),
			array(
				'title' => 'Categories',
				'value' => Brizy_Admin_Rule::TAXONOMY,
				'items' => array_map( $closure, $this->getTaxonomyList( Brizy_Admin_Rule::TAXONOMY ) )
			),
			array(
				'title' => 'Archives',
				'value' => Brizy_Admin_Rule::ARCHIVE,
				'items' => array_map( $closure, $this->getArchivesList( Brizy_Admin_Rule::ARCHIVE ) )
			),
			array(
				'title' => 'Others',
				'value' => Brizy_Admin_Rule::TEMPLATE,
				'items' => $this->geTemplateList()
			),
		);

		wp_send_json( $groups, 200 );
	}

	private function getCustomPostsList( $groupValue ) {
		global $wp_post_types;

		return array_values( array_filter( $wp_post_types, function ( $type ) use ( $groupValue ) {
			$type->groupValue = $groupValue;

			return $type->public && $type->show_ui;
		} ) );
	}

	private function getArchivesList( $groupValue ) {
		global $wp_post_types;

		return array_values( array_filter( $wp_post_types, function ( $type ) use ( $groupValue ) {
			$type->groupValue = $groupValue;

			return $type->public && $type->show_ui && $type->has_archive;
		} ) );
	}

	private function getTaxonomyList( $groupValue ) {
		$terms = get_taxonomies( array( 'public' => true, 'show_ui' => true ), 'objects' );

		return array_values( array_filter( $terms, function ( $term ) use ( $groupValue ) {
			$term->groupValue = $groupValue;

			return $term;
		} ) );
	}

	public function geTemplateList() {
		return array(
			array( 'title' => 'Author page', 'value' => 'author', 'groupValue' => Brizy_Admin_Rule::TEMPLATE ),
			array( 'title' => 'Search page', 'value' => 'search', 'groupValue' => Brizy_Admin_Rule::TEMPLATE ),
			array( 'title' => 'Home page', 'value' => 'front_page', 'groupValue' => Brizy_Admin_Rule::TEMPLATE ),
			array( 'title' => '404 page', 'value' => '404', 'groupValue' => Brizy_Admin_Rule::TEMPLATE ),
			array( 'title' => 'Archive page', 'value' => '', 'groupValue' => Brizy_Admin_Rule::ARCHIVE ),
		);
	}

	/**
	 * @return Brizy_Editor_Post|null
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public function getTemplateForCurrentPage() {

		global $wp_query;

		if ( ! isset( $wp_query ) || is_admin() ) {
			return null;
		}

		$applyFor     = Brizy_Admin_Rule::TEMPLATE;
		$entityType   = null;
		$entityValues = array();

		if ( is_404() ) {
			$applyFor   = Brizy_Admin_Rule::TEMPLATE;
			$entityType = '404';
		} elseif ( is_author() ) {
			$applyFor   = Brizy_Admin_Rule::TEMPLATE;
			$entityType = 'author';
		} elseif ( is_search() ) {
			$applyFor   = Brizy_Admin_Rule::TEMPLATE;
			$entityType = 'search';
		} elseif ( is_front_page() ) {
			$applyFor   = Brizy_Admin_Rule::TEMPLATE;
			$entityType = 'front_page';
		} elseif ( is_home() ) {
			$applyFor   = Brizy_Admin_Rule::TEMPLATE;
			$entityType = 'home_page';
		} elseif ( is_category() || is_tag() || is_tax() ) {
			$applyFor       = Brizy_Admin_Rule::TAXONOMY;
			$entityType     = $wp_query->queried_object->taxonomy;
			$entityValues[] = $wp_query->queried_object_id;
		} elseif ( is_archive() ) {
			$applyFor   = Brizy_Admin_Rule::ARCHIVE;
			$entityType = $wp_query->queried_object->name;
		} elseif ( $wp_query->queried_object instanceof WP_Post ) {
			$applyFor       = Brizy_Admin_Rule::POSTS;
			$entityType     = $wp_query->queried_object->post_type;
			$entityValues[] = get_the_ID();
		}


		$templates = get_posts( array(
			'post_type'   => self::CP_TEMPLATE,
			'numberposts' => - 1,
			'post_status' => 'publish'
		) );

		$ruleManager = $this->ruleManager;
		// sort templates by rule set weight
		usort( $templates, function ( $t1, $t2 ) use ( $ruleManager ) {
			$ruleSetT1 = $ruleManager->getRuleSet( $t1->ID );
			$ruleSetT2 = $ruleManager->getRuleSet( $t2->ID );
			$rule_weight_t1 = $ruleSetT1->getRuleWeight();
			$rule_weight_t2 = $ruleSetT2->getRuleWeight();
			if ( $rule_weight_t1 == $rule_weight_t2 ) {
				return 0;
			}

			return ( $rule_weight_t1 < $rule_weight_t2 ) ? 1 : -1;
		} );

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

		if ( ! $this->template ) {
			return $template;
		}

		if ( is_category() || is_archive() || is_tag() || is_404() || is_search() || is_front_page() || is_home() ) {
			return path_join( BRIZY_PLUGIN_PATH, 'public/views/templates/brizy-template.php' );
		}

		$templateName = $this->template->get_template();

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
		$pid = brizy_get_current_post_id();

		$is_using_brizy = false;
		try {
			if ( in_array( get_post_type( $pid ), brizy()->supported_post_types() ) ) {
				$is_using_brizy = Brizy_Editor_Post::get( $pid )->uses_editor();
			}
		} catch ( Exception $e ) {

		}

		try {

			if ( is_null( $pid ) || ! $is_using_brizy ) {
				$this->template = $this->getTemplateForCurrentPage();

				if ( ! $this->template ) {
					return;
				}

				remove_filter( 'the_content', 'wpautop' );

				// insert the compiled head and content
				add_filter( 'body_class', array( $this, 'bodyClassFrontend' ) );
				add_action( 'wp_head', array( $this, 'insertPageHead' ) );
				add_action( 'brizy_template_content', array( $this, 'insertPageContent' ), - 10000 );
				add_filter( 'the_content', array( $this, 'filterPageContent' ), - 10000 );
				add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_preview_assets' ), 9999 );
			}

		} catch ( Exception $e ) {
			//ignore
		}
	}


	public function bodyClassFrontend( $classes ) {

		$classes[] = 'brz';

		return $classes;
	}

	/**
	 *  Show the compiled page head content
	 */
	public function insertPageHead() {

		if ( ! $this->template ) {
			return;
		}

		$compiled_page = $this->template->get_compiled_page( Brizy_Editor_Project::get() );

		$compiled_page->addAssetProcessor( new Brizy_Editor_Asset_StripTagsProcessor( array( '<title>' ) ) );

		$head = $compiled_page->get_head();

		?>
        <!-- BRIZY HEAD -->
		<?php echo $head; ?>
        <!-- END BRIZY HEAD -->
		<?php

		return;
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
		$assets_url = $urlBuilder->editor_asset_url();


		wp_enqueue_style( 'brizy-preview', "${assets_url}/editor/css/preview.css", array(), BRIZY_EDITOR_VERSION );
		wp_register_script( 'brizy-polyfill', "https://cdn.polyfill.io/v2/polyfill.js?features=IntersectionObserver,IntersectionObserverEntry", array(), null, true );
		wp_enqueue_script( 'brizy-preview', "${assets_url}/editor/js/preview.js", array(
			'jquery',
			'brizy-polyfill'
		), BRIZY_EDITOR_VERSION, true );
		//wp_add_inline_script( 'brizy-preview', "var __CONFIG__ = ${config_json};", 'before' );

		do_action( 'brizy_preview_enqueue_scripts' );
	}


	/**
	 * @param $content
	 *
	 * @return null|string|string[]
	 * @throws Exception
	 */
	public function insertPageContent() {

		if ( ! $this->template ) {
			return;
		}

		$compiled_page = $this->template->get_compiled_page( Brizy_Editor_Project::get() );

		echo $compiled_page->get_body();
	}


	/**
	 * @param $content
	 *
	 * @return null|string|string[]
	 * @throws Exception
	 */
	public function filterPageContent( $content ) {

		if ( ! $this->template ) {
			return $content;
		}

		$compiled_page = $this->template->get_compiled_page( Brizy_Editor_Project::get() );

		return $compiled_page->get_body();
	}
}
