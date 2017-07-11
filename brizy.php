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

include_once 'includes/autoload.php';
include_once 'shortcodes/autoload.php';
include_once 'public/autoload.php';
include_once 'admin/autoload.php';

Brizy_Editor_API::init();