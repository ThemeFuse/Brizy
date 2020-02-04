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

		$blc_config_manager->options['exclusion_list'][] = 'brizy';
	}
}