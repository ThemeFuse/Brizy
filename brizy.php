<?php
/**
 * Plugin Name: Brizy
 * Description: A free drag & drop front-end page builder to help you create WordPress pages lightning fast. It's easy with Brizy.
 * Plugin URI: https://brizy.io/
 * Author: Brizy.io
 * Author URI: https://brizy.io/
 * Version: 1.0.30
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
define( 'BRIZY_LOG', true );
define( 'BRIZY_VERSION', '1.0.30' );
define( 'BRIZY_EDITOR_VERSION', '1.0.58' );
define( 'BRIZY_FILE', __FILE__ );
define( 'BRIZY_PLUGIN_BASE', plugin_basename( BRIZY_FILE ) );
define( 'BRIZY_PLUGIN_PATH', dirname( BRIZY_FILE ) );
define( 'BRIZY_PLUGIN_URL', rtrim( plugin_dir_url( BRIZY_FILE ), "/" ) );

include_once 'autoload.php';


add_action( 'plugins_loaded', 'brizy_load' );
add_action( 'upgrader_process_complete', 'brizy_run_migrations', 9, 2 );
add_action( 'upgrader_process_complete', 'brizy_upgrade_completed', 10, 2 );

register_activation_hook( BRIZY_FILE, 'brizy_install' );
register_deactivation_hook( BRIZY_FILE, 'brizy_clean' );

function brizy_load() {

	if ( version_compare( PHP_VERSION, '5.4.0' ) < 0 ) {
		add_action( 'admin_notices', 'brizy_notices' );

		return;
	}

	$instance = Brizy_Editor::get();

}


function brizy_notices() {
	?>
    <div class="notice notice-error is-dismissible">
        <p>Brizy requires PHP version 5.4+, you currently running PHP <?php echo PHP_VERSION ?>. <b>BRIZY IS NOT
                RUNNING. </b></p>
    </div>
	<?php
}

function brizy_upgrade_completed( $upgrader_object, $options ) {
	if ( $options['action'] == 'update' && $options['type'] == 'plugin' && isset( $options['plugins'] ) ) {
		foreach ( $options['plugins'] as $plugin ) {
			if ( $plugin == BRIZY_PLUGIN_BASE ) {
				flush_rewrite_rules();
			}
		}
	}
}

function brizy_run_migrations( $upgrader_object, $options ) {
	if ( $options['action'] == 'update' && $options['type'] == 'plugin' && isset( $options['plugins'] ) ) {
		foreach ( $options['plugins'] as $plugin ) {
			if ( $plugin == BRIZY_PLUGIN_BASE ) {
				$migrations = new Brizy_Admin_Migrations();
				$migrations->migrateTo( BRIZY_VERSION );
			}
		}
	}
}

function brizy_install() {
	Brizy_Logger::install();
	Brizy_Editor::get()->registerCustomPostTemplates();
	flush_rewrite_rules();
}

function brizy_clean() {
	Brizy_Logger::clean();
}

