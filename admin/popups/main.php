<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 1/11/19
 * Time: 10:59 AM
 */


class Brizy_Admin_Popups_Main {

	const CP_POPUP = 'brizy-popup';

	/**
	 * @return Brizy_Admin_Popups_Main
	 */
	public static function _init() {
		static $instance;

		if ( ! $instance ) {
			$instance = new self();
			$instance->initialize();
		}

		return $instance;
	}

	public function initialize() {
		//add_filter( 'brizy_content', array( $this, 'insertPopupsHtml' ), PHP_INT_MIN, 4 );
		add_action( 'brizy_after_enabled_for_post', array( $this, 'afterBrizyEnabledForPopup' ) );
		add_action( 'wp_head', array( $this, 'insertPopupsInHead' ) );
		add_action( 'wp_footer', array( $this, 'insertPopupsInFooter' ) );

		if ( is_admin() ) {
			add_action( 'admin_menu', array( $this, 'removePageAttributes' ) );
		}
	}

	public function removePageAttributes() {
		remove_meta_box( 'pageparentdiv', self::CP_POPUP, 'side' );
	}

	static public function registerSupportedPostType() {
		add_filter( 'brizy_supported_post_types', function ( $posts ) {
			$posts[] = self::CP_POPUP;

			return $posts;
		} );
	}

	static public function registerCustomPosts() {

		$labels = array(
			'name'               => _x( 'Popups', 'post type general name' ),
			'singular_name'      => _x( 'Popup', 'post type singular name' ),
			'menu_name'          => _x( 'Popups', 'admin menu' ),
			'name_admin_bar'     => _x( 'Popup', 'add new on admin bar' ),
			'add_new'            => _x( 'Add New', self::CP_POPUP ),
			'add_new_item'       => __( 'Add New Popup' ),
			'new_item'           => __( 'New Popup' ),
			'edit_item'          => __( 'Edit Popup' ),
			'view_item'          => __( 'View Popup' ),
			'all_items'          => __( 'Popups' ),
			'search_items'       => __( 'Search Popups' ),
			'parent_item_colon'  => __( 'Parent Popups:' ),
			'not_found'          => __( 'No Popups found.' ),
			'not_found_in_trash' => __( 'No Popups found in Trash.' ),
			'attributes'         => __( 'Popup attributes:' )
		);

		register_post_type( self::CP_POPUP,
			array(
				'labels'              => $labels,
				'public'              => false,
				'has_archive'         => false,
				'description'         => __( 'Popups', 'brizy' ),
				'publicly_queryable'  => Brizy_Editor::is_user_allowed(),
				'show_ui'             => defined( 'BRIZY_PRO_VERSION' ),
				'show_in_menu'        => Brizy_Admin_Settings::menu_slug(),
				'query_var'           => false,
				'rewrite'             => array( 'slug' => 'brizy-popup' ),
				'capability_type'     => 'page',
				'hierarchical'        => false,
				'show_in_rest'        => false,
				'exclude_from_search' => true,
				'can_export'          => true,
				'supports'            => array( 'title', 'post_content', 'revisions' )
			)
		);

		remove_post_type_support( self::CP_POPUP, 'page-attributes' );
	}

	/**
	 * @param $post
	 *
	 * @throws Exception
	 */
	public function afterBrizyEnabledForPopup( $post ) {
		if ( $post->post_type === Brizy_Admin_Popups_Main::CP_POPUP ) {
			$manager = new Brizy_Admin_Rules_Manager();
			if ( count( $manager->getRules( $post->ID ) ) == 0 ) {
				$manager->saveRules( $post->ID, array(
					new Brizy_Admin_Rule( null, Brizy_Admin_Rule::TYPE_INCLUDE, '', '', array() )
				) );
			}
		}
	}

	public function insertPopupsInHead() {
		$popups    = $this->getMatchingBrizyPopups();
		$pid       = Brizy_Editor::get()->currentPostId();
		$brizyPost = get_post( $pid );
		foreach ( $popups as $brizyPopup ) {
			$compiledPage = $brizyPopup->get_compiled_page();
			echo "\n\n<!-- POPUP HEAD INSERT START-->\n" . apply_filters( 'brizy_content', $compiledPage->get_head(), Brizy_Editor_Project::get(), $brizyPost ) . "\n<!-- POPUP HEAD INSERT END-->\n\n";
		}
	}

	public function insertPopupsInFooter() {
		$popups    = $this->getMatchingBrizyPopups();
		$pid       = Brizy_Editor::get()->currentPostId();
		$brizyPost = get_post( $pid );
		foreach ( $popups as $brizyPopup ) {
			$compiledPage = $brizyPopup->get_compiled_page();
			echo "\n\n<!-- POPUP BODY INSERT START-->\n" . apply_filters( 'brizy_content', $compiledPage->get_body(), Brizy_Editor_Project::get(), $brizyPost ) . "\n<!-- POPUP BODY INSERT END-->\n\n";
		}
	}


	/**
	 * @return array
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public function getMatchingBrizyPopups() {
		list( $applyFor, $entityType, $entityValues ) = Brizy_Admin_Rules_Manager::getCurrentPageGroupAndType();

		$popups = $this->findMatchingPopups( $applyFor, $entityType, $entityValues );

		return $popups;
	}

	/**
	 * @param $applyFor
	 * @param $entityType
	 * @param $entityValues
	 *
	 * @return array
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	private function findMatchingPopups( $applyFor, $entityType, $entityValues ) {

		$resultPopups = array();
		$allPopups    = get_posts( array(
			'post_type'   => self::CP_POPUP,
			'numberposts' => - 1,
			'post_status' => 'publish'
		) );

		$allPopups = Brizy_Admin_Rules_Manager::sortEntitiesByRuleWeight( $allPopups );

		$ruleManager = new Brizy_Admin_Rules_Manager();
		foreach ( $allPopups as $aPopup ) {
			$ruleSet = $ruleManager->getRuleSet( $aPopup->ID );
			if ( $ruleSet->isMatching( $applyFor, $entityType, $entityValues ) ) {
				$resultPopups[] = Brizy_Editor_Post::get( $aPopup );
			}
		}

		return $resultPopups;
	}


}