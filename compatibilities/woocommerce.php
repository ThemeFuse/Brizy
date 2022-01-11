<?php

class Brizy_Compatibilities_Woocommerce {

	public function __construct() {
		add_action( 'woocommerce_checkout_terms_and_conditions', [ $this, 'woocommerce_checkout_terms_and_conditions' ], 29 );
		add_action( 'wp_enqueue_scripts', [ $this, 'wp_enqueue_scripts' ], 11 );
		add_filter( 'brizy_html_entity_decode', '__return_false' );
		add_filter( 'brizy_template_content_compiled', [ $this, 'insertWooNotice' ] );
	}

	/*
	 * Dont allow woo to render post_content of the terms page if it is edited with the brizy,
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

		if ( ! isset( $_GET[ Brizy_Editor::prefix( '-edit' ) ] ) && ! isset( $_GET[ Brizy_Editor::prefix( '-edit-iframe' ) ] ) ) {
			return;
		}

		if ( 'geolocation_ajax' === get_option( 'woocommerce_default_customer_address' ) ) {
			wp_dequeue_script( 'wc-geolocation' );
		}
	}

	public function insertWooNotice( $content ) {

		$notices = wc_print_notices( true );

		if ( empty( $content ) || empty( $notices ) || false == strpos( $content, 'brz-section__header ' ) ) {
			return $content;
		}

	    $dom = Brizy_Parser_Pquery::parseStr( $content );

	    $dom->query('section.brz-section__header')->after( $notices );

		return $dom->html();
	}
}













