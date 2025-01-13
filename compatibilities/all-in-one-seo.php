<?php

class Brizy_Compatibilities_AllInOneSEO {

    public function __construct() {
        add_filter( 'aioseo_description', array( $this, 'filter_meta_description' ) );
    }

    public function filter_meta_description( $meta_description ) {
        return preg_replace( '/\{\{\s*brizy_dc_global_blocks.*?\}\}/', '', $meta_description );
    }
}
