<?php

class Brizy_SiteUrlReplacer {

	static public function hideSiteUrl( $content, $url = null ) {

		if ( ! $url ) {
			$url = home_url();
		}

		$pattern = str_replace( [ 'https://', 'http://', 'www.', '/', '.' ], [ '', '', '', '\/', '\.' ], $url );

		// http://brizy.local/my-post/
		// https://brizy.local/my-post/
		// http://www.brizy.local/my-post/
		// https://www.brizy.local/my-post/
		return preg_replace( "/(http|https)(:\/\/)(www.)?({$pattern})/i", Brizy_Config::SITE_URL_PLACEHOLDER, $content );
	}

	static public function restoreSiteUrl( $content, $url = null ) {

		if ( ! $url ) {
			$url = home_url();
		}

		$content = preg_replace( Brizy_Config::SITE_URL_PLACEHOLDER_REGEX, $url, $content );

		return $content;
	}
}