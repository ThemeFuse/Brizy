<?php
/**
 * Plugin Name: Brizy
 * Description: A free drag & drop front-end page builder to help you create WordPress pages lightning fast. It's easy with Brizy.
 * Plugin URI: https://brizy.io/
 * Author: Brizy.io
 * Author URI: https://brizy.io/
 * Version: 1.0.6
 * Text Domain: brizy
 * License: GPLv3
 * Domain Path: /languages
 */

define( 'BRIZY_DEVELOPMENT', false );
define( 'BRIZY_VERSION', '1.0.6' );
define( 'BRIZY_EDITOR_VERSION', '1.0.23' );
define( 'BRIZY_FILE', __FILE__ );
define( 'BRIZY_PLUGIN_BASE', plugin_basename( BRIZY_FILE ) );
define( 'BRIZY_PLUGIN_PATH', dirname( BRIZY_FILE ) );
define( 'BRIZY_PLUGIN_URL', plugin_dir_url( BRIZY_FILE ) );

function brizy_install() {
	Brizy_Logger::install();
}

register_activation_hook( __FILE__, 'brizy_install' );

include_once 'autoload.php';
include_once 'editor/load.php';
include_once 'shortcode/load.php';
include_once 'public/hooks.php';
include_once 'admin/load.php';

