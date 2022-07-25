<?php
/**
 * Compatibility with PhastPress plugin: https://wordpress.org/plugins/phastpress/
 */
class Brizy_Compatibilities_Phastpress {

	public function __construct() {
		add_action( 'plugins_loaded', [ $this, 'disable_phastpress' ], 9 );
	}

	public function disable_phastpress() {

		if ( ! Brizy_Public_Main::is_editing() ) {
			return;
		}

		add_filter( 'phastpress_disable', '__return_true' );
	}
}