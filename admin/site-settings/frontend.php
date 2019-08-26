<?php

class Brizy_Admin_SiteSettings_Frontend {

	public function __construct() {
		//add_action( 'wp_head', array( $this, 'brizy_settings_header' ) );
		//add_action( 'wp_footer', array( $this, 'brizy_settings_footer' ) );
	}

	public function brizy_settings_header() {

		$context = array(
			'site_settings'  => array(
				'title'       => html_entity_decode( get_bloginfo( 'name' ) ),
				'description' => html_entity_decode( get_bloginfo( 'description' ) ),
				'favicon'     => get_option( 'brizy-settings-favicon' ),
				'favicon_url' => site_url( get_option( 'brizy-settings-favicon' ) )
			),
			'social_sharing' => array(
				'title'         => html_entity_decode( get_option( 'brizy-social-title' ) ),
				'description'   => html_entity_decode( get_option( 'brizy-social-description' ) ),
				'thumbnail'     => get_option( 'brizy-social-thumbnail' ),
				'thumbnail_url' => site_url( get_option( 'brizy-social-thumbnail' ) )
			),
			'custom_css'     => html_entity_decode( get_option( 'brizy-custom-css' ) ),
			'code_injection' => array(
				'header_code' => html_entity_decode( get_option( 'brizy-header-injection' ) ),
				'footer_code' => html_entity_decode( get_option( 'brizy-footer-injection' ) )
			),
			'site_url'       => site_url(),
			'language'       => get_locale(),
		);

		echo Brizy_TwigEngine::instance( Brizy_Editor::get()->get_path( '/public/views' ) )
		                     ->render( 'head-site-settings.html.twig', $context );
	}

	public function brizy_settings_footer() {
		$params                     = array();
		$params['footer_injection'] = get_option( 'brizy-footer-injection' );

		echo Brizy_TwigEngine::instance( Brizy_Editor::get()->get_path( '/public/views' ) )
		                     ->render( 'footer-site-settings.html.twig', $params );
	}
}
