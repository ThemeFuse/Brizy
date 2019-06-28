<?php

class Brizy_Compatibilities_YoastSeo {

	public function __construct() {
		add_filter( 'wpseo_twitter_image', array( $this, 'wpseo_twitter_image' ) );
	}

	/**
	 * Yoast has a feature to add twitter share image.
	 * If this image or featured image is not added then
	 * it takes the first image from the post content.
	 * These action is made in the hook wp_head and we
	 * haven't replaced the urls yet. Here's why we see:
	 * <meta name="twitter:image" content="http://@brizy_SITE_URL_PLACEHOLDER@/?
	 *
	 * @param $img_url
	 *
	 * @return string
	 */
	public function wpseo_twitter_image( $img_url ) {
		return Brizy_SiteUrlReplacer::restoreSiteUrl( $img_url );
	}
}
