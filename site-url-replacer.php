<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 3/26/18
 * Time: 4:27 PM
 */

class Brizy_SiteUrlReplacer {

	static public function hideSiteUrl( $content, $url = null ) {

		if ( ! $url ) {
			$url = site_url();
		}

		$pattern = str_replace( [ '/', '.' ], [ '\/', '\.' ], $url );

		$content = preg_replace( "/{$pattern}/i", Brizy_Config::HOME_URL_PLACEHOLDER, $content );

		return $content;
	}

	static public function restoreSiteUrl( $content, $url = null ) {

		if ( ! $url ) {
			$url = site_url();
		}

		$pattern = str_replace( [ '{', '}' ], [ '\{', '\}' ], Brizy_Config::HOME_URL_PLACEHOLDER );

		$content = preg_replace( "/{$pattern}/i", $url, $content );

		return $content;
	}

}