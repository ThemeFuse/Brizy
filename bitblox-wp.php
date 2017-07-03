<?php

/**
 * Plugin Name: BitBlox Wp
 * Plugin URI: http://themefuse.com/
 * Description: A free drag & drop framework that comes with a bunch of built in extensions that will help you develop premium themes fast & easy.
 * Version: 0.1.0
 * Author: ThemeFuse
 * Author URI: http://themefuse.com
 * License: GPL2+
 * Text Domain: bitblox-wp
 * Domain Path: /languages
 */

define( 'BITBLOX_WP_VERSION', '0.1.0' );

include_once 'includes/autoload.php';
include_once 'shortcodes/autoload.php';
include_once 'public/autoload.php';
include_once 'admin/autoload.php';

BitBlox_WP_Editor_API::init();
