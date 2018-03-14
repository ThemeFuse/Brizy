<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 12/11/17
 * Time: 2:35 PM
 */

function microtime_float() {
	list( $usec, $sec ) = explode( " ", microtime() );

	return ( (float) $usec + (float) $sec );
}

class Brizy_Editor_Assets {


	/**
	 * @var Brizy_Editor_Project
	 */
	private $project;

	/**
	 * @var Brizy_Editor_Post
	 */
	private $post;


	/**
	 * Brizy_Editor_Assets constructor.
	 *
	 * @param Brizy_Editor_Project $project
	 * @param Brizy_Editor_Post $post
	 */
	public function __construct( $project, $post = null ) {

		$this->post    = $post;
		$this->project = $project;

		try {

			add_action( 'parse_request', array( $this, 'handle_editor_assets' ), - 1000 );

			add_action( 'parse_request', array( $this, 'handle_media_proxy_handler' ), - 1000 );

			if ( ! $this->post ) {
				return;
			}

			add_action( 'parse_request', array( $this, 'handle_front_end_editor_assets' ), - 1000 );



		} catch ( Exception $e ) {

			if ( defined( 'BRIZY_DUMP_EXCEPTION' ) ) {
				var_dump( $e );
			}

			header( ' 500 Internal Server Error', true, 500 );
			exit;
		}
	}

	/**
	 * @param $query
	 */
	function handle_editor_assets( $query ) {

		if ( strpos( $_SERVER["REQUEST_URI"], Brizy_Config::LOCAL_EDITOR_ASSET_STATIC_URL ) === false ) {
			return;
		}

		$upload_dir_info = wp_upload_dir( null, true );

		session_write_close();


		$local_editor_asset_static_url = $this->project->get_asset_path();

		$parts = explode( $local_editor_asset_static_url, $_SERVER["REQUEST_URI"] );
		if ( ! $parts[1] ) {
			return;
		}

		$asset_path = $parts[1];

		$url = $this->project->get_asset_url() . $parts[1];

		$editor = Brizy_Editor_Editor_Editor::get( $this->project, $this->post );

		$path = $local_editor_asset_static_url . $asset_path;

		$local_file_name = $upload_dir_info['basedir'] . $path;

		$file_exists = file_exists( $local_file_name );

		$asset_url = $editor->get_asset_url() . $asset_path;

		if ( $file_exists ) {
			$this->asset_redirect_to( $asset_url );
			exit;
		}

		//if ( ! BRIZY_DEVELOPMENT && $res = $this->project->isStoreAssets() && ! $file_exists ) {

		if ( ! BRIZY_DEVELOPMENT ) {
			$time_start = microtime_float();

			if ( ! $editor->store_asset( $url, $local_file_name ) ) {
				global $wp_query;
				$wp_query->set_404();
				status_header( 404 );
				exit;
			}

			$time = microtime_float() - $time_start;
			header( "X-request-time: {$time}s" );

		}

		// send the url content
		$this->send_file_content( $url );
	}

	/**
	 * @param $query
	 */
	function handle_front_end_editor_assets( $query ) {
		$str_splitter = rtrim( sprintf( Brizy_Config::LOCAL_PAGE_ASSET_STATIC_URL, "" ), '/' );

		$parts = preg_split( Brizy_Config::LOCAL_PAGE_ASSET_SPLITTER, $_SERVER['REQUEST_URI'] );
		preg_match( Brizy_Config::LOCAL_PAGE_ASSET_SPLITTER, $_SERVER['REQUEST_URI'], $matches );

		if ( count( $parts ) != 2 || count( $matches ) != 3 ) {
			return;
		}

		$template_version = $matches[1];
		$post_id = (int)$matches[2];

		session_write_close();

		$upload_dir_info = wp_upload_dir( null, true );

		$editor = Brizy_Editor_Editor_Editor::get( $this->project, $this->post );

		$template_asset_path = $parts[1];

		$asset_path = sprintf( Brizy_Config::BRIZY_WP_PAGE_ASSET_PATH . $template_asset_path, $template_version, $post_id );

		if ( ! $this->post->uses_editor() ) {
			return;
		}

		$local_file_name = $upload_dir_info['basedir'] . $asset_path;

		$file_exists = file_exists( $local_file_name );

		$asset_url = $upload_dir_info['baseurl'] . $asset_path;

		if ( $file_exists ) {
			$this->asset_redirect_to( $asset_url );
			exit;
		}

		$full_url = $this->project->get_asset_url() . $template_asset_path;

		if ( ! BRIZY_DEVELOPMENT ) {
			$time_start = microtime_float();
			if ( ! $editor->store_asset( $full_url, $local_file_name ) ) {
				global $wp_query;
				$wp_query->set_404();
				status_header( 404 );
				exit;
			}
			$time = microtime_float() - $time_start;
			header( "X-request-time: {$time}s" );

		}

		$this->send_file_content( $full_url );
	}

