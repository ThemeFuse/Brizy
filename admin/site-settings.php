<?php
/** Load WordPress Bootstrap */

/** WordPress Administration Bootstrap */
require_once( '../../../../wp-load.php' );
require_once( ABSPATH . 'wp-admin/includes/file.php' );

if(!is_user_logged_in() || !current_user_can('administrator') ) {
    wp_redirect(admin_url());
    exit;
}

if ( class_exists( 'Brizy_Admin_SiteSettings_Main' ) ) {
	$settings = new Brizy_Admin_SiteSettings_Main( 'admin/site-settings.php' );
	$settings->run();
} else {
	echo "You must activate Brizy in order to see this page.";
}

