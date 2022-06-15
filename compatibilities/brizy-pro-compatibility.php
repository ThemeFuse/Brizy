<?php

class Brizy_Compatibilities_BrizyProCompatibility {

	public function __construct() {
		if ( version_compare( BRIZY_MINIMUM_PRO_VERSION, BRIZY_PRO_VERSION ) > 0 ) {
			add_action( 'admin_notices', [ $this, 'brizypro_upgrade_required' ] );
			add_action( 'brizy_allow_plugin_included', '__return_false' );
			// Avoid fatal errors for pro versions older than 0.0.37
			remove_action( 'plugins_loaded', 'brizy_pro_load' );
		}

        if ( version_compare( BRIZY_PRO_VERSION, '2.4.2', '<' ) ) {
	        $proMain = new BrizyPro_Main();

            if ( method_exists( $proMain, 'wordpressLoaded' ) ) {
	            add_action( 'wp_loaded', [ $proMain, 'wordpressLoaded' ], 11 );
            }

	        add_action( 'site_transient_update_plugins', [ $this, 'getSiteTransientUpdatePlugins' ] );
        }
	}

	public function brizypro_upgrade_required() {
		?>
			<div class="notice notice-error is-dismissible">
				<p>
					<b><?php printf( __( '%s PRO IS NOT RUNNING.', 'brizy' ), strtoupper( __bt( 'brizy', 'Brizy' ) ) ); ?></b><br>
					<?php printf( __( 'Please update %s PRO to the latest version.', 'brizy' ), __bt( 'brizy', 'Brizy' ) ); ?>
				</p>
			</div>
		<?php
	}

	static public function isPro() {
        if ( ! defined( 'BRIZY_PRO_VERSION' ) || ! class_exists( 'BrizyPro_Admin_License' ) ) {
            return false;
        }

        $license = BrizyPro_Admin_License::_init();

		if ( method_exists( $license, 'isValidLicense' ) ) {
			if ( BrizyPro_Admin_License::_init()->isValidLicense() ) {
				return true;
			}
		} else {
            $licenseData = BrizyPro_Admin_License::_init()->getCurrentLicense();
			if ( ! empty( $licenseData['key'] ) ) {
				return true;
			}
		}

        return false;
	}

    public function getSiteTransientUpdatePlugins( $updates ) {
        if ( isset( $updates->response['brizy-pro/brizy-pro.php'] ) ) {
	        $updates->response['brizy-pro/brizy-pro.php']->plugin = 'brizy-pro/brizy-pro.php';
	        $updates->checked['brizy-pro/brizy-pro.php']  = $updates->response['brizy-pro/brizy-pro.php']->new_version;
        } else {
	        global $wpdb;

	        $wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE ('brizy_update__transient_%')" );

            set_site_transient( 'update_plugins', $updates );
        }

        return $updates;
    }
}