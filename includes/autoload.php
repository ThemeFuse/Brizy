<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

/**
 * @param string $class
 */
function _bitblox_wp_includes_autoload( $class ) {
	switch ( $class ) {
		case 'BitBlox_WP' :
			include_once 'class-bitblox-wp.php';
			break;
		case 'BitBlox_WP_Uploads_Dir' :
			include_once 'class-bitblox-wp-uploads-dir.php';
			break;
		case 'BitBlox_WP_DOM' :
			include_once 'helpers/class-bitblox-wp-dom.php';
			break;
		case 'BitBlox_WP_DOM_Tag' :
			include_once 'helpers/class-bitblox-wp-dom-tag.php';
			break;
		case 'BitBlox_WP_View' :
			include_once 'class-bitblox-wp-view.php';
			break;
		case 'BitBlox_WP_Page' :
			include_once 'class-bitblox-wp-page.php';
			break;
		case 'BitBlox_WP_User' :
			include_once 'class-bitblox-wp-user.php';
			break;
		case 'BitBlox_WP_Editor' :
			include_once 'editor/class-bitblox-wp-editor.php';
			break;
		case 'BitBlox_WP_Editor_API' :
			include_once 'editor/class-bitblox-wp-editor-api.php';
			break;
		case 'BitBlox_WP_Constants' :
			include_once 'class-bitblox-wp-constants.php';
			break;
		case 'BitBlox_WP_Exception' :
			include_once 'exception/class-bitblox-wp-exception.php';
			break;
		case 'BitBlox_WP_Exception_Access_Denied' :
			include_once 'exception/class-bitblox-wp-exception-access-denied.php';
			break;
		case 'BitBlox_WP_Exception_Service_Unavailable' :
			include_once 'exception/class-bitblox-wp-exception-service-unavailable.php';
			break;
		case 'BitBlox_WP_Exception_Invalid_Content' :
			include_once 'exception/class-bitblox-wp-exception-invalid-content.php';
			break;
		case 'BitBlox_WP_Exception_Not_Found' :
			include_once 'exception/class-bitblox-wp-exception-not-found.php';
			break;
		case 'BitBlox_WP_Exception_Not_BitBlox_Page' :
			include_once 'exception/class-bitblox-wp-exception-not-bitblox-page.php';
			break;
		case 'BitBlox_WP_Exception_Unsupported_Post_Type' :
			include_once 'exception/class-bitblox-wp-exception-unsupported-post-type.php';
			break;
		case 'BitBlox_WP_Post_Storage' :
			include_once 'storage/class-bitblox-wp-post-storage.php';
			break;
		case 'BitBlox_WP_Storage' :
			include_once 'storage/class-bitblox-wp-storage.php';
			break;
		case 'BitBlox_WP_Storage_Model' :
			include_once 'storage/class-bitblox-wp-storage-model.php';
			break;
		case 'BitBlox_WP_Dump' :
			include_once 'dev/class-bitblox-wp-dump.php';
			break;
		case 'BitBlox_WP_Project' :
			include_once 'class-bitblox-wp-project.php';
			break;

	}
}

spl_autoload_register( '_bitblox_wp_includes_autoload' );

include_once 'static-resources/autoload.php';
include_once 'api/autoload.php';
include_once 'http/autoload.php';
include_once 'media/autoload.php';
include_once 'functions.php';