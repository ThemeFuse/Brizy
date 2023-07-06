<?php
/**
 * https://wordpress.org/plugins/jetpack/
 */

class Brizy_Compatibilities_Jetpack {
	public function __construct() {
		add_action( 'init', [ $this, 'remove_image_cdn_filter' ] );
	}

	public function remove_image_cdn_filter() {
		if ( class_exists( '\Automattic\Jetpack\Image_CDN\Image_CDN' ) && is_callable( [ '\Automattic\Jetpack\Image_CDN\Image_CDN', 'instance' ] ) ) {
			remove_filter( 'image_downsize', [ \Automattic\Jetpack\Image_CDN\Image_CDN::instance(), 'filter_image_downsize' ] );
		}
	}
}

