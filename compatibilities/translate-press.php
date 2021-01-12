<?php
/**
 * Compatibility with TranslatePress – Translate Multilingual sites: https://wordpress.org/plugins/translatepress-multilingual/
 */
class Brizy_Compatibilities_TranslatePress {

	const SITE_URL_PLACEHOLDER = '{@brizy_TRANSLATEPRESS_SITE_URL_PLACEHOLDER@}';
	static $url = '';

	public function __construct() {
		add_action( 'brizy_content', [ $this, 'brizy_content' ] );
		add_action( 'wp_get_nav_menu_items', [ $this, 'wp_get_nav_menu_items' ], 9 );
		add_action( 'brizy_menu_data', [ $this, 'menu_data' ] );
		add_action( 'trp_translated_html', [ $this, 'trp_translated_html' ], 10 );
		add_action( 'brizy_toolbar_link', [ $this, 'brizy_toolbar_link' ], 10, 2 );
		add_action( 'home_url', [ $this, 'home_url' ] );
	}

	/*
		Fix flags paths.
		The issue occurs when you are on nondefault language. The home_url returns the site url with the language suffix.
		https://site.com/fr/
		Using this home url replacer processor creates an invalid path for the static files like flags images.
		Ex:
		home_url     http://site.com/fr/wp-content/plugins/translatepress-multilingual/assets/images/flags/fr_FR.png
		get_site_url http://site.com/wp-content/plugins/translatepress-multilingual/assets/images/flags/fr_FR.png
	*/
	public function brizy_content( $content ) {

		$content = str_replace(
			'class="trp-flag-image" src="' . Brizy_Config::SITE_URL_PLACEHOLDER,
			'class="trp-flag-image" src="' . get_site_url(),
			$content
		);

		$content = str_replace(
			self::SITE_URL_PLACEHOLDER,
			get_site_url(),
			$content
		);

		return $content;
	}

	/*
	    Fix urls of menu language preview only.
		TranslatePress replaces the urls of the switcher menu items with the current url which is somthing like this http://localhost/ro/page-a/?preview_id=15&preview_nonce=113f163be5&preview=true
		It is sended to the compilator and it remains forever like that.
		We need to make sure that the urls of the menu should be send to the compilator without these query strings.
	*/
	public function wp_get_nav_menu_items( $items ) {

		if ( isset( $_GET['preview_nonce'] ) ) {
			wp_cache_delete( 'cur_page_url', 'trp' );
			add_filter( 'trp_curpageurl', [ $this, 'trp_curpageurl' ] );
		}

		return $items;
	}

	public function trp_curpageurl( $url ) {

		if ( strpos( $url, 'preview_nonce' ) ) {
			return strtok( $url, '?' );
		}

		return $url;
	}

	public function menu_data( $menus ) {

		foreach ( $menus as &$menu ) {
			foreach ( $menu->items as &$item ) {
				if ( isset( $item->value->classes ) && in_array( 'menu-item-object-language_switcher', $item->value->classes ) ) {
					$item->value->url = str_replace( get_site_url(), self::SITE_URL_PLACEHOLDER, $item->value->url );
				}
			}
		}

		return $menus;
	}

	public function home_url( $url ) {
		return rtrim( $url, '/' );
	}

	public function brizy_toolbar_link( $url, $post ) {
		global $TRP_LANGUAGE;
		$settings = new TRP_Settings();
		$settings = $settings->get_settings();

		if ( $TRP_LANGUAGE == $settings['default-language'] && !trp_is_translation_editor() ) {
			return $url;
		}

		add_filter( 'trp_home_url', [ $this, 'trp_home_url' ], 10, 5 );
		$url = base64_encode( preg_replace("(^https?://)", "", $post->edit_url() ) );
		self::$url = $url;
		remove_filter( 'trp_home_url', [ $this, 'trp_home_url' ], 10 );

		return $url;
	}

	public function trp_translated_html( $html ) {
		return str_replace( self::$url, base64_decode( self::$url ), $html );
	}

	public function trp_home_url( $new_url, $abs_home, $TRP_LANGUAGE, $path, $url ) {
		return $url;
	}
}
