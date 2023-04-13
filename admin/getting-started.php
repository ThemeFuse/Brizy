<?php

/**
 * Class Brizy_Getting_Started
 */

class Brizy_Admin_GettingStarted {

	/**
	 * Brizy_Admin_Getting_Started constructor.
	 */

    public function __construct() {
        add_action( 'admin_menu', [ $this, 'addSubmenuPageGettingStarted' ], 20 );
    }

    public function addSubmenuPageGettingStarted() {

        if ( is_network_admin() ) {
            return;
        }

        add_filter( 'screen_options_show_screen', function ( $display ) {
            return isset( $_GET['page'] ) && $_GET['page'] == 'starter-templates' ? false : $display;
        } );

        add_submenu_page(
            Brizy_Admin_Settings::menu_slug(),
            __( 'Getting Started', 'brizy' ),
            __( 'Getting Started', 'brizy' ),
            'manage_options',
            'getting-started',
            [ $this, 'renderTemplatesPage' ],
            8
        );
    }

    public function renderTemplatesPage() {

        $args = [
            'l10n'       => [
                'all'           => __( 'All', 'brizy' ),
                'livePreview'   => __( 'Live Preview', 'brizy' ),
                'install'       => __( 'Install', 'brizy' ),
                'free'          => __( 'Free', 'brizy' ),
                'pro'           => __( 'Pro', 'brizy' ),
                'search'        => __( 'Search', 'brizy' ),
                'allCategories' => __( 'All Categories', 'brizy' ),
                'goPro'         => __( 'Go Pro', 'brizy' ),
                't1'            => __( 'Something went wrong', 'brizy' ),
                't2'            => __( 'Bad news, your starter template was not installed. Something went wrong and we couldn’t do it. Please contact us.', 'brizy' ),
                't3'            => __( 'Ok', 'brizy' ),
                't4'            => __( 'Template Successfully Installed', 'brizy' ),
                't5'            => __( 'Good news, your starter template was successfully installed. Time to build your amaizing website fast & easy!', 'brizy' ),
                't6'            => __( 'Thank You!', 'brizy' ),
                't7'            => __( 'Installing Starter Template', 'brizy' ),
                't8'            => __( 'Please don’t close this window until the installation is finished. This might take up to a couple of minutes (five min, usually less).', 'brizy' ),
                't9'            => __( 'Keep existing content', 'brizy' ),
                't10'           => sprintf( __( 'Choose this option if you want to keep your current content. If you are using %s, some of the global options might overlap.', 'brizy' ), __bt( 'brizy', 'Brizy' ) ),
                't11'           => __( 'Install Template', 'brizy' ),
                't12'           => __( 'Delete existing content', 'brizy' ),
                't13'           => __( 'Choose this option if you want to start fresh and delete your current content. A backup is advisable, there is no turning back from this.', 'brizy' ),
                't14'           => __( 'Deletes your current content', 'brizy' ),
            ],
            'supportUrl'   => Brizy_Config::SUPPORT_URL,
            'goProUrl'     => Brizy_Config::GO_PRO_DASHBOARD_URL,
            'isPro'        => Brizy_Compatibilities_BrizyProCompatibility::isPro(),
            'isWhiteLabel' => class_exists( 'BrizyPro_Admin_WhiteLabel' ) && BrizyPro_Admin_WhiteLabel::_init()->getEnabled(),
        ];

        try {
            Brizy_Editor_View::render( BRIZY_PLUGIN_PATH . '/admin/views/getting-started', $args );
        } catch ( Exception $e ) {
            echo $e->getMessage();
        }
    }

    public static function redirectAfterActivation( $plugin ) {
        if( $plugin == BRIZY_PLUGIN_BASE ) {
            exit( wp_redirect( admin_url( 'admin.php?page=getting-started' ) ) );
        }
    }
}
