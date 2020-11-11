<?php

class Brizy_Compatibilities_NcEasywp {

	public function __construct() {
		if ( class_exists( '\WPNCEasyWP\Http\Varnish\VarnishCache' ) ) {
			add_action( 'brizy_before_send_asset', [ $this, 'before_send_asset' ] );
		}
	}

	public function before_send_asset( $post_id ) {
		do_action( 'edit_post', $post_id, get_post( $post_id ) );
	}
}