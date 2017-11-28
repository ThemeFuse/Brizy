<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

include_once 'functions.php';

add_action( 'wp_loaded', 'brizy_initialize_Brizy_Public_Api' );

function brizy_initialize_Brizy_Public_Api() {
	$pid  = brizy_get_current_post_id();
	$post = null;
	try {

		$project = Brizy_Editor_Project::get();

		if ( $pid ) {
			$post = Brizy_Editor_Post::get( $pid );
		}

	} catch ( Exception $e ) {
		return;
	}

	if ( Brizy_Editor::is_user_allowed() ) {
		$api_instance = Brizy_Editor_API::instance( $project, $post );
		$api_instance->initialize();
	}

}


add_action( 'parse_request', 'editor_proxy_handler', - 1000 );
add_action( 'parse_request', 'front_end_proxy_handler', - 1000 );


function editor_proxy_handler() {

	if ( strpos( $_SERVER["REQUEST_URI"], Brizy_Config::LOCAL_EDITOR_ASSET_STATIC_URL ) !== false && isset( $_SERVER['HTTP_REFERER'] ) ) {

		$pid = url_to_postid( $_SERVER['HTTP_REFERER'] );

		if ( ! $pid ) {
			return;
		}

		$project = Brizy_Editor_Project::get();
		$post    = Brizy_Editor_Post::get( $pid );

		session_write_close();
		$LOCAL_EDITOR_ASSET_STATIC_URL = $project->get_asset_path();

		$parts = explode( $LOCAL_EDITOR_ASSET_STATIC_URL, $_SERVER["REQUEST_URI"] );
		if ( ! $parts[1] ) {
			return;
		}

		$asset_path = $parts[1];

		$url = $project->get_asset_url() . $parts[1];

		$editor = Brizy_Editor_Editor_Editor::get( $project, $post );

		$path = $LOCAL_EDITOR_ASSET_STATIC_URL . $asset_path;

		if ( $res = $project->isStoreAssets() ) {

			$editor->store_asset( $url, $path );

			$project->setStoreAssets( ! $res );
			$project->save();

			$asset_url = $editor->get_asset_url() . $asset_path;

			wp_redirect( $asset_url, 302 );
			exit;
		}

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

		$headers['content-type'] = get_mime($url,1);

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


function front_end_proxy_handler( $query ) {

	$str_splitter = Brizy_Config::LOCAL_PAGE_ASSET_STATIC_URL;

	if ( strpos( $query->request, ltrim( $str_splitter, '/' ) ) !== false && isset( $_SERVER['HTTP_REFERER'] ) ) {
		session_write_close();

		$pid = url_to_postid( $_SERVER['HTTP_REFERER'] );

		if ( ! $pid ) {
			return;
		}

		$project = Brizy_Editor_Project::get();
		$post    = Brizy_Editor_Post::get( $pid );

		$str_splitter = sprintf( Brizy_Config::BRIZY_WP_PAGE_ASSET_PATH, $post->get_id() );

		$parts = explode( $str_splitter, $_SERVER["REQUEST_URI"] );

		if ( ! $parts[1] ) {
			return;
		}

		$template_asset_path = $parts[1];

		$asset_path = sprintf( Brizy_Config::BRIZY_WP_PAGE_ASSET_PATH . $template_asset_path, $post->get_id() );

		if ( ! $post->uses_editor() ) {
			return;
		}

		$full_url = $project->get_asset_url() . $template_asset_path;

		if ( $post->isStoreAssets() ) {
			$res = $post->store_asset( $full_url, $asset_path );
			$post->setStoreAssets( ! $res );
			$post->save();

			// we found a file that is loaded from remote server.. we shuold 302 redirect it to the right address
			wp_redirect( wp_guess_url(). '/' . $asset_path, 302 );
			exit;
		}

		// we found a file that is loaded from remote server.. we shuold 302 redirect it to the right address
		wp_redirect( $full_url, 302 );
		exit;
	}
}


function get_mime ($filename,$mode=0) {

	// mode 0 = full check
	// mode 1 = extension check only

	$mime_types = array(

		'txt' => 'text/plain',
		'htm' => 'text/html',
		'html' => 'text/html',
		'php' => 'text/html',
		'css' => 'text/css',
		'js' => 'application/javascript',
		'json' => 'application/json',
		'xml' => 'application/xml',
		'swf' => 'application/x-shockwave-flash',
		'flv' => 'video/x-flv',

		// images
		'png' => 'image/png',
		'jpe' => 'image/jpeg',
		'jpeg' => 'image/jpeg',
		'jpg' => 'image/jpeg',
		'gif' => 'image/gif',
		'bmp' => 'image/bmp',
		'ico' => 'image/vnd.microsoft.icon',
		'tiff' => 'image/tiff',
		'tif' => 'image/tiff',
		'svg' => 'image/svg+xml',
		'svgz' => 'image/svg+xml',

		// archives
		'zip' => 'application/zip',
		'rar' => 'application/x-rar-compressed',
		'exe' => 'application/x-msdownload',
		'msi' => 'application/x-msdownload',
		'cab' => 'application/vnd.ms-cab-compressed',

		// audio/video
		'mp3' => 'audio/mpeg',
		'qt' => 'video/quicktime',
		'mov' => 'video/quicktime',

		// adobe
		'pdf' => 'application/pdf',
		'psd' => 'image/vnd.adobe.photoshop',
		'ai' => 'application/postscript',
		'eps' => 'application/postscript',
		'ps' => 'application/postscript',

		// ms office
		'doc' => 'application/msword',
		'rtf' => 'application/rtf',
		'xls' => 'application/vnd.ms-excel',
		'ppt' => 'application/vnd.ms-powerpoint',
		'docx' => 'application/msword',
		'xlsx' => 'application/vnd.ms-excel',
		'pptx' => 'application/vnd.ms-powerpoint',


		// open office
		'odt' => 'application/vnd.oasis.opendocument.text',
		'ods' => 'application/vnd.oasis.opendocument.spreadsheet',
	);

	$array = explode( '.', $filename );
	$str   = end( $array );
	$ext   = strtolower( $str );

	if(function_exists('mime_content_type')&&$mode==0){
		$mimetype = mime_content_type($filename);
		return $mimetype;

	}elseif(function_exists('finfo_open')&&$mode==0){
		$finfo = finfo_open(FILEINFO_MIME);
		$mimetype = finfo_file($finfo, $filename);
		finfo_close($finfo);
		return $mimetype;
	}elseif(array_key_exists($ext, $mime_types)){
		return $mime_types[$ext];
	}else {
		return 'application/octet-stream';
	}

}
