<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 12/11/17
 * Time: 2:35 PM
 */

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
	public function __construct( $project, $post ) {

		$this->post    = $post;
		$this->project = $project;

		if ( isset( $_SERVER['HTTP_REFERER'] ) ) {
			try {

				if ( ! $this->post ) {
					return;
				}

				add_action( 'parse_request', array( $this, 'handle_editor_assets' ), - 1000 );

				add_action( 'parse_request', array( $this, 'handle_front_end_editor_assets' ), - 1000 );

				add_action( 'parse_request', array( $this, 'handle_media_proxy_handler' ), - 1000 );
			} catch ( Exception $e ) {
				header( ' 500 Internal Server Error', true, 500 );
				exit;
			}
		}
	}

	/**
	 * @param $query
	 */
	function handle_editor_assets( $query ) {

		if ( strpos( $_SERVER["REQUEST_URI"], Brizy_Config::LOCAL_EDITOR_ASSET_STATIC_URL ) === false ) {
			return;
		}

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

		$file_exists = file_exists( rtrim( ABSPATH, '/' ) . $path );

		if ( $file_exists ) {
			$asset_url = $editor->get_asset_url() . $asset_path;

			wp_redirect( $asset_url, 302 );
			exit;
		}

		if ( BRIZY_ENV != 'dev' && $res = $this->project->isStoreAssets() && ! $file_exists ) {

			$editor->store_asset( $url, $path );

			$this->project->setStoreAssets( ! $res );
			$this->project->save();

			$asset_url = $editor->get_asset_url() . $asset_path;

			wp_redirect( $asset_url, 302 );
			exit;
		}

		// send the url content
		$this->send_file_content( $url );
	}

	/**
	 * @param $query
	 */
	function handle_front_end_editor_assets( $query ) {

		$str_splitter = Brizy_Config::LOCAL_PAGE_ASSET_STATIC_URL;

		if ( strpos( $query->request, ltrim( $str_splitter, '/' ) ) !== false && isset( $_SERVER['HTTP_REFERER'] ) ) {
			session_write_close();

			$editor = Brizy_Editor_Editor_Editor::get( $this->project, $this->post );

			$str_splitter = sprintf( Brizy_Config::BRIZY_WP_PAGE_ASSET_PATH, $this->post->get_id() );

			$parts = explode( $str_splitter, $_SERVER["REQUEST_URI"] );

			if ( ! $parts[1] ) {
				return;
			}

			$template_asset_path = $parts[1];

			$asset_path = sprintf( Brizy_Config::BRIZY_WP_PAGE_ASSET_PATH . $template_asset_path, $this->post->get_id() );

			if ( ! $this->post->uses_editor() ) {
				return;
			}

			$full_url = $this->project->get_asset_url() . $template_asset_path;

			$file_exists = file_exists( rtrim( ABSPATH, '/' ) . $asset_path );

			if ( $file_exists ) {
				$asset_url = $editor->get_asset_url() . $asset_path;

				wp_redirect( $asset_url, 302 );
				exit;
			}

			if ( BRIZY_ENV != 'dev' && $this->post->isStoreAssets() ) {
				$res = $this->post->store_asset( $full_url, $asset_path );
				$this->post->setStoreAssets( ! $res );
				$this->post->save();

				// we found a file that is loaded from remote server.. we shuold 302 redirect it to the right address
				wp_redirect( get_site_url() . '/' . $asset_path, 302 );
				exit;
			}

			$this->send_file_content( $full_url );
		}
	}

	/**
	 * @param $query
	 */
	function handle_media_proxy_handler( $query ) {
		$str_splitter = Brizy_Config::LOCAL_PAGE_MEDIA_STATIC_URL;

		if ( strpos( $query->request, ltrim( $str_splitter, '/' ) ) !== false && isset( $_SERVER['HTTP_REFERER'] ) ) {


			session_write_close();

			$editor = Brizy_Editor_Editor_Editor::get( $this->project, $this->post );

			$parts = explode( $str_splitter, $_SERVER["REQUEST_URI"] );

			if ( ! $parts[1] ) {
				return;
			}

			$template_asset_path = $parts[1];

			$asset_path = Brizy_Config::LOCAL_PAGE_MEDIA_STATIC_URL . $template_asset_path;

			if ( ! $this->post->uses_editor() ) {
				return;
			}

			$full_url = Brizy_Config::MEDIA_IMAGE_URL . $template_asset_path;

			$file_exists = file_exists( rtrim( ABSPATH, '/' ) . $asset_path );

			if ( $file_exists ) {
				$asset_url = $editor->get_asset_url() . $asset_path;

				wp_redirect( $asset_url, 302 );
				exit;
			}

			if ( BRIZY_ENV != 'dev' && $this->post->isStoreAssets() ) {
				$res = $this->post->store_asset( $full_url, $asset_path );
				$this->post->setStoreAssets( ! $res );
				$this->post->save();

				// we found a file that is loaded from remote server.. we shuold 302 redirect it to the right address
				wp_redirect( get_site_url() . '/' . $asset_path, 302 );
				exit;
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
// send the url content

		$response = wp_remote_get( $url );

		if ( $response instanceof WP_Error ) {
			return;
		}

		/**
		 * @var WP_HTTP_Requests_Response $http_response
		 */
		$http_response = $response['http_response'];

		$headers = $http_response->get_headers()->getAll();

		unset( $headers['server'] );
		unset( $headers['content-encoding'] );
		unset( $headers['cache-control'] );

		$headers['content-type'] = $this->get_mime( $url, 1 );

		foreach ( $headers as $key => $val ) {
			if ( is_array( $val ) ) {
				$val = implode( ', ', $val );
			}

			header( "{$key}: {$val}" );
		}


		echo $http_response->get_data();
		exit;
	}

}