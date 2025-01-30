<?php

class Brizy_Compatibilities_Imagify {

    public function __construct() {
        add_filter( 'brizy_after_cropped_img', [ $this, 'brizyAfterCroppedImg' ], 10, 1 );
    }

    public function brizyAfterCroppedImg( $imgUrl ) {
        if ( ! isset( $_GET['action'] ) ) {
            $webp_image_url  = preg_replace( '/\.(jpg|jpeg|png)$/i', '$0.webp', $imgUrl );
            $webp_image_path = str_replace( home_url(), ABSPATH, $webp_image_url );

            if ( file_exists( $webp_image_path ) ) {
                return $webp_image_url;
            }
        }

        return $imgUrl;
    }

}
