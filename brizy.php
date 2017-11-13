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

include_once 'autoloader.php';
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