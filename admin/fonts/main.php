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
		add_filter( 'upload_mimes', array( $this, 'addFOntTypes' ), 1, 1 );
		add_filter( 'brizy_compiler_params', array( $this, 'editorConfigFilter' ), 1, 1 );

		$urlBuilder = new Brizy_Editor_UrlBuilder();
		$handler    = new Brizy_Admin_Fonts_Handler( $urlBuilder, null );
	}

	/**
	 *
	 */
	public function initializeActions() {
		Brizy_Admin_Fonts_Api::_init();
	}

	public function addFOntTypes( $mime_types ) {

		$mime_types['ttf']   = 'application/x-font-ttf';
		$mime_types['eot']   = 'application/vnd.ms-fontobject';
		$mime_types['woff']  = 'application/x-font-woff';
		$mime_types['woff2'] = 'application/x-font-woff2';

		return $mime_types;
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

	static public function getAllFontObjects() {
		global $wpdb;

		$fonts = get_posts( array(
			'post_type'   => Brizy_Admin_Fonts_Main::CP_FONT,
			'post_status' => 'publish',
			'numberposts' => - 1,
		) );

		$result = array();

		foreach ( $fonts as $font ) {

			$weights = $wpdb->get_results( $wpdb->prepare(
				"SELECT m.meta_value FROM {$wpdb->posts} p 
						JOIN {$wpdb->postmeta} m ON  m.post_id=p.ID && p.post_parent=%d && m.meta_key='brizy-font-weight'",
				array( $font->ID ) ), ARRAY_A
			);

			$result[] = array(
				'family'  => $font->post_title,
				'weights' => array_map( function ( $v ) {
					return $v['meta_value'];
				}, $weights )
			);
		}

		return $result;
	}

	public function editorConfigFilter( $compilerParams ) {

		$compilerParams['uploaded_fonts'] = json_encode( self::getAllFontObjects() );

		return $compilerParams;
	}


}