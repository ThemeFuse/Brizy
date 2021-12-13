<?php
/**
 * Compatibility with TranslatePress – Translate Multilingual sites: https://wordpress.org/plugins/translatepress-multilingual/
 */
class Brizy_Compatibilities_TranslatePress {

	static $url = '';

	public function __construct() {
		add_action( 'brizy_toolbar_link', [ $this, 'brizy_toolbar_link' ], 10, 2 );
		add_action( 'trp_translated_html', [ $this, 'trp_translated_html' ], 10 );
		add_action( 'home_url', [ $this, 'home_url' ] );
		add_action( 'brizy_create_editor_config_before', [ $this, 'rmLangPrefixFromHomeUrl' ] );
		add_action( 'brizy_create_editor_config_after', [ $this, 'rmFilterTrpHomeUrl' ] );
		add_action( 'brizy_before_send_asset', [ $this, 'clearBufferBeforeSendImg' ] );
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
		remove_filter( 'trp_home_url', [ $this, 'trp_home_url' ] );

		return $url;
	}

	public function trp_translated_html( $html ) {
		return str_replace( self::$url, base64_decode( self::$url ), $html );
	}
	
	public function trp_home_url( $new_url, $abs_home, $TRP_LANGUAGE, $path, $url ) {
		return $url;
	}

	/**
	 * Remove language prefix from the home url before compilation.
	 * If the page is compilated on a non default language url(http://brizy.local/ro/about/) then images will have the url with the language prefix in the html.
	 * background-image: url({@brizy_SITE_URL_PLACEHOLDER@}/ro/?brizy_media=wp-48eefa376f2dc71bb9eb5ce2bb5e0b48&brizy_crop=iW%3D5000%26iH%3Dany)
	 * In this case Brizy_Editor_Asset_MediaAssetProcessor won't find all the images in the html.
	 */
	public function rmLangPrefixFromHomeUrl() {
		add_filter( 'trp_home_url', [ $this, 'trp_home_url' ], 10, 5 );
	}

	public function rmFilterTrpHomeUrl() {
		remove_filter( 'trp_home_url', [ $this, 'trp_home_url' ] );
	}

	public function clearBufferBeforeSendImg() {
		ob_end_clean();
	}
}
