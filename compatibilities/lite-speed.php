<?php

/**
 * Compatibility with LiteSpeed plugin: https://wordpress.org/plugins/litespeed-cache/
 */
class Brizy_Compatibilities_LiteSpeed {

	public function __construct() {
	    add_action( 'litespeed_init', [ $this, 'litespeed_init' ] );
	}

	public function litespeed_init() {
        if ( isset( $_GET[ Brizy_Editor::prefix( '-edit' ) ] ) || isset( $_GET[ Brizy_Editor::prefix( '-edit-iframe' ) ] ) ) {
            do_action( 'litespeed_disable_all', 'brizy edit mode' );
        }
    }
}