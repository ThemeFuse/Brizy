<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 1/11/19
 * Time: 10:59 AM
 */


class Brizy_Admin_Fonts_Main {

	const CP_FONT = 'brizy-font';

	/**
	 * @return Brizy_Admin_Fonts_Main
	 */
	public static function _init() {
		static $instance;

		if ( ! $instance ) {
			$instance = new self();
		}

		return $instance;
	}

	/**
	 * BrizyPro_Admin_Popups constructor.
	 */
	public function __construct() {
		add_action( 'wp_loaded', array( $this, 'initializeActions' ) );
	}

	/**
	 *
	 */
	public function initializeActions() {
		Brizy_Admin_Fonts_Api::_init();
	}


	static public function registerCustomPosts() {

		$labels = array(
			'name' => _x( 'Fonts', 'post type general name' ),
		);

		register_post_type( self::CP_FONT,
			array(
				'labels'              => $labels,
				'public'              => false,
				'has_archive'         => false,
				'description'         => __( 'Brizy font.', 'brizy' ),
				'publicly_queryable'  => false,
				'show_ui'             => false,
				'show_in_menu'        => false,
				'query_var'           => false,
				'capability_type'     => 'page',
				'hierarchical'        => false,
				'show_in_rest'        => false,
				'exclude_from_search' => true,
				'supports'            => array( 'title', 'page-attributes' )
			)
		);

	}


}