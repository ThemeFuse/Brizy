<?php

/**
 * Compatibility with WP Fastest Cache plugin: https://wordpress.org/plugins/wp-fastest-cache/
 *
 * WP Fastest Cache combines/minifies JS (and with "Render Blocking JS" moves it
 * around), which reorders Brizy's frontend bundles relative to their inline init
 * scripts and breaks menu/slider initialization - most visibly the mobile menu.
 *
 * WP Fastest Cache exposes very few filters, but its JS optimizer skips any
 * <script> carrying a `data-no-minify` attribute (see inc/js-utilities.php).
 * We tag Brizy's own frontend scripts and styles with it so they keep their
 * original order and remain inline-script compatible.
 */
class Brizy_Compatibilities_WpFastestCache {

	public function __construct() {
		add_filter( 'script_loader_tag', [ $this, 'excludeScript' ], 11, 3 );
		add_filter( 'style_loader_tag', [ $this, 'excludeStyle' ], 11, 3 );
	}

	/**
	 * @param string $tag
	 * @param string $handle
	 * @param string $src
	 *
	 * @return string
	 */
	public function excludeScript( $tag, $handle, $src ) {
		if ( $this->isBrizyAsset( $handle, $src ) && strpos( $tag, 'data-no-minify' ) === false ) {
			$tag = preg_replace( '/<script\s/', '<script data-no-minify="1" ', $tag, 1 );
		}

		return $tag;
	}

	/**
	 * @param string $tag
	 * @param string $handle
	 * @param string $src
	 *
	 * @return string
	 */
	public function excludeStyle( $tag, $handle, $src ) {
		if ( $this->isBrizyAsset( $handle, $src ) && strpos( $tag, 'data-no-minify' ) === false ) {
			$tag = preg_replace( '/<link\s/', '<link data-no-minify="1" ', $tag, 1 );
		}

		return $tag;
	}

	/**
	 * @param string $handle
	 * @param string $src
	 *
	 * @return bool
	 */
	private function isBrizyAsset( $handle, $src ) {
		if ( strpos( (string) $handle, 'brizy' ) === 0 ) {
			return true;
		}

		return strpos( (string) $src, '/plugins/brizy/public/' ) !== false
			|| strpos( (string) $src, '/plugins/brizy-pro/public/' ) !== false;
	}
}
