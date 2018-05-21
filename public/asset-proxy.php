<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 4/19/18
 * Time: 3:48 PM
 */

class Brizy_Public_AssetProxy {

	const ENDPOINT = 'brizy';

	/**
	 * @var Brizy_Editor_UrlBuilder
	 */
	private $url_builder;


	private $config;


	/**
	 * Brizy_Public_AssetProxy constructor.
	 *
	 * @param $url_builder
	 * @param $config
	 */
	public function __construct( $url_builder, $config ) {
		add_action( 'wp', array( $this, 'process_query' ), - 1 );
		add_filter( 'query_vars', array( $this, 'query_vars' ) );

		$this->url_builder = $url_builder;
		$this->config      = $config;
	}

	public function process_query() {
		global $wp_query;

		// Check if user is not querying API
		if ( ! isset( $wp_query->query_vars[ self::ENDPOINT ] ) || ! is_string( $wp_query->query_vars[ self::ENDPOINT ] ) ) {
			return;
		}

		$asset_path = "/" . ltrim( $wp_query->query_vars[ self::ENDPOINT ], "/" );
		$asset_url  = $this->url_builder->external_asset_url( $asset_path );

		$tmp_asset_url = $this->url_builder->editor_asset_path( $asset_path );
		$new_path      = $this->url_builder->upload_path( $tmp_asset_url );

		if ( ! file_exists( $new_path ) ) {
			$store_result = $this->store_file( $asset_url, $new_path );

			if ( ! $store_result ) {
				global $wp_query;
				$wp_query->set_404();

				return;
			}
		}

		if ( file_exists( $new_path ) ) {

			$content = file_get_contents( $new_path );

			// send headers
			$headers                   = array();
			$headers['Content-Type']   = $this->get_mime( $new_path, 1 );
			$headers['Content-Length'] = strlen( $content );
			$headers['Cache-Control']  = 'max-age=600';

			foreach ( $headers as $key => $val ) {
				if ( is_array( $val ) ) {
					$val = implode( ', ', $val );
				}

				header( "{$key}: {$val}" );
			}
			// send file content
			echo $content;
			exit;
		}


		global $wp_query;
		$wp_query->set_404();

		return;

	}

	public function query_vars( $vars ) {
		$vars[] = self::ENDPOINT;

		return $vars;
	}


	/**
	 *
	 * This is code duplicate taken from Brizy_Editor_Asset_Storage
	 *
	 * @param $asset_source
	 * @param $asset_path
	 *
	 * @return bool
	 */
	public function store_file( $asset_source, $asset_path ) {

		try {
			// check destination dir
			$dir_path = dirname( $asset_path );

			if ( ! file_exists( $dir_path ) ) {
				mkdir( $dir_path, 0777, true );
			}


			$http        = new WP_Http();
			$wp_response = $http->request( $asset_source );

			if ( is_wp_error( $wp_response ) ) {
				return false;
			}

			$content = wp_remote_retrieve_body( $wp_response );

			file_put_contents( $asset_path, $content );

		} catch ( Exception $e ) {
			$t = 0;

			// clean up
			if ( $asset_path ) {
				@unlink( $asset_path );
			}

			return false;
		}

		return true;
	}

	/**
	 * @param $filename
	 * @param int $mode
	 *
	 * @return mixed|string
	 */
	private function get_mime( $filename, $mode = 0 ) {

		// mode 0 = full check
		// mode 1 = extension check only

		$mime_types = array(

			'txt'  => 'text/plain',
			'htm'  => 'text/html',
			'html' => 'text/html',
			'php'  => 'text/html',
			'css'  => 'text/css',
			'js'   => 'application/javascript',
			'json' => 'application/json',
			'xml'  => 'application/xml',
			'swf'  => 'application/x-shockwave-flash',
			'flv'  => 'video/x-flv',

			// images
			'png'  => 'image/png',
			'jpe'  => 'image/jpeg',
			'jpeg' => 'image/jpeg',
			'jpg'  => 'image/jpeg',
			'gif'  => 'image/gif',
			'bmp'  => 'image/bmp',
			'ico'  => 'image/vnd.microsoft.icon',
			'tiff' => 'image/tiff',
			'tif'  => 'image/tiff',
			'svg'  => 'image/svg+xml',
			'svgz' => 'image/svg+xml',

			// archives
			'zip'  => 'application/zip',
			'rar'  => 'application/x-rar-compressed',
			'exe'  => 'application/x-msdownload',
			'msi'  => 'application/x-msdownload',
			'cab'  => 'application/vnd.ms-cab-compressed',

			// audio/video
			'mp3'  => 'audio/mpeg',
			'qt'   => 'video/quicktime',
			'mov'  => 'video/quicktime',

			// adobe
			'pdf'  => 'application/pdf',
			'psd'  => 'image/vnd.adobe.photoshop',
			'ai'   => 'application/postscript',
			'eps'  => 'application/postscript',
			'ps'   => 'application/postscript',

			// ms office
			'doc'  => 'application/msword',
			'rtf'  => 'application/rtf',
			'xls'  => 'application/vnd.ms-excel',
			'ppt'  => 'application/vnd.ms-powerpoint',
			'docx' => 'application/msword',
			'xlsx' => 'application/vnd.ms-excel',
			'pptx' => 'application/vnd.ms-powerpoint',


			// open office
			'odt'  => 'application/vnd.oasis.opendocument.text',
			'ods'  => 'application/vnd.oasis.opendocument.spreadsheet',
		);

		$array = explode( '.', $filename );
		$str   = end( $array );
		$ext   = strtolower( $str );

		if ( function_exists( 'mime_content_type' ) && $mode == 0 ) {
			$mimetype = mime_content_type( $filename );

			return $mimetype;

		} elseif ( function_exists( 'finfo_open' ) && $mode == 0 ) {
			$finfo    = finfo_open( FILEINFO_MIME );
			$mimetype = finfo_file( $finfo, $filename );
			finfo_close( $finfo );

			return $mimetype;
		} elseif ( array_key_exists( $ext, $mime_types ) ) {
			return $mime_types[ $ext ];
		} else {
			return 'application/octet-stream';
		}
	}
}