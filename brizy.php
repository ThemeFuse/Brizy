<?php

/**
 * Plugin Name: Brizy
 * Plugin URI: http://brizy.io/
 * Description: A free drag & drop framework that comes with a bunch of built in extensions that will help you develop premium themes fast & easy.
 * Version: 0.9.0
 * Author: ThemeFuse
 * Author URI: http://themefuse.com
 * License: GPL2+
 * Text Domain: brizy
 * Domain Path: /languages
 */

define( 'BRIZY_VERSION', '0.1.0' );

/**.
 * @param $class_name
 */
function _brizy_autoload( $class_name ) {
	$class_parts = explode( '_', $class_name );
	$last_part   = end( $class_parts );
	$path_parts  = array_slice( $class_parts, 0, count( $class_parts ) - 1 );
	$path        = implode( DIRECTORY_SEPARATOR, $path_parts );

	// works only for brizy
	if ( $class_parts[0] != 'Brizy' ) {
		return;
	}

	$matches = [];
	preg_match_all( '/(.[a-z]+|.[A-Z]+|.[A-Z].[a-z]+)/', $last_part, $matches );

	if ( count( $matches[1] ) > 1 ) {
		$file_name = implode( '-', $matches[1] );
	} else {
		$file_name = $matches[1][0];
	}

	$include_path = WP_CONTENT_DIR . DIRECTORY_SEPARATOR . "plugins" . DIRECTORY_SEPARATOR . strtolower( $path . DIRECTORY_SEPARATOR . $file_name . ".php" );

	include_once $include_path;
}

spl_autoload_register( '_brizy_autoload' );

include_once 'editor/load.php';
include_once 'shortcodes/load.php';
include_once 'public/hooks.php';
include_once 'admin/load.php';


function _action_brizy_load_text_domain() {
	load_plugin_textdomain(
		'brizy',
		false,
		dirname( __FILE__ ) . DIRECTORY_SEPARATOR . 'languages'
	);
}

add_action( 'after_setup_theme', '_action_brizy_load_text_domain' );

Brizy_Editor_API::init();