<?php

class Brizy_Admin_Symbols_Main {

	const  CP_SYMBOL = 'brizy_symbol';

	/**
	 * @return mixed|self
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
		self::registerCustomPosts();
		Brizy_Admin_Symbols_Api::_init();
	}

	static public function registerCustomPosts() {

		$labels = array(
			'name'               => _x( 'Symbols', 'post type general name', 'brizy' ),
			'singular_name'      => _x( 'Symbol', 'post type singular name', 'brizy' ),
			'menu_name'          => _x( 'Symbols', 'admin menu', 'brizy' ),
			'name_admin_bar'     => _x( 'Symbol', 'add new on admin bar', 'brizy' ),
			'add_new'            => __( 'Add New', 'brizy' ),
			'add_new_item'       => __( 'Add New Symbol', 'brizy' ),
			'new_item'           => __( 'New Symbol', 'brizy' ),
			'edit_item'          => __( 'Edit Symbol', 'brizy' ),
			'view_item'          => __( 'View Symbol', 'brizy' ),
			'all_items'          => __( 'Symbols', 'brizy' ),
			'search_items'       => __( 'Search Symbols', 'brizy' ),
			'parent_item_colon'  => __( 'Parent Symbols:', 'brizy' ),
			'not_found'          => __( 'No Symbols found.', 'brizy' ),
			'not_found_in_trash' => __( 'No Symbols found in Trash.', 'brizy' ),
			'attributes'         => __( 'Symbol attributes:', 'brizy' ),
		);
		register_post_type( self::CP_SYMBOL, array(
			'labels'              => $labels,
			'public'              => false,
			'has_archive'         => false,
			'description'         => __( 'Symbols', 'brizy' ),
			'publicly_queryable'  => false,
			'show_ui'             => false,
			'show_in_menu'        => Brizy_Admin_Settings::menu_slug(),
			'query_var'           => false,
			'rewrite'             => array( 'slug' => 'editor-symbol' ),
			'capability_type'     => 'page',
			'hierarchical'        => false,
			'show_in_rest'        => false,
			'exclude_from_search' => true,
			'can_export'          => true,
			'supports'            => array( 'title', 'post_content', 'revisions' ),
		) );
		remove_post_type_support( self::CP_SYMBOL, 'page-attributes' );
	}
}
