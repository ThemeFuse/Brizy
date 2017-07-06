<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

/**
 * @param string $class
 */
function _bitblox_wp_api_autoload( $class ) {
	switch ( $class ) {
		case 'BitBlox_WP_API_Access_Token' :
			include_once 'class-bitblox-wp-api-access-token.php';
			break;
		case 'BitBlox_WP_API_Auth' :
			include_once 'class-bitblox-wp-api-auth.php';
			break;
		case 'BitBlox_WP_API_Client' :
			include_once 'class-bitblox-wp-api-client.php';
			break;
		case 'BitBlox_WP_API_Page' :
			include_once 'class-bitblox-wp-api-page.php';
			break;
		case 'BitBlox_WP_API_Exception' :
			include_once 'exception/class-bitblox-wp-api-exception.php';
			break;
		case 'BitBlox_WP_API_Project' :
			include_once 'class-bitblox-wp-api-project.php';
			break;
	}
}

spl_autoload_register( '_bitblox_wp_api_autoload' );