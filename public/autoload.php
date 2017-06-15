<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

function _bitblox_wp_public_autoload( $class ) {
	switch ( $class ) {
		case 'BitBlox_WP_Public' :
			include_once 'class-bitblox-wp-public.php';
			break;
	}
}

spl_autoload_register( '_bitblox_wp_public_autoload' );

BitBlox_WP_Public::_init();