<?php

/**
 * Compatibility with WP Rocket plugin: https://wp-rocket.me/
 *
 * Brizy renders sliders, menus (including the mobile mm-menu) and animations
 * with JavaScript that must run on page load. WP Rocket's "Delay JavaScript
 * execution" and "Load JavaScript deferred" stop that JS - both Brizy's external
 * bundles and its inline init scripts - from running until the first user
 * interaction, leaving sliders and menus broken on the public page. "Remove
 * Unused CSS" additionally strips Brizy classes that are only added at runtime
 * by that same JS, which breaks/flashes the menu.
 *
 * This class auto-excludes Brizy assets from those features so users can keep
 * WP Rocket optimizations enabled, and fully bypasses WP Rocket while editing.
 */
class Brizy_Compatibilities_WpRocket {

	public function __construct() {
		add_action( 'plugins_loaded', [ $this, 'bypassWhileEditing' ], 1 );

		add_filter( 'rocket_delay_js_exclusions', [ $this, 'excludeDelayJs' ] );
		add_filter( 'rocket_exclude_defer_js', [ $this, 'excludeScriptUrls' ] );
		add_filter( 'rocket_exclude_js', [ $this, 'excludeScriptUrls' ] );
		add_filter( 'rocket_excluded_inline_js_content', [ $this, 'excludeInlineContent' ] );
		add_filter( 'rocket_rucss_safelist', [ $this, 'safelistCss' ] );
	}

	/**
	 * The editor and its preview iframe are served as frontend HTML, so WP Rocket
	 * would delay/defer the editor scripts and break it. Disable all optimization
	 * there, the same way the other optimization compatibilities do.
	 */
	public function bypassWhileEditing() {
		if ( Brizy_Public_Main::is_editing() && ! defined( 'DONOTROCKETOPTIMIZE' ) ) {
			define( 'DONOTROCKETOPTIMIZE', true );
		}
	}

	/**
	 * Delay JS matches each pattern against the whole <script> tag, so this
	 * covers both Brizy's external bundles (by src) and its inline init scripts
	 * (by their wp_add_inline_script id: brizy-preview, brizy-asset-*).
	 *
	 * @param array $excluded
	 *
	 * @return array
	 */
	public function excludeDelayJs( $excluded ) {
		return array_merge( (array) $excluded, [
			'/wp-content/plugins/brizy/public/',
			'/wp-content/plugins/brizy-pro/public/',
			'id=.brizy-',
			'__CONFIG__',
		] );
	}

	/**
	 * @param array $excluded
	 *
	 * @return array
	 */
	public function excludeScriptUrls( $excluded ) {
		return array_merge( (array) $excluded, [
			'/wp-content/plugins/brizy/public/',
			'/wp-content/plugins/brizy-pro/public/',
		] );
	}

	/**
	 * @param array $excluded
	 *
	 * @return array
	 */
	public function excludeInlineContent( $excluded ) {
		return array_merge( (array) $excluded, [
			'__CONFIG__',
			'__VISUAL_CONFIG__',
		] );
	}

	/**
	 * Brizy toggles these classes on the menu/slider at runtime, so Remove
	 * Unused CSS cannot see them in the static HTML and would strip them.
	 *
	 * @param array $safelist
	 *
	 * @return array
	 */
	public function safelistCss( $safelist ) {
		return array_merge( (array) $safelist, [
			'/^brz-/',
			'(.*)brz-slick-slider(.*)',
			'(.*)brz-menu(.*)',
			'(.*)brz-mm-menu(.*)',
		] );
	}
}
