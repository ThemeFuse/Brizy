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

/**
 * @param string $class
 */
function _bitblox_wp_autoload( $class ) {
	switch ( $class ) {
		case 'BitBlox_WP' :
			include_once 'includes/class-bitblox-wp.php';
			break;
		case 'BitBlox_WP_Uploads_Dir' :
			include_once 'includes/class-bitblox-wp-uploads-dir.php';
			break;
		case 'BitBlox_WP_DOM' :
			include_once 'includes/helpers/class-bitblox-wp-dom.php';
			break;
		case 'BitBlox_WP_DOM_Tag' :
			include_once 'includes/helpers/class-bitblox-wp-dom-tag.php';
			break;
		case 'BitBlox_WP_View' :
			include_once 'includes/class-bitblox-wp-view.php';
			break;
		case 'BitBlox_WP_Post' :
			include_once 'includes/class-bitblox-wp-post.php';
			break;
		case 'BitBlox_WP_User' :
			include_once 'includes/class-bitblox-wp-user.php';
			break;
		case 'BitBlox_WP_Editor' :
			include_once 'includes/editor/class-bitblox-wp-editor.php';
			break;
		case 'BitBlox_WP_Editor_API' :
			include_once 'includes/editor/class-bitblox-wp-editor-api.php';
			break;
		case 'BitBlox_WP_Constants' :
			include_once 'includes/class-bitblox-wp-constants.php';
			break;
		case 'BitBlox_WP_Exception' :
			include_once 'includes/exception/class-bitblox-wp-exception.php';
			break;
		case 'BitBlox_WP_Exception_Access_Denied' :
			include_once 'includes/exception/class-bitblox-wp-exception-access-denied.php';
			break;
		case 'BitBlox_WP_Exception_Invalid_Content' :
			include_once 'includes/exception/class-bitblox-wp-exception-invalid-content.php';
			break;
		case 'BitBlox_WP_Exception_Not_Found' :
			include_once 'includes/exception/class-bitblox-wp-exception-not-found.php';
			break;
		case 'BitBlox_WP_Exception_Not_BitBlox_Page' :
			include_once 'includes/exception/class-bitblox-wp-exception-not-bitblox-page.php';
			break;
		case 'BitBlox_WP_Exception_Unsupported_Post_Type' :
			include_once 'includes/exception/class-bitblox-wp-exception-unsupported-post-type.php';
			break;
		case 'BitBlox_WP_Post_Storage' :
			include_once 'includes/storage/class-bitblox-wp-post-storage.php';
			break;
		case 'BitBlox_WP_Storage' :
			include_once 'includes/storage/class-bitblox-wp-storage.php';
			break;
		case 'BitBlox_WP_Storage_Model' :
			include_once 'includes/storage/class-bitblox-wp-storage-model.php';
			break;
		case 'BitBlox_WP_Dump' :
			include_once 'includes/dev/class-bitblox-wp-dump.php';
			break;
		case 'BitBlox_WP_Project' :
			include_once 'includes/class-bitblox-wp-project.php';
			break;

	}
}

spl_autoload_register( '_bitblox_wp_autoload' );

include_once 'includes/static-resources/autoload.php';
include_once 'includes/api/autoload.php';
include_once 'includes/http/autoload.php';
include_once 'includes/media/autoload.php';
include_once 'includes/functions.php';

if ( is_admin() ) {
	include_once 'admin/autoload.php';
}

include_once 'shortcodes/autoload.php';
include_once 'public/autoload.php';

BitBlox_WP_Editor_API::init();
