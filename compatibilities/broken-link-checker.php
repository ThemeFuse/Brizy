<?php
/**
 *  Broken Link Checker plugin: https://wordpress.org/plugins/broken-link-checker/
 */
class Brizy_Compatibilities_BrokenLinkChecker {

	public function __construct() {
		$this->insert_exclusion();
	}

	public function insert_exclusion() {

		global $blc_config_manager;

		if ( ! isset( $blc_config_manager->options['exclusion_list'] ) ) {
			return;
		}

		$excludeRules = array_diff( [ '_dc_', 'SITE_URL_PLACEHOLDER' ], $blc_config_manager->options['exclusion_list'] );
		$blc_config_manager->options['exclusion_list'] = array_merge( $blc_config_manager->options['exclusion_list'], $excludeRules );
	}
}