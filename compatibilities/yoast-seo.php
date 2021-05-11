<?php

class Brizy_Compatibilities_YoastSeo {

	public function __construct() {
		add_filter( 'wpseo_twitter_image', array( $this, 'wpseo_twitter_image' ) );
		add_filter( 'brizy_html_entity_decode', '__return_false' );
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
	 * @throws Exception
	 */
	public function wpseo_twitter_image( $img_url ) {

		try {
			$project          = Brizy_Editor_Project::get();
			$context          = Brizy_Content_ContextFactory::createContext( $project, null, null, null );
			$urlBuilder       = new Brizy_Editor_UrlBuilder( $project, null );
			$media_storage    = new Brizy_Editor_Asset_MediaProxyStorage( $urlBuilder );
			$media_processor  = new Brizy_Editor_Asset_MediaAssetProcessor( $media_storage );
			$domain_processor = new Brizy_Editor_Asset_DomainProcessor();
			$url              = $domain_processor->process( $img_url, $context );
			$url              = $media_processor->process( $url, $context );

			return $url;
		} catch ( Exception $e ) {
			// do nothing... :) :)
		}

		return $img_url;
	}
}
