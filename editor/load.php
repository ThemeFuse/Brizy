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

	if(Brizy_Editor::is_user_allowed())
	{
		$api_instance = Brizy_Editor_API::instance( $project, $post );
		$api_instance->initialize();
	}

}


add_action( 'parse_request', 'editor_proxy_handler', - 1000 );
add_action( 'parse_request', 'front_end_proxy_handler', - 1000 );


function editor_proxy_handler() {

	if ( strpos( $_SERVER["REQUEST_URI"], "/brizy-proxy" ) !== false ) {
		session_write_close();
		$parts = explode( "/brizy-proxy", $_SERVER["REQUEST_URI"] );
		if ( ! $parts[1] ) {
			return;
		}
		$url = Brizy_Config::EDITOR_STATIC_URL . $parts[1];

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

	$str_splitter = "wp-content/uploads/brizy/";
	if ( strpos( $query->request, $str_splitter ) !== false ) {
		session_write_close();

		$parts = explode( $str_splitter, $_SERVER["REQUEST_URI"] );

		if ( ! $parts[1] ) {
			return;
		}

		$asset_path   = DIRECTORY_SEPARATOR . path_join( $str_splitter, $parts[1] );
		$asset_source = "http://bitblox-compiler.local/test-page";

		$pid = url_to_postid( $_SERVER['HTTP_REFERER'] );

		if ( ! $pid ) {
			return;
		}

		$post = Brizy_Editor_Post::get( $pid );

		if ( ! $post->uses_editor() ) {
			return;
		}

		$post = Brizy_Editor_Post::get( $pid );

		if ( $post->isStoreAssets() ) {
			$post->store_asset( $asset_source, $asset_path )
			     ->setStoreAssets( false )
			     ->save();
		}

		// we found a file that is loaded from remote server.. we shuold 302 redirect it to the right address
		$full_url = $asset_source . $_SERVER["REQUEST_URI"];
		wp_redirect( $full_url, 302 );
		exit;
	}
}
