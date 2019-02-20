<?php

class Brizy_SiteUrlReplacer {

	static public function hideSiteUrl( $content, $url = null ) {

		if ( ! $url ) {
			$url = home_url();
		}

		$pattern = str_replace( array( '/', '.' ), array( '\/', '\.' ), $url );

		$content = preg_replace( "/{$pattern}/i", Brizy_Config::SITE_URL_PLACEHOLDER, $content );

		return $content;
	}

	static public function restoreSiteUrl( $content, $url = null ) {

		if ( ! $url ) {
			$url = home_url();
		}

		$content = preg_replace( Brizy_Config::SITE_URL_PLACEHOLDER_REGEX, $url, $content );

		return $content;
	}

}