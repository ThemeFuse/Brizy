<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

function _bitblox_wp_register_static_resources_autoload( $class ) {
	switch ( $class ) {
		case 'BitBlox_WP_Static' :
			include_once 'class-bitblox-wp-static.php';
			break;
		case 'BitBlox_WP_Static_Jquery' :
			include_once 'class-bitblox-wp-static-jquery.php';
			break;
		case 'BitBlox_WP_Static_Script' :
			include_once 'class-bitblox-wp-static-script.php';
			break;
		case 'BitBlox_WP_Static_Style' :
			include_once 'class-bitblox-wp-static-style.php';
			break;
		case 'BitBlox_WP_Static_Storage' :
			include_once 'class-bitblox-wp-static-storage.php';
			break;
	}
}

spl_autoload_register( '_bitblox_wp_register_static_resources_autoload' );