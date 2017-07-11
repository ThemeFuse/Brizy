<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

/**
 * @param string $class
 */
function _brizy_http_autoload( $class ) {
	switch ( $class ) {
		case 'Brizy_Http' :
			include_once 'class-brizy-http.php';
			break;
		case 'Brizy_Http_Response' :
			include_once 'class-brizy-http-response.php';
			break;
		case 'Brizy_Http_Response_Exception' :
			include_once 'exception/class-brizy-http-response-exception.php';
			break;
		case 'Brizy_Http_Response_Exception_Bad_Request' :
			include_once 'exception/class-brizy-http-response-exception-bad-request.php';
			break;
		case 'Brizy_Http_Response_Exception_Not_Found' :
			include_once 'exception/class-brizy-http-response-exception-not-found.php';
			break;
		case 'Brizy_Http_Response_Exception_Unauthorized' :
			include_once 'exception/class-brizy-http-response-exception-unauthorized.php';
			break;

	}
}

spl_autoload_register( '_brizy_http_autoload' );