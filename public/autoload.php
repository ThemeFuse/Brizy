<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

function _brizy_public_autoload( $class ) {
	switch ( $class ) {
		case 'Brizy_Public' :
			include_once 'class-brizy-public.php';
			break;
	}
}

spl_autoload_register( '_brizy_public_autoload' );

include_once dirname( __FILE__ ) . '/hooks.php';

add_action( 'after_setup_theme', array( 'Brizy_Public', '_init' ) );