<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

function _bitblox_wp_admin_autoload( $class ) {
	switch ( $class ) {
		case 'BitBlox_WP_Admin' :
			include_once 'class-bitblox-wp-admin.php';
			break;
		case 'BitBlox_WP_Admin_Settings' :
			include_once 'class-bitblox-wp-admin-settings.php';
			break;
		case 'BitBlox_WP_Flash' :
			include_once 'class-bitblox-wp-admin-flash.php';
			break;
	}
}

spl_autoload_register( '_bitblox_wp_admin_autoload' );

if ( is_admin() ) {
	BitBlox_WP_Admin::_init();
	BitBlox_WP_Admin_Settings::_init();
	BitBlox_WP_Flash::_init();
}