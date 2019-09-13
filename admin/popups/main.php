<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 1/11/19
 * Time: 10:59 AM
 */
class Brizy_Admin_Popups_Main {

	const CP_GLOBAL_POPUP = 'brizy-global-popup';
	const CP_SAVED_POPUP = 'brizy-saved-popup';

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
		add_action( 'wp_loaded', array( $this, 'initializeActions' ) );
		add_filter( 'brizy_supported_post_types', array( $this, 'populateSupportedPosts' ) );
		//add_filter( 'brizy_content', array( $this, 'insertPopupsHtml' ), PHP_INT_MIN, 4 );
	}

	static public function registerCustomPosts() {

		$labels = array(
			'name' => _x( 'Global Popups', 'post type general name' ),
		);

		register_post_type( self::CP_GLOBAL_POPUP,
			array(
				'labels'              => $labels,
				'public'              => false,
				'has_archive'         => false,
				'description'         => __( 'Brizy global block.', 'brizy' ),
				'publicly_queryable'  => false,
				'show_ui'             => false,
				'show_in_menu'        => false,
				'query_var'           => false,
				'capability_type'     => 'page',
				'hierarchical'        => false,
				'show_in_rest'        => false,
				'exclude_from_search' => true,
				'supports'            => array( 'title', 'revisions', 'page-attributes' )
			)
		);

		$labels = array(
			'name' => _x( 'Saved Popups', 'brizy' ),
		);

		register_post_type( self::CP_SAVED_POPUP,
			array(
				'labels'              => $labels,
				'public'              => false,
				'has_archive'         => false,
				'description'         => __( 'Brizy global block.' ),
				'publicly_queryable'  => false,
				'show_ui'             => false,
				'show_in_menu'        => false,
				'query_var'           => false,
				'capability_type'     => 'page',
				'hierarchical'        => false,
				'show_in_rest'        => false,
				'exclude_from_search' => true,
				'supports'            => array( 'title', 'revisions', 'page-attributes' )
			)
		);

	}

	/**
	 * @param $types
	 *
	 * @return array
	 */
	public function populateSupportedPosts( $types ) {
		$types[] = self::CP_GLOBAL_POPUP;
		$types[] = self::CP_SAVED_POPUP;

		return $types;
	}

	public function initializeActions() {
		Brizy_Admin_Popups_Api::_init();
	}
}