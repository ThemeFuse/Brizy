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