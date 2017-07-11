<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

/**
 * @param string $class
 */
function _brizy_includes_autoload( $class ) {
	switch ( $class ) {
		case 'Brizy_WP' :
			include_once 'class-brizy.php';
			break;
		case 'Brizy_Uploads_Dir' :
			include_once 'class-brizy-uploads-dir.php';
			break;
		case 'Brizy_DOM' :
			include_once 'helpers/class-brizy-dom.php';
			break;
		case 'Brizy_DOM_Tag' :
			include_once 'helpers/class-brizy-dom-tag.php';
			break;
		case 'Brizy_View' :
			include_once 'class-brizy-view.php';
			break;
		case 'Brizy_User' :
			include_once 'class-brizy-user.php';
			break;
		case 'Brizy_Editor' :
			include_once 'editor/class-brizy-editor.php';
			break;
		case 'Brizy_Editor_API' :
			include_once 'editor/class-brizy-editor-api.php';
			break;
		case 'Brizy_Constants' :
			include_once 'class-brizy-constants.php';
			break;
		case 'Brizy_Exception' :
			include_once 'exception/class-brizy-exception.php';
			break;
		case 'Brizy_Exception_Access_Denied' :
			include_once 'exception/class-brizy-exception-access-denied.php';
			break;
		case 'Brizy_Exception_Service_Unavailable' :
			include_once 'exception/class-brizy-exception-service-unavailable.php';
			break;
		case 'Brizy_Exception_Invalid_Content' :
			include_once 'exception/class-brizy-exception-invalid-content.php';
			break;
		case 'Brizy_Exception_Not_Found' :
			include_once 'exception/class-brizy-exception-not-found.php';
			break;
		case 'Brizy_Exception_Not_Brizy_Page' :
			include_once 'exception/class-brizy-exception-not-brizy-page.php';
			break;
		case 'Brizy_Exception_Unsupported_Post_Type' :
			include_once 'exception/class-brizy-exception-unsupported-post-type.php';
			break;
		case 'Brizy_Post_Storage' :
			include_once 'storage/class-brizy-post-storage.php';
			break;
		case 'Brizy_Storage' :
			include_once 'storage/class-brizy-storage.php';
			break;
		case 'Brizy_Storage_Model' :
			include_once 'storage/class-brizy-storage-model.php';
			break;
		case 'Brizy_Dump' :
			include_once 'dev/class-brizy-dump.php';
			break;
		case 'Brizy_Project' :
			include_once 'class-brizy-project.php';
			break;
		case 'Brizy_Project_Html' :
			include_once 'class-brizy-project-html.php';
			break;
		case 'Brizy_Post' :
			include_once 'class-brizy-post.php';
			break;

	}
}

spl_autoload_register( '_brizy_includes_autoload' );

include_once 'static-resources/autoload.php';
include_once 'api/autoload.php';
include_once 'http/autoload.php';
include_once 'media/autoload.php';
include_once 'functions.php';