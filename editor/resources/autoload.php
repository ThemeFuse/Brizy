<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

function _brizy_register_static_resources_autoload( $class ) {
	switch ( $class ) {
		case 'Brizy_Editor_Resources_Static' :
			include_once 'class-brizy-static.php';
			break;
		case 'Brizy_Editor_Resources_StaticJquery' :
			include_once 'class-brizy-static-jquery.php';
			break;
		case 'Brizy_Editor_Resources_StaticScript' :
			include_once 'class-brizy-static-script.php';
			break;
		case 'Brizy_Editor_Resources_StaticStyle' :
			include_once 'class-brizy-static-style.php';
			break;
		case 'Brizy_Editor_Resources_StaticStorage' :
			include_once 'class-brizy-static-storage.php';
			break;
	}
}

spl_autoload_register( '_brizy_register_static_resources_autoload' );