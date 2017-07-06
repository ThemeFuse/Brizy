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

include_once dirname( __FILE__ ) . '/hooks.php';

add_action( 'after_setup_theme', array( 'BitBlox_WP_Public', '_init' ) );