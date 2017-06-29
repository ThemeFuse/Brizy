<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

function _bitblox_wp_media_autoload( $class ) {
	switch ( $class ) {
		case 'BitBlox_WP_Media_Upload' :
			include_once 'class-bitblox-wp-media-upload.php';
			break;
		case 'BitBlox_WP_Media' :
			include_once 'class-bitblox-wp-media.php';
			break;
	}
}

spl_autoload_register( '_bitblox_wp_media_autoload' );