<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}


if ( is_admin() ) {
	Brizy_Admin_Main::_init();
	Brizy_Admin_Settings::_init();

	Brizy_Admin_Flash::instance()
	                 ->initialize(); // initialize flash
}