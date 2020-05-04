<?php
/**
 * Compatibility with TranslatePress - Language by GET parameter Add-on: https://wordpress.org/plugins/sg-cachepress/
 */
class Brizy_Compatibilities_TpAddOnLanguageByGetParameter {

    public function __construct() {
        add_action( 'brizy_content', [ $this, 'brizy_content' ] );
    }

    public function brizy_content( $content ) {

        add_filter( 'trp_home_url', [ $this, 'trp_home_url' ], 10, 2 );

        return $content;
    }

    public function trp_home_url( $new_url, $abs_home ) {
        return $abs_home;
    }
}