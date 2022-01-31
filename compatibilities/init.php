<?php

class Brizy_Compatibilities_Init {

	public function __construct() {
		$this->load_compatibilites();
		add_action( 'plugins_loaded', array( $this, 'action_plugins_loaded' ), 9 );
		add_action( 'after_setup_theme', [ $this, 'after_setup_theme' ] );
	}

	private function load_compatibilites() {
		global $wp_version;

		if ( function_exists( 'w3tc_add_ob_callback' ) || function_exists( 'w3tc_class_autoload' ) ) {
			new Brizy_Compatibilities_Wtc();
		}

		$version_compare = version_compare( $wp_version, '5' );

		if ( function_exists( 'gutenberg_init' ) || $version_compare >= 0 ) {
			new Brizy_Compatibilities_Gutenberg();
		}

		if ( function_exists( 'autoptimize' ) ) {
			new Brizy_Compatibilities_Autoptimize();
		}

		if ( defined( 'ICL_SITEPRESS_VERSION' ) ) {
			new Brizy_Compatibilities_WPML();
		}

		if ( function_exists( 'fvm_cachepath' ) ) {
			new Brizy_Compatibilities_FastVelocityMinify();
		}

		if ( class_exists( 'Phast_Plugins_Bootstrap' ) ) {
			new Brizy_Compatibilities_Phastpress();
		}

		new Brizy_Compatibilities_WordpressMuDomainMapping();

		if ( $this->is_plugin_active( 'sg-cachepress/sg-cachepress.php' ) ) {
			new Brizy_Compatibilities_SgOptimizer();
		}

		if ( defined( 'SEOPRESS_VERSION' ) ) {
			new Brizy_Compatibilities_SeoPress();
		}

		if ( function_exists( 'WPNCEasyWP' ) ) {
			new Brizy_Compatibilities_NcEasywp();
		}

		if ( defined( 'ASTRA_EXT_FILE' ) ) {
			new Brizy_Compatibilities_AstraAddon();
		}
	}

	public function action_plugins_loaded() {
		if ( function_exists( 'wpseo_auto_load' ) ) {
			new Brizy_Compatibilities_YoastSeo();
		}

		if ( is_admin() ) {
			if ( class_exists( 'blcConfigurationManager' ) ) {
				new Brizy_Compatibilities_BrokenLinkChecker();
			}
		}

		if ( defined( 'LSCWP_V' ) ) {
			new Brizy_Compatibilities_LiteSpeed();
		}

		if ( defined( 'TRP_GP_PLUGIN_VERSION' ) ) {
			new Brizy_Compatibilities_TpAddOnLanguageByGetParameter();
		}

		if ( defined( 'EM_POST_TYPE_LOCATION' ) ) {
			new Brizy_Compatibilities_EventsManager();
		}

		if ( defined( 'POLYLANG_VERSION' ) ) {
			new Brizy_Compatibilities_Polylang();
		}

		if ( class_exists( 'TRP_Translate_Press' ) ) {
			new Brizy_Compatibilities_TranslatePress();
		}

		if ( class_exists( 'WooCommerce' ) ) {
			new Brizy_Compatibilities_Woocommerce();
        }
    
		if ( class_exists( 'bbPress' ) ) {
			new Brizy_Compatibilities_Bbpress();
		}

		if ( class_exists( 'Tribe__Events__Main' ) ) {
			new Brizy_Compatibilities_TheEventsCalendar();
		}

		if ( defined( 'BRIZY_PRO_VERSION' ) ) {
			new Brizy_Compatibilities_BrizyProCompatibility();
		}

		if ( defined( 'JOB_MANAGER_VERSION' ) ) {
			new Brizy_Compatibilities_WpJobManager();
		}

		if ( function_exists( 'wp_copyright_protection' ) ) {
			new Brizy_Compatibilities_WpCopyrightProtection();
		}

		if ( defined( 'DS_LIVE_COMPOSER_VER' ) ) {
			new Brizy_Compatibilities_LiveComposerPageBuilder();
		}

		if ( class_exists( 'Wp_Ultimo' ) ) {
			new Brizy_Compatibilities_WpUltimo();
		}

		if ( defined( 'PERFMATTERS_VERSION' ) ) {
			new Brizy_Compatibilities_Perfmatters();
		}

		if ( class_exists( 'COMPLIANZ' ) ) {
			new Brizy_Compatibilities_ComplianzGpdr();
		}
  }

	public function after_setup_theme() {
		if ( function_exists( 'tf_autoload' ) ) {
			new Brizy_Compatibilities_Tfuse();
		}
	}

	private function is_plugin_active( $plugin_file ) {

		$apply_filters = apply_filters( 'active_plugins', get_option( 'active_plugins' ) );
		if ( is_array( $apply_filters ) && in_array( $plugin_file, $apply_filters ) ) {
			return true;
		}

		if ( ! is_multisite() ) {
			return false;
		}

		$plugins = get_site_option( 'active_sitewide_plugins' );

		if ( isset( $plugins[ $plugin_file ] ) ) {
			return true;
		}

		return false;
	}
}
