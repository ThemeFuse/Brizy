<?php

class Brizy_Compatibilities_Bunnynet {

	public function __construct() {
		add_action( 'wp', array( $this, 'disable_bunny' ), 11 );
	}

	public function disable_bunny() {
		if ( Brizy_Public_Main::is_editing() ) {
			add_filter( 'option_bunnycdn_fonts_enabled', '__return_false' );
			add_filter( 'option_bunnycdn_cdn_status', '__return_false' );
		}
	}
}