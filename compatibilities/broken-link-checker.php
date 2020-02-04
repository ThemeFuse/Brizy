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

		// Don't show in the "Exclusion list" textarea our exclusion keyword.
		if ( isset( $_GET['page'] ) && $_GET['page'] === 'link-checker-settings' ) {
			return;
		}

		if ( isset( $blc_config_manager->options['exclusion_list'] ) && ! in_array( 'brizy', $blc_config_manager->options['exclusion_list'] ) ) {
			$blc_config_manager->options['exclusion_list'][] = 'brizy';
		}
	}
}