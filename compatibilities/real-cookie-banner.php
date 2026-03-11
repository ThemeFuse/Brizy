<?php

class Brizy_Compatibilities_RealCookieBanner {

	public function __construct() {
		add_filter( 'RCB/Blocker/Enabled', [ $this, 'disable_blocker' ], 1 );
		add_filter( 'RCB/Banner/ShouldLoadAssets', [ $this, 'disable_banner_assets' ], 1, 2 );
		
		add_action( 'plugins_loaded', [ $this, 'disable_real_cookie_banner' ], 1 );
		add_action( 'init', [ $this, 'disable_real_cookie_banner' ], 1 );
		add_action( 'admin_init', [ $this, 'disable_real_cookie_banner' ], 1 );
	}

	public function disable_blocker( $enabled ) {
		if ( Brizy_Public_Main::is_editing() ) {
			return false;
		}
		return $enabled;
	}

	public function disable_banner_assets( $should_load, $context ) {
		if ( Brizy_Public_Main::is_editing() ) {
			return false;
		}
		return $should_load;
	}

	public function disable_real_cookie_banner() {
		if ( ! Brizy_Public_Main::is_editing() ) {
			return;
		}
		
		add_filter( 'RCB/Blocker/Enabled', '__return_false', 999 );
		add_filter( 'DevOwl/RealCookieBanner/Blocker/Enabled', '__return_false', 999 );
		
		add_filter( 'RCB/Banner/ShouldLoadAssets', '__return_false', 999 );
		
		add_action( 'wp_enqueue_scripts', [ $this, 'dequeue_scripts_styles' ], 999 );
		add_action( 'admin_enqueue_scripts', [ $this, 'dequeue_scripts_styles' ], 999 );
	}

	public function dequeue_scripts_styles() {
		wp_dequeue_script( 'real-cookie-banner' );
		wp_dequeue_script( 'real-cookie-banner-pro' );
		wp_dequeue_script( 'rcb' );
		wp_dequeue_script( 'rcb-pro' );
		wp_dequeue_style( 'real-cookie-banner' );
		wp_dequeue_style( 'real-cookie-banner-pro' );
		wp_dequeue_style( 'rcb' );
		wp_dequeue_style( 'rcb-pro' );
	}
}

