<?php

/**
 * Created by PhpStorm.
 * User: alex
 * Date: 1/11/19
 * Time: 10:59 AM
 */
class Brizy_Admin_Layouts_Main {

	const CP_LAYOUT = 'brizy-layout';

	/**
	 * @return Brizy_Admin_Layouts_Main
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
	}

	static public function registerCustomPosts() {

		$labels = array(
			'name' => _x( 'Layouts', 'post type general name' ),
		);

		register_post_type( self::CP_LAYOUT,
			array(
				'labels'              => $labels,
				'public'              => false,
				'has_archive'         => false,
				'description'         => __( 'Layout.', 'brizy' ),
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
		$types[] = self::CP_LAYOUT;

		return $types;
	}

	public function initializeActions() {
		Brizy_Admin_Layouts_Api::_init();
	}
}
