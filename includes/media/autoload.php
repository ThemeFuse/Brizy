<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

function _brizy_media_autoload( $class ) {
	switch ( $class ) {
		case 'Brizy_Media_Upload' :
			include_once 'class-brizy-media-upload.php';
			break;
		case 'Brizy_Media' :
			include_once 'class-brizy-media.php';
			break;
	}
}

spl_autoload_register( '_brizy_media_autoload' );