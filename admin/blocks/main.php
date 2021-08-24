<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 1/11/19
 * Time: 10:59 AM
 */


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

		if ( Brizy_Editor_User::is_user_allowed() ) {
			add_action( 'wp_loaded', array( $this, 'initializeActions' ) );
		}

		add_filter( 'brizy_global_data', array( $this, 'populateGlobalData' ) );
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
			$uid                              = $brizy_editor_block->getUid();
			$block_data                       = $brizy_editor_block->convertToOptionValue();
			$globalData->globalBlocks[ $uid ] = array(
				'data'     => json_decode( $brizy_editor_block->get_editor_data() ),
				'position' => $block_data['position'],
				'rules'    => $block_data['rules']
			);
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
			$block_data                       = $brizy_editor_block->convertToOptionValue();
			$globalData->savedBlocks[] = array(
				'data' => json_decode( $brizy_editor_block->get_editor_data() ),
				'rules'    => $block_data['rules']
			);
		}

		return $globalData;
	}

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
				'description'         => __bt( 'brizy', 'Brizy' ) . ' ' . __( 'global block.', 'brizy' ),
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
				'description'         => __bt( 'brizy', 'Brizy' ) . ' ' . __( 'global block.' ),
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

		add_filter( 'brizy_supported_post_types', function ( $posts ) {
			$posts[] = self::CP_SAVED;
			$posts[] = self::CP_GLOBAL;

			return $posts;
		} );
	}
}