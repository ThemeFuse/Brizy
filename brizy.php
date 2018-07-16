<?php
/**
 * Plugin Name: Brizy
 * Description: A free drag & drop front-end page builder to help you create WordPress pages lightning fast. It's easy with Brizy.
 * Plugin URI: https://brizy.io/
 * Author: Brizy.io
 * Author URI: https://brizy.io/
 * Version: 1.0.19
 * Text Domain: brizy
 * License: GPLv3
 * Domain Path: /languages
 */

/**
 * This will fix the url protocol for websites that are working behind a load balancer
 */
if ( isset( $_SERVER['HTTP_X_FORWARDED_PROTO'] ) && stripos( $_SERVER['HTTP_X_FORWARDED_PROTO'], 'https' ) !== false ) {
	$_SERVER['HTTPS'] = 'on';
}

define( 'BRIZY_DEVELOPMENT', false );
define( 'BRIZY_LOG', false );
define( 'BRIZY_VERSION', '1.0.19' );
define( 'BRIZY_EDITOR_VERSION', '1.0.44' );
define( 'BRIZY_FILE', __FILE__ );
define( 'BRIZY_PLUGIN_BASE', plugin_basename( BRIZY_FILE ) );
define( 'BRIZY_PLUGIN_PATH', dirname( BRIZY_FILE ) );
define( 'BRIZY_PLUGIN_URL', rtrim( plugin_dir_url( BRIZY_FILE ), "/" ) );

include_once 'autoload.php';

function brizy_install() {
	Brizy_Logger::install();
}

function brizy_clean() {
	Brizy_Logger::clean();
}

register_activation_hook( __FILE__, 'brizy_install' );
register_deactivation_hook( __FILE__, 'brizy_clean' );

add_action( 'plugins_loaded', 'brizy_load' );

function brizy_load() {
	include_once 'editor/load.php';
	include_once 'shortcode/load.php';
	include_once 'public/hooks.php';
	include_once 'admin/load.php';
}