	/**
	 * @param $query
	 */
	function handle_media_proxy_handler( $query ) {
		$str_splitter = Brizy_Config::LOCAL_PAGE_MEDIA_STATIC_URL;

		if ( strpos( $_SERVER['REQUEST_URI'], ltrim( $str_splitter, '/' ) ) !== false ) {


			session_write_close();

			$upload_dir_info = wp_upload_dir( null, true );

			$parts = explode( $str_splitter, $_SERVER["REQUEST_URI"] );

			if ( ! $parts[1] ) {
				return;
			}

			$template_asset_path = $parts[1];

			$asset_path = Brizy_Config::LOCAL_PAGE_MEDIA_STATIC_URL . $template_asset_path;

			$full_url = Brizy_Config::MEDIA_IMAGE_URL . $template_asset_path;

			$local_file_name = $upload_dir_info['basedir'] . $asset_path;
			$file_exists     = file_exists( $local_file_name );

			$asset_url = $upload_dir_info['baseurl'] . $asset_path;

			if ( $file_exists ) {
				$this->asset_redirect_to( $asset_url );
				exit;
			}

			if ( ! BRIZY_DEVELOPMENT ) {
				$time_start = microtime_float();

				$editor = Brizy_Editor_Editor_Editor::get( $this->project, $this->post );
				if ( ! $editor->store_asset( $full_url, $local_file_name ) ) {
					global $wp_query;
					$wp_query->set_404();
					status_header( 404 );
					exit;
				}

				$time = microtime_float() - $time_start;

				header( "X-request-time: {$time}s" );
			}

			$this->send_file_content( $full_url );
		}
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

	/**
	 * @param $url
	 */
	private function send_file_content( $url ) {

//		header( "location: {$url}" );
//		exit;

		$response = wp_remote_get( $url, array( 'timeout' => 30 ) );

		if ( $response instanceof WP_Error ) {

			if ( defined( 'BRIZY_DUMP_EXCEPTION' ) ) {
				var_dump( $response );
			}

			header( ' 500 Internal Server Error', true, 500 );
			exit;
		}

		if ( $response['response']['code'] != 200 ) {

			header( $response['response']['message'], true, $response['response']['code'] );
			exit;
		}

		/**
		 * @var WP_HTTP_Requests_Response $http_response
		 */
		$http_response = $response['http_response'];
		$content       = $http_response->get_data();

		header_remove( 'Expires' );
		header_remove( 'Cache-Control' );
		header_remove( 'Pragma' );

		$headers                   = [];
		$headers['Content-Type']   = $this->get_mime( $url, 1 );
		$headers['Content-Length'] = strlen( $content );
		$headers['Cache-Control']  = 'max-age=600';

		foreach ( $headers as $key => $val ) {
			if ( is_array( $val ) ) {
				$val = implode( ', ', $val );
			}

			header( "{$key}: {$val}" );
		}

		echo $content;
		exit;
	}

	private function asset_redirect_to( $asset_url ) {
		// add cache headers for this request
		header_remove( 'Expires' );
		header_remove( 'Cache-Control' );
		header_remove( 'Pragma' );
		header( 'Cache-Control: max-age=600' );

		wp_redirect( $asset_url, 302 );
	}

}