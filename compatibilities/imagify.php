<?php

class Brizy_Compatibilities_Imagify {

    public function __construct() {
        add_filter( 'brizy_after_cropped_img_url', [ $this, 'brizyAfterCroppedImg' ], 10, 1 );
        add_filter( 'brizy_after_cropped_img_path', [ $this, 'brizyAfterCroppedImg' ], 10, 1 );
    }

    public function brizyAfterCroppedImg( $imgUrl ) {
        if ( !wp_doing_ajax() && Brizy_Public_Main::is_editing()) {
            $webp_image_url  = preg_replace( '/\.(jpg|jpeg|png)$/i', '$0.webp', $imgUrl );
            $webp_image_path = str_replace( home_url(), ABSPATH, $webp_image_url );

            if ( file_exists( $webp_image_path ) ) {
                return $webp_image_url;
            }
        }

        return $imgUrl;
    }

}
