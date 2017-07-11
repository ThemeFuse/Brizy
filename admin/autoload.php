<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

function _brizy_admin_autoload( $class ) {
	switch ( $class ) {
		case 'Brizy_Admin' :
			include_once 'class-brizy-admin.php';
			break;
		case 'Brizy_Admin_Settings' :
			include_once 'class-brizy-admin-settings.php';
			break;
		case 'Brizy_Flash' :
			include_once 'class-brizy-admin-flash.php';
			break;
	}
}

spl_autoload_register( '_brizy_admin_autoload' );

if ( is_admin() ) {
	Brizy_Admin::_init();
	Brizy_Admin_Settings::_init();
	Brizy_Flash::_init();
}