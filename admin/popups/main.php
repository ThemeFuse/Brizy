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
	 *
	 * @return mixed
	 */
	public function insertPopupsHtml( $content, $project, $wpPost ) {



		return $content;
	}

	static public function registerCustomPosts() {

		$labels = array(
			'name' => _x( 'Brizy popup', 'brizy' ),
		);

		register_post_type( self::CP_POPUP,
			array(
				'labels'              => $labels,
				'public'              => false,
				'has_archive'         => false,
				'description'         => __( 'Brizy popup', 'brizy' ),
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

	public function initialize() {
		add_filter( 'brizy_supported_post_types', array( $this, 'populateSupportedPosts' ) );
		add_filter( 'brizy_content', array( $this, 'insertPopupsHtml' ), PHP_INT_MIN );
	}

}