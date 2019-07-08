<?php
/** Load WordPress Bootstrap */

/** WordPress Administration Bootstrap */
require_once( '../../../../wp-load.php' );
require_once( ABSPATH . 'wp-admin/includes/file.php' );

if ( class_exists( 'Brizy_Admin_SiteSettings_Main' ) ) {
	$settings = new Brizy_Admin_SiteSettings_Main( 'admin/site-settings.php' );
	$settings->run();
} else {
	echo "You must activate Brizy in order to see this page.";
}

