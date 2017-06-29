<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

/**
 * @param string $class
 */
function _bitblox_wp_http_autoload( $class ) {
	switch ( $class ) {
		case 'BitBlox_WP_Http' :
			include_once 'class-bitblox-wp-http.php';
			break;
		case 'BitBlox_WP_Http_Response' :
			include_once 'class-bitblox-wp-http-response.php';
			break;
		case 'BitBlox_WP_Http_Response_Exception' :
			include_once 'exception/class-bitblox-wp-http-response-exception.php';
			break;
		case 'BitBlox_WP_Http_Response_Exception_Bad_Request' :
			include_once 'exception/class-bitblox-wp-http-response-exception-bad-request.php';
			break;
		case 'BitBlox_WP_Http_Response_Exception_Not_Found' :
			include_once 'exception/class-bitblox-wp-http-response-exception-not-found.php';
			break;
		case 'BitBlox_WP_Http_Response_Exception_Unauthorized' :
			include_once 'exception/class-bitblox-wp-http-response-exception-unauthorized.php';
			break;

	}
}

spl_autoload_register( '_bitblox_wp_http_autoload' );