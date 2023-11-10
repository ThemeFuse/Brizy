<?php
/**
 * Plugin Name: Brizy
 * Description: A free drag & drop front-end page builder to help you create WordPress pages lightning fast. It's easy with Brizy.
 * Plugin URI: https://brizy.io/
 * Author: Brizy.io
 * Author URI: https://brizy.io/
 * Version: 2.4.31
 * Text Domain: brizy
 * License: GPLv3
 * Domain Path: /languages
 */
/**
 * This will fix the url protocol for websites that are working behind a load balancer
 */
if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && stripos($_SERVER['HTTP_X_FORWARDED_PROTO'], 'https') !== false) {
    $_SERVER['HTTPS'] = 'on';
}

define('BRIZY_DEVELOPMENT', false );
define('BRIZY_LOG', false );
define('BRIZY_VERSION', '2.4.31');
define('BRIZY_MINIMUM_PRO_VERSION', '2.4.15');
define('BRIZY_EDITOR_VERSION', BRIZY_DEVELOPMENT ? 'dev' : '270-wp' );
define('BRIZY_SYNC_VERSION', '270');
define('BRIZY_FILE', __FILE__);
define('BRIZY_PLUGIN_BASE', plugin_basename(BRIZY_FILE));
define('BRIZY_PLUGIN_PATH', dirname(BRIZY_FILE));
define('BRIZY_PLUGIN_URL', rtrim(plugin_dir_url(BRIZY_FILE), "/"));
define('BRIZY_MAX_REVISIONS_TO_KEEP', 30);

include_once rtrim(BRIZY_PLUGIN_PATH, "/") . '/autoload.php';
include_once rtrim(BRIZY_PLUGIN_PATH, "/") . '/languages/main.php';

if (BRIZY_DEVELOPMENT) {
    $dotenv = new \Symfony\Component\Dotenv\Dotenv('APP_ENV');
    $dotenv->load(__DIR__ . '/.env');
}

add_action('plugins_loaded', 'brizy_load');
add_action('init', 'brizy_load_text_domain');
add_action('upgrader_process_complete', 'brizy_upgrade_completed', 10, 2);
add_action('activated_plugin', 'Brizy_Admin_GettingStarted::redirectAfterActivation');

register_activation_hook(BRIZY_FILE, 'brizy_install');
register_deactivation_hook(BRIZY_FILE, 'brizy_clean');

function brizy_load()
{

    try {
        $instance = Brizy_Editor::get();
    } catch (Exception $e) {
        add_action('admin_notices', 'brizy_fail_notices');

        return;
    }

    if (apply_filters('brizy_allow_plugin_included', true)) {
        do_action('brizy_plugin_included');
    }
}

function brizy_notices()
{
    ?>
    <div class="notice notice-error is-dismissible">
        <p>
            <?php
            printf(
                __(
                    '%1$s requires PHP version 5.6+, your currently running PHP %2$s. <b>%3$s IS NOT RUNNING.</b>',
                    'brizy'
                ),
                __bt('brizy', 'Brizy'),
                PHP_VERSION,
                strtoupper(__bt('brizy', 'Brizy'))
            );
            ?>
        </p>
    </div>
    <?php
}

function brizy_fail_notices()
{
    ?>
    <div class="notice notice-error is-dismissible">
        <p>
            <?php
            printf(
                __('%1$s failed to start. Please contact the support <a href="%s">here</a>.', 'brizy'),
                __bt('brizy', 'Brizy'),
                apply_filters('brizy_support_url', Brizy_Config::getSupportUrl()),
                strtoupper(__bt('brizy', 'Brizy'))
            );
            ?>
        </p>
    </div>
    <?php
}


function brizy_upgrade_completed($upgrader_object, $options)
{
    if ($options['action'] == 'update' && $options['type'] == 'plugin' && isset($options['plugins'])) {
        foreach ($options['plugins'] as $plugin) {
            if ($plugin == BRIZY_PLUGIN_BASE) {
                add_option('brizy-regenerate-permalinks', 1);
                do_action('brizy-updated');
            }
        }
    }
}

function brizy_install()
{
    Brizy_Logger::install();
    add_option('brizy-regenerate-permalinks', 1);
    do_action('brizy-activated');
}

function brizy_clean()
{
    Brizy_Logger::clean();
    add_option('brizy-regenerate-permalinks', 1);
    do_action('brizy-deactivated');
}

function brizy_load_text_domain()
{
    load_plugin_textdomain('brizy', false, dirname(plugin_basename(__FILE__)) . '/languages');
}

new Brizy_Compatibilities_Init();
