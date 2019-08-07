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
	}

	static public function registerCustomPosts() {

		$labels = array(
			'name' => _x( 'Brizy popup', 'brizy' ),
		);

		register_post_type( self::CP_POPUP,
			array(
				'labels'              => $labels,
				'public'              => true,
				'has_archive'         => false,
				'description'         => __( 'Brizy popup', 'brizy' ),
				'publicly_queryable'  => true,
				'show_ui'             => true,
				'show_in_menu'        => true,
				'query_var'           => true,
				'capability_type'     => 'page',
				'hierarchical'        => false,
				'show_in_rest'        => false,
				'exclude_from_search' => true,
				'supports'            => array( 'title', 'post_content', 'revisions', 'page-attributes' )
			)
		);

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

			if ( $context == 'head' || $context == 'document' ) {
				$content = $this->insertInHead( $content, $compiledPage->get_head() );
			}

			if ( $context == 'body' || $context == 'document' ) {
				$content = $this->insertInBody( $content, $compiledPage->get_body() );
			}
		}

		return $content;
	}

	private function insertInHead( $target, $headContent ) {

		$target = preg_replace( "/(<head[^>]*>)/ium", "$1" . $headContent, $target );

		return $target;
	}

	private function insertInBody( $target, $bodyContent ) {

		$target = preg_replace( "/(<body[^>]*>)/ium", "$1" . $bodyContent, $target );

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