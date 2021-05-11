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

		add_filter( 'brizy_content', array( $this, 'insertPopupsHtml' ), - 999999, 4 );
		add_action( 'brizy_after_enabled_for_post', array( $this, 'afterBrizyEnabledForPopup' ) );

		if ( is_admin() ) {
			add_action( 'admin_menu', array( $this, 'removePageAttributes' ) );
		}
	}

	public function removePageAttributes() {
		remove_meta_box( 'pageparentdiv', self::CP_POPUP, 'side' );
	}

	static public function registerCustomPosts() {

		$labels = array(
			'name'               => _x( 'Popups', 'post type general name', 'brizy' ),
			'singular_name'      => _x( 'Popup', 'post type singular name', 'brizy' ),
			'menu_name'          => _x( 'Popups', 'admin menu', 'brizy' ),
			'name_admin_bar'     => _x( 'Popup', 'add new on admin bar', 'brizy' ),
			'add_new'            => __( 'Add New', 'brizy' ),
			'add_new_item'       => __( 'Add New Popup', 'brizy' ),
			'new_item'           => __( 'New Popup', 'brizy' ),
			'edit_item'          => __( 'Edit Popup', 'brizy' ),
			'view_item'          => __( 'View Popup', 'brizy' ),
			'all_items'          => __( 'Popups', 'brizy' ),
			'search_items'       => __( 'Search Popups', 'brizy' ),
			'parent_item_colon'  => __( 'Parent Popups:', 'brizy' ),
			'not_found'          => __( 'No Popups found.', 'brizy' ),
			'not_found_in_trash' => __( 'No Popups found in Trash.', 'brizy' ),
			'attributes'         => __( 'Popup attributes:', 'brizy' )
		);

		register_post_type( self::CP_POPUP,
			array(
				'labels'              => $labels,
				'public'              => false,
				'has_archive'         => false,
				'description'         => __( 'Popups', 'brizy' ),
				'publicly_queryable'  => Brizy_Editor_User::is_user_allowed(),
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


		add_filter( 'brizy_supported_post_types', function ( $posts ) {
			$posts[] = self::CP_POPUP;
			return $posts;
		} );
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

	/**
	 * @param $content
	 * @param $project
	 * @param $wpPost
	 * @param string $context
	 *
	 * @return string|string[]|null
	 * @throws Brizy_Editor_Exceptions_NotFound
	 * @throws Brizy_Editor_Exceptions_ServiceUnavailable
	 */
	public function insertPopupsHtml( $content, $project, $wpPost, $context = 'document' ) {
		$popups = $this->getMatchingBrizyPopups();

		foreach ( $popups as $brizyPopup ) {
			/**
			 * @var Brizy_Editor_Post $brizyPopup ;
			 */

			if ( $brizyPopup->get_needs_compile() ) {
				$brizyPopup->compile_page();
				$brizyPopup->saveStorage();
				$brizyPopup->savePost();
			}

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

		return $target . "\n\n<!-- POPUP INSERT START-->\n{$headContent}\n<!-- POPUP INSERT END-->\n\n";
	}

	private function insertBody( $target, $bodyContent ) {

		return $target . "\n\n<!-- POPUP INSERT START-->\n{$bodyContent}\n<!-- POPUP INSERT END-->\n\n";
	}

	private function insertInDocumentHead( $target, $headContent ) {

		$target = preg_replace( "/(<head[^>]*>)/ium", "$1" . "\n\n<!-- POPUP INSERT START-->\n{$headContent}\n<!-- POPUP INSERT END-->\n\n", $target );

		return $target;
	}

	private function insertInDocumentBody( $target, $bodyContent ) {

		$target = preg_replace( "/(<body[^>]*>)/ium", "$1" . "\n\n<!-- POPUP INSERT START-->\n{$bodyContent}\n<!-- POPUP INSERT END-->\n\n", $target );

		return $target;
	}

	/**
	 * @return array
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public function getMatchingBrizyPopups() {
		list( $applyFor, $entityType, $entityValues ) = Brizy_Admin_Rules_Manager::getCurrentPageGroupAndTypeForPopoup();

		return $this->findMatchingPopups( $applyFor, $entityType, $entityValues );
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

		$allPopups = Brizy_Admin_Rules_Manager::sortEntitiesByRuleWeight( $allPopups, [
			'type'         => $applyFor,
			'entityType'   => $entityType,
			'entityValues' => $entityValues
		] );

		$ruleManager = new Brizy_Admin_Rules_Manager();
		foreach ( $allPopups as $aPopup ) {
			$ruleSet = $ruleManager->getRuleSet( $aPopup->ID );
            try  {
                if ( $ruleSet->isMatching( $applyFor, $entityType, $entityValues ) ) {
                    $resultPopups[] = Brizy_Editor_Post::get( $aPopup );
                }
            } catch (\Exception $e) {
                continue; // we catch here  the  exclusions
            }
		}

		return $resultPopups;
	}
}

