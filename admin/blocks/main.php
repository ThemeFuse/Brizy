<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 1/11/19
 * Time: 10:59 AM
 */

add_filter( 'brizy_supported_post_types', 'brizy_addBlockSupport' );

function brizy_addBlockSupport( $posts ) {
	$posts[] = Brizy_Admin_Blocks_Main::CP_GLOBAL;
	$posts[] = Brizy_Admin_Blocks_Main::CP_SAVED;

	return $posts;
}


class Brizy_Admin_Blocks_Main {

	const CP_GLOBAL = 'brizy-global-block';
	const CP_SAVED = 'brizy-saved-block';

	/**
	 * @return Brizy_Admin_Blocks_Main
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
		add_filter( 'brizy_global_data', array( $this, 'populateGlobalData' ) );
		add_filter( 'brizy_supported_post_types', array( $this, 'populateSupportedPosts' ) );
	}

	public function populateSupportedPosts( $types ) {
		$types[] = self::CP_SAVED;
		$types[] = self::CP_GLOBAL;

		return $types;
	}

	/**
	 * Populated the global data for compiler
	 *
	 * @param $globalData
	 *
	 * @return mixed
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public function populateGlobalData( $globalData ) {

		if ( ! is_object( $globalData ) ) {
			$globalData = (object) array( 'globalBlocks' => array(), 'savedBlocks' => array() );
		}

		$blocks = get_posts( array(
			'post_type'      => Brizy_Admin_Blocks_Main::CP_GLOBAL,
			'posts_per_page' => - 1,
			'post_status'    => 'publish',
			'orderby'        => 'ID',
			'order'          => 'ASC',
		) );

		foreach ( $blocks as $block ) {
			$brizy_editor_block               = Brizy_Editor_Block::get( $block );
			$uid                              = $brizy_editor_block->get_uid();
			$globalData->globalBlocks[ $uid ] = json_decode( $brizy_editor_block->get_editor_data() );
		}

		$blocks = get_posts( array(
			'post_type'      => Brizy_Admin_Blocks_Main::CP_SAVED,
			'posts_per_page' => - 1,
			'post_status'    => 'publish',
			'orderby'        => 'ID',
			'order'          => 'ASC',
		) );

		foreach ( $blocks as $block ) {
			$brizy_editor_block        = Brizy_Editor_Block::get( $block );
			$globalData->savedBlocks[] = json_decode( $brizy_editor_block->get_editor_data() );
		}

		return $globalData;
	}

	/**
	 *
	 */
	public function initializeActions() {
		Brizy_Admin_Blocks_Api::_init();
	}


	static public function registerCustomPosts() {

		$labels = array(
			'name' => _x( 'Global blocks', 'post type general name' ),
		);

		register_post_type( self::CP_GLOBAL,
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
			'name' => _x( 'Saved blocks', 'brizy' ),
		);

		register_post_type( self::CP_SAVED,
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


}