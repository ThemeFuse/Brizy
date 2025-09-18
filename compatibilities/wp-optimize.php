<?php
/**
 *  WP-Optimize – Cache, Clean, Compress plugin: https://wordpress.org/plugins/wp-optimize/
 */
class Brizy_Compatibilities_WpOptimize {

    public function __construct() {
        add_filter( 'option_wpo_minify_config',      [ $this, 'changeWpOptimizeConfig' ] );
        add_filter( 'site_option_wpo_minify_config', [ $this, 'changeWpOptimizeConfig' ] );
    }

    public function changeWpOptimizeConfig( $config ) {
        if ( Brizy_Public_Main::is_editing() ) {
            $config['enable_js']               = false;
            $config['enable_css']              = false;
            $config['html_minification']       = false;
            $config['enable_css_minification'] = false;
            $config['enable_merging_of_css']   = false;
            $config['inline_css']              = false;
            $config['enable_js_minification']  = false;
            $config['enable_merging_of_js']    = false;
            $config['enabled_css_preload']     = false;
            $config['enabled_js_preload']      = false;
        } else {
            $brizy_js = '/wp-content/plugins/brizy';
            $brizyPro_js = '/wp-content/plugins/brizy-pro';

            if (strpos($config['exclude_js'], $brizy_js) === false) {
                $config['exclude_js'] .= "\n".$brizy_js;
            }
            if (strpos($config['exclude_js'], $brizyPro_js) === false) {
                $config['exclude_js'] .= "\n".$brizyPro_js;
            }

            $brizyPreview_css = '/preview.pro.min.css';

            if (strpos($config['async_css'], $brizyPreview_css) === false) {
                $config['async_css'] .= "\n".$brizyPreview_css;
            }

        }

        return $config;
    }
}
