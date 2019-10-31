<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 1/11/19
 * Time: 10:59 AM
 */


class Brizy_Admin_Fonts_Main {

	const CP_FONT = 'brizy-font';
	const SVG_MIME = 'image/svg+xml';

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
		add_filter( 'upload_mimes', array( $this, 'addFOntTypes' ) );
		add_filter( 'wp_check_filetype_and_ext', array( $this, 'wp_check_filetype_and_ext' ), 10, 4 );
		add_filter( 'wp_prepare_attachment_for_js', [ $this, 'wp_prepare_attachment_for_js' ], 10, 3 );
		add_filter( 'wp_handle_upload_prefilter', array( $this, 'wp_handle_upload_prefilter' ) );

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
		$mime_types['svg']   = self::SVG_MIME;

		return $mime_types;
	}

	public function wp_handle_upload_prefilter( $file ) {
		if ( self::SVG_MIME !== $file['type'] ) {
			return $file;
		}

		$dirtySVG = file_get_contents( $file['tmp_name'] );

		$sanitizer = new \enshrined\svgSanitize\Sanitizer();
		$cleanSVG  = $sanitizer->sanitize( $dirtySVG );
		file_put_contents( $file['tmp_name'], $cleanSVG );

		return $file;
	}

	/**
	 * @param $data
	 * @param $file
	 * @param $filename
	 * @param $mimes
	 * @param $real_mime
	 *
	 * @return array
	 */
	public function wp_check_filetype_and_ext( $data, $file, $filename, $mimes ) {

		if ( ! $data['ext'] ) {

			// Do basic extension validation and MIME mapping
			$wp_filetype = wp_check_filetype( $filename, $mimes );
			$ext         = $wp_filetype['ext'];
			$type        = $wp_filetype['type'];

			if ( $ext === 'svg' ) {
				return array( 'ext' => $ext, 'type' => $type, 'proper_filename' => false );
			}
			if ( $ext === 'ttf' ) {
				return array( 'ext' => $ext, 'type' => 'application/x-font-ttf', 'proper_filename' => false );
			}
			if ( $ext === 'eot' ) {
				return array( 'ext' => $ext, 'type' => 'application/vnd.ms-fontobject', 'proper_filename' => false );
			}
			if ( $ext === 'woff' ) {
				return array( 'ext' => $ext, 'type' => 'application/x-font-woff', 'proper_filename' => false );
			}
			if ( $ext === 'woff2' ) {
				return array( 'ext' => $ext, 'type' => 'application/x-font-woff2', 'proper_filename' => false );
			}
		}

		return $data;
	}

	/**
	 * @param $attachment_data
	 * @param $attachment
	 * @param $meta
	 *
	 * @return mixed
	 */
	public function wp_prepare_attachment_for_js( $attachment_data, $attachment, $meta ) {

		if ( 'image' !== $attachment_data['type'] || 'svg+xml' !== $attachment_data['subtype'] ) {
			return $attachment_data;
		}

		if ( ! class_exists( 'SimpleXMLElement' ) ) {
			return $attachment_data;
		}

		$svg = file_get_contents( get_attached_file( $attachment->ID ) );

		if ( ! $svg ) {
			return $attachment_data;
		}

		try {
			$svg    = new \SimpleXMLElement( $svg );
			$width  = (int) $svg['width'];
			$height = (int) $svg['height'];
		} catch ( \Exception $e ) {
			return $attachment_data;
		}

		$src         = $url = $attachment_data['url'];
		$orientation = $height > $width ? 'portrait' : 'landscape';

		// Media Gallery
		$attachment_data['image']         = compact( 'src', 'width', 'height' );
		$attachment_data['thumb']         = compact( 'src', 'width', 'height' );
		$attachment_data['sizes']['full'] = compact( 'url', 'height', 'width', 'orientation' );

		return $attachment_data;
	}


	public static function registerCustomPosts() {

		$labels = array(
			'name' => _x( 'Fonts', 'post type general name' ),
		);

		register_post_type( self::CP_FONT,
			array(
				'labels'              => $labels,
				'public'              => false,
				'has_archive'         => false,
				'description'         => __bt( 'brizy', 'Brizy' ) . ' ' . __( 'font', 'brizy' ) . '.',
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