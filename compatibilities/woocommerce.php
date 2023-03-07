<?php

class Brizy_Compatibilities_Woocommerce {

	public function __construct() {
		add_action( 'woocommerce_checkout_terms_and_conditions', [ $this, 'woocommerce_checkout_terms_and_conditions' ], 29 );
		add_action( 'wp_enqueue_scripts', [ $this, 'wp_enqueue_scripts' ], 11 );
		add_filter( 'brizy_template_content_compiled', [ $this, 'insertWooNotice' ] );
	}

	/*
	 * Don't allow woo to render post_content of terms page if it is edited with brizy,
	 * will lead to the display of the unformatted our html above the place order button on checkout page.
	 */
	public function woocommerce_checkout_terms_and_conditions() {
		$terms_page_id = wc_terms_and_conditions_page_id();

		if ( ! $terms_page_id || ! Brizy_Editor_Entity::isBrizyEnabled( $terms_page_id ) ) {
			return;
		}

		remove_action( 'woocommerce_checkout_terms_and_conditions', 'wc_terms_and_conditions_page_content', 30 );
	}

	public function wp_enqueue_scripts() {

		if ( ! Brizy_Public_Main::is_editing() ) {
			return;
		}

		if ( 'geolocation_ajax' === get_option( 'woocommerce_default_customer_address' ) ) {
			wp_dequeue_script( 'wc-geolocation' );
		}
	}

	public function insertWooNotice( $content ) {

		$notices = wc_get_notices();

		if ( empty( $content ) || empty( $notices ) || ! strpos( $content, 'brz-section__header' ) || strpos( $content, 'editor_woo_notice' ) ) {
			return $content;
		}

		$parser = new Brizy_Parser_Parser( $content );
		$parser = $parser->getParser();

		$parser->appendText( 'section', 'brz-section__header', '{{ editor_woo_notice }}' );

		return $parser->getHtml();
	}
}













