<?php
/**
 * Compatibility with PhastPress plugin: https://wordpress.org/plugins/phastpress/
 */
class Brizy_Compatibilities_Phastpress {

	public function __construct() {
		add_action( 'plugins_loaded',  array( $this, 'disable_phastpress' ), 9 );
	}

	public function disable_phastpress() {

		if (  ! isset( $_GET[Brizy_Editor::prefix('-edit')] ) && ! isset( $_GET[Brizy_Editor::prefix('-edit-iframe')] ) ) {
			return;
		}

		add_filter( 'phastpress_disable', '__return_true' );
	}
}