<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 1/11/19
 * Time: 10:59 AM
 */


class Brizy_Admin_Stories_Main {

	const CP_STORY = 'brizy-story';

	/**
	 * @return Brizy_Admin_Stories_Main
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
		if ( is_admin() ) {
			//add_action( 'admin_menu', array( $this, 'removePageAttributes' ) );
		}
	}

	public function removePageAttributes() {
		remove_meta_box( 'pageparentdiv', self::CP_STORY, 'side' );
	}

	static public function registerSupportedPostType() {
		add_filter( 'brizy_supported_post_types', function ( $posts ) {
			$posts[] = self::CP_STORY;

			return $posts;
		} );
	}

	static public function registerCustomPosts() {

		$labels = array(
			'name'               => _x( 'Stories', 'post type general name' ),
			'singular_name'      => _x( 'Story', 'post type singular name' ),
			'menu_name'          => _x( 'Stories', 'admin menu' ),
			'name_admin_bar'     => _x( 'Story', 'add new on admin bar' ),
			'add_new'            => _x( 'Add New', self::CP_STORY ),
			'add_new_item'       => __( 'Add New Story' ),
			'new_item'           => __( 'New Story' ),
			'edit_item'          => __( 'Edit Story' ),
			'view_item'          => __( 'View Story' ),
			'all_items'          => __( 'Stories' ),
			'search_items'       => __( 'Search Stories' ),
			'parent_item_colon'  => __( 'Parent Stories:' ),
			'not_found'          => __( 'No Stories found.' ),
			'not_found_in_trash' => __( 'No Stories found in Trash.' ),
			'attributes'         => __( 'Story attributes:' )
		);

		register_post_type( self::CP_STORY,
			array(
				'labels'              => $labels,
				'public'              => false,
				'has_archive'         => false,
				'description'         => __( 'Stories', 'brizy' ),
				'publicly_queryable'  => Brizy_Editor_User::is_user_allowed(),
				'show_ui'             => defined( 'BRIZY_PRO_VERSION' ),
				'show_in_menu'        => Brizy_Admin_Settings::menu_slug(),
				'query_var'           => false,
				'rewrite'             => array( 'slug' => 'brizy-story' ),
				'capability_type'     => 'page',
				'hierarchical'        => false,
				'show_in_rest'        => false,
				'exclude_from_search' => true,
				'can_export'          => true,
				//'supports'            => array( 'title', 'post_content', 'revisions' )
			)
		);

		//remove_post_type_support( self::CP_STORY, 'page-attributes' );
	}

}
