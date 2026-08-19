<?php
/*
 * Compatibility with Bogo: https://wordpress.org/plugins/bogo/
 *
 * Bogo filters home_url on the front end and prefixes every url with the
 * language slug, without looking at what the path points to. Brizy endpoint
 * urls are not language scoped, so the slug is removed from them here.
 */
class Brizy_Compatibilities_Bogo {

	public function __construct() {
		add_filter( 'brizy_unlocalized_home_url', [ $this, 'strip_lang_segment' ], 10, 1 );
	}

	/**
	 * Removes the language slug that Bogo prepends to the home url.
	 *
	 * bogo_get_url_with_lang() is deliberately not used here: it runs the url
	 * through remove_query_arg(), which re-serializes the query string and drops
	 * the '=' of an empty value.
	 *
	 * @param string $url
	 *
	 * @return string
	 */
	public function strip_lang_segment( $url ) {

		if ( ! function_exists( 'bogo_get_lang_regex' ) ) {
			return $url;
		}

		$lang_regex = bogo_get_lang_regex();

		// Bogo returns an empty string when the site has no language slugs. Without
		// this guard the pattern would degrade to "{home}/(?!...)" and eat the slash
		// that separates the host from the rest of the url.
		if ( '' === $lang_regex ) {
			return $url;
		}

		// Same option Bogo itself anchors on, so a mapped domain makes both this and
		// Bogo's own prefixing no-op, and they stay in agreement.
		$home = untrailingslashit( set_url_scheme( get_option( 'home' ) ) );

		return preg_replace(
			'#^' . preg_quote( $home, '#' ) . '/' . $lang_regex . '(?![0-9A-Za-z%_-])#',
			// preg_replace reads '$' and '\' in the replacement as backreferences.
			addcslashes( $home, '\\$' ),
			$url
		);
	}
}
