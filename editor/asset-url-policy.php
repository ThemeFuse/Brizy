<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

/**
 * Decides which hosts a compiled 'file' asset may be loaded from.
 *
 * File assets are enqueued as <script src> and <link href> on every page that
 * renders the block, so an external host is code (or styles) running on the site.
 * Used when the assets are stored and again when they are enqueued.
 */
class Brizy_Editor_AssetUrlPolicy {

	/**
	 * Font providers Brizy loads stylesheets from.
	 */
	private static $styleHosts = array(
		'fonts.googleapis.com',
		'fonts.gstatic.com',
		'fonts.bunny.net',
		'use.typekit.net',
	);

	/**
	 * A relative url is resolved against the site host and is always allowed.
	 *
	 * @param string $url
	 * @param bool $isStyle Style assets may also come from the font providers.
	 *
	 * @return bool
	 */
	public static function isAllowed( $url, $isStyle ) {

		$host = parse_url( (string) $url, PHP_URL_HOST );

		if ( $host === false ) {
			return false;
		}

		if ( $host === null || $host === '' ) {
			return true;
		}

		return in_array( strtolower( $host ), self::getAllowedHosts( $isStyle ), true );
	}

	/**
	 * @param bool $isStyle
	 *
	 * @return string[]
	 */
	public static function getAllowedHosts( $isStyle ) {

		$urls = array( home_url(), site_url(), content_url(), plugins_url() );
		foreach ( Brizy_Config::getStaticUrls() as $url ) {
			$urls[] = $url;
		}

		$hosts = array();
		foreach ( $urls as $url ) {
			if ( $host = parse_url( $url, PHP_URL_HOST ) ) {
				$hosts[] = $host;
			}
		}

		if ( $isStyle ) {
			$hosts = array_merge( $hosts, self::$styleHosts );
		}

		$hosts = (array) apply_filters( 'brizy_allowed_asset_hosts', $hosts, $isStyle );

		return array_values( array_unique( array_map( 'strtolower', array_filter( $hosts, 'is_string' ) ) ) );
	}
}
