<?php

/**
 * Compatibility with the plugin Complianz – GDPR/CCPA Cookie Consent: https://wordpress.org/plugins/complianz-gdpr/
 */
class Brizy_Compatibilities_ComplianzGpdr {

	public function __construct() {
		if ( Brizy_Public_Main::is_editing() ) {
			add_action( 'template_redirect', [ $this, 'template_redirect' ], 9 );
			add_action( 'shutdown',          [ $this, 'shutdown' ], 998 );
		}
	}

	public function template_redirect() {
		remove_action( 'template_redirect', [ COMPLIANZ::$cookie_blocker, 'start_buffer' ] );
	}

	public function shutdown() {
		remove_action( 'shutdown', [ COMPLIANZ::$cookie_blocker, 'end_buffer' ], 999 );
	}
}