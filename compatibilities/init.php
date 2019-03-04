<?php

class Brizy_Compatibilities_Init {

	public function __construct() {
		$this->loadCompatibilities();
	}

	private function loadCompatibilities() {
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

		if ( class_exists( 'LiteSpeed_Cache_Config' ) ) {
			new Brizy_Compatibilities_LiteSpeed();
		}

		if ( function_exists( 'fvm_cachepath' ) ) {
			new Brizy_Compatibilities_FastVelocityMinify();
		}

		if ( class_exists( 'Phast_Plugins_Bootstrap' ) ) {
			new Brizy_Compatibilities_Phastpress();
		}
	}
}