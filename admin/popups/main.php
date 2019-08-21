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
		add_filter( 'brizy_supported_post_types', array( $this, 'populateSupportedPosts' ) );
		add_filter( 'brizy_content', array( $this, 'insertPopupsHtml' ), PHP_INT_MIN, 4 );

		if ( is_admin() ) {
			add_action( 'admin_menu', array( $this, 'removePageAttributes' ) );
		}
	}

	public function removePageAttributes() {
		remove_meta_box( 'pageparentdiv', self::CP_POPUP, 'side' );
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
				'show_ui'             => true,
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
	 * @param $types
	 *
	 * @return array
	 */
	public function populateSupportedPosts( $types ) {
		$types[] = self::CP_POPUP;

		return $types;
	}

	/**
	 * @param $content
	 * @param $project
	 * @param $wpPost
	 * @param $context
	 *
	 * @return mixed
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public function insertPopupsHtml( $content, $project, $wpPost, $context ) {
		$popups = $this->getMatchingBrizyPopups();

		foreach ( $popups as $brizyPopup ) {
			$compiledPage = $brizyPopup->get_compiled_page();

			if ( $context == 'document' ) {
				$content = $this->insertInDocumentHead( $content, $compiledPage->get_head() );
				$content = $this->insertInDocumentBody( $content, $compiledPage->get_body() );
			}

			if ( $context == 'head' ) {
				$content = $this->insertHead( $content, $compiledPage->get_head() );
			}

			if ( $context == 'body' ) {
				$content = $this->insertBody( $content, $compiledPage->get_body() );
			}
		}

		return $content;
	}

	private function insertHead( $target, $headContent ) {

		return $target . "\n\n<!-- POPUP INSERT START-->\n{$headContent}\n<!-- POPUP INSERT START-->\n\n";
	}

	private function insertBody( $target, $bodyContent ) {

		return $target . "\n\n<!-- POPUP INSERT START-->\n{$bodyContent}\n<!-- POPUP INSERT START-->\n\n";
	}

	private function insertInDocumentHead( $target, $headContent ) {

		$target = preg_replace( "/(<head[^>]*>)/ium", "$1" . "\n\n<!-- POPUP INSERT START-->\n{$headContent}\n<!-- POPUP INSERT START-->\n\n", $target );

		return $target;
	}

	private function insertInDocumentBody( $target, $bodyContent ) {

		$target = preg_replace( "/(<body[^>]*>)/ium", "$1" . "\n\n<!-- POPUP INSERT START-->\n{$bodyContent}\n<!-- POPUP INSERT START-->\n\n", $target );

		return $target;
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