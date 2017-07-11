<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

/**
 * @param string $class
 */
function _brizy_api_autoload( $class ) {
	switch ( $class ) {
		case 'Brizy_API_Access_Token' :
			include_once 'class-brizy-api-access-token.php';
			break;
		case 'Brizy_API_Auth' :
			include_once 'class-brizy-api-auth.php';
			break;
		case 'Brizy_API_Client' :
			include_once 'class-brizy-api-client.php';
			break;
		case 'Brizy_API_Page' :
			include_once 'class-brizy-api-page.php';
			break;
		case 'Brizy_API_Exception' :
			include_once 'exception/class-brizy-api-exception.php';
			break;
		case 'Brizy_API_Project' :
			include_once 'class-brizy-api-project.php';
			break;
	}
}

spl_autoload_register( '_brizy_api_autoload' );