<?php

class Brizy_Compatibilities_SquirrlySeo {

    public function __construct() {
        add_action( 'init', [ $this, 'disable_squirrly_buffer' ] );
    }

    public function disable_squirrly_buffer() {
        if ( Brizy_Public_Main::is_editing() ) {
            add_filter( 'sq_load_buffer', '__return_false', 10 );
        }
    }
}
