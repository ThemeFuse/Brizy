<?php

class Brizy_Admin_SiteSettings_Frontend {

	public function __construct() {
		add_action( 'wp_head', array( $this, 'settings_header' ) );
		add_action( 'wp_footer', array( $this, 'settings_footer' ) );
	}

	public function settings_header() {

		$context = array(
			'site_settings'  => array(
				'title'       => html_entity_decode( get_bloginfo( 'name' ) ),
				'description' => html_entity_decode( get_bloginfo( 'description' ) ),
				'favicon'     => get_option( 'brizy-settings-favicon' ),
				'favicon_url' => site_url( get_option( 'brizy-settings-favicon' ) )
			),
			/*'social_sharing' => array(
				'title'         => html_entity_decode( get_option( 'brizy-social-title' ) ),
				'description'   => html_entity_decode( get_option( 'brizy-social-description' ) ),
				'thumbnail'     => get_option( 'brizy-social-thumbnail' ),
				'thumbnail_url' => site_url( get_option( 'brizy-social-thumbnail' ) )
			),*/
			'custom_css'     => html_entity_decode( get_option( 'brizy-custom-css' ) ),
			'code_injection' => array(
				'header_code' => html_entity_decode( get_option( 'brizy-header-injection' ) ),
				'footer_code' => html_entity_decode( get_option( 'brizy-footer-injection' ) )
			),
			'site_url'       => site_url(),
			'language'       => get_locale(),
		);

		if ( is_single() && ( $post_description = get_post_meta( get_the_ID(), 'brizy-seo-description', true ) ) ) {
			$context['post_description'] = $post_description;
		}

		echo Brizy_TwigEngine::instance( Brizy_Editor::get()->get_path( '/public/views' ) )
		                     ->render( 'head-site-settings.html.twig', $context );
	}

	public function settings_footer() {
		$params                     = array();
		$params['footer_injection'] = get_option( 'brizy-footer-injection' );

		echo Brizy_TwigEngine::instance( Brizy_Editor::get()->get_path( '/public/views' ) )
		                     ->render( 'footer-site-settings.html.twig', $params );
	}
}
