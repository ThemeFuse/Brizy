<?php
/**
 * PHPUnit bootstrap file
 *
 * @package Brizy
 */
define( 'PLUGIN_DIR', __DIR__ . "/../" );
define( 'TEST_DIR', __DIR__ );
define( 'ABSPATH', __DIR__ . "/../../../../" );
define( 'WP_USE_THEMES', false );


error_reporting( E_CORE_ERROR | E_CORE_WARNING | E_COMPILE_ERROR | E_ERROR | E_WARNING | E_PARSE | E_USER_ERROR | E_USER_WARNING | E_RECOVERABLE_ERROR );

if ( file_exists( ABSPATH . 'wp-config.test.php' ) ) {

	/** The config file resides in ABSPATH */
	require_once( ABSPATH . 'wp-config.test.php' );

} else {

	throw new Exception('Create the test config. File name: wp-config.test.php');
}

// A config file doesn't exist

require_once( ABSPATH . WPINC . '/load.php' );

// Standardize $_SERVER variables across setups.
wp_fix_server_vars();

require_once( ABSPATH . WPINC . '/functions.php' );

include_once PLUGIN_DIR . '/autoload.php';
