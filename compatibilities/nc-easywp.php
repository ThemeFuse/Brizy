<?php

class Brizy_Compatibilities_NcEasywp {

	public function __construct() {
		if ( class_exists( '\WPNCEasyWP\Http\Varnish\VarnishCache' ) ) {
			add_action( 'brizy_before_send_asset', [ $this, 'before_send_asset' ] );
		}
	}

	public function before_send_asset() {
		do_action('clear_redis');
		do_action('clear_varnish');
		do_action('clear_opcache');
	}
}