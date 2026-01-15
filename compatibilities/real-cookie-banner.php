<?php

/**
 * Compatibility with Real Cookie Banner plugin
 * Disables Real Cookie Banner completely in Brizy editor context
 * This prevents Real Cookie Banner from interfering with editor script loading order
 */
class Brizy_Compatibilities_RealCookieBanner {

	public function __construct() {
		// Hook very early to prevent output buffering
		add_filter( 'RCB/Blocker/Enabled', [ $this, 'disable_blocker' ], 1 );
		
		// Hook to prevent loading banner assets
		add_filter( 'RCB/Banner/ShouldLoadAssets', [ $this, 'disable_banner_assets' ], 1, 2 );
		
		// Hook early to remove Real Cookie Banner hooks
		add_action( 'plugins_loaded', [ $this, 'disable_real_cookie_banner' ], 1 );
		add_action( 'init', [ $this, 'disable_real_cookie_banner' ], 1 );
		add_action( 'admin_init', [ $this, 'disable_real_cookie_banner' ], 1 );
	}

	/**
	 * Check if we are in Brizy editor (NOT in preview)
	 * Uses the official Brizy method which already correctly distinguishes between editor and preview
	 */
	private function is_editor() {
		// Use the official Brizy method which correctly checks editor vs preview
		if ( class_exists( 'Brizy_Public_Main' ) && method_exists( 'Brizy_Public_Main', 'is_editing' ) ) {
			return Brizy_Public_Main::is_editing();
		}
		
		// Fallback: Direct check only for editor (not preview)
		// Editor: action=in-front-editor in admin OR is-editor-iframe in frontend
		// Preview: doesn't have any of these
		if ( is_admin() && isset( $_GET['action'] ) && $_GET['action'] === 'in-front-editor' ) {
			return true;
		}
		
		if ( ! is_admin() && ( isset( $_GET['is-editor-iframe'] ) || isset( $_REQUEST['is-editor-iframe'] ) ) ) {
			return true;
		}
		
		return false;
	}

	/**
	 * Disable Real Cookie Banner blocker
	 */
	public function disable_blocker( $enabled ) {
		if ( $this->is_editor() ) {
			return false;
		}
		return $enabled;
	}

	/**
	 * Prevent loading banner assets
	 */
	public function disable_banner_assets( $should_load, $context ) {
		if ( $this->is_editor() ) {
			return false;
		}
		return $should_load;
	}

	/**
	 * Completely disable Real Cookie Banner in Brizy editor
	 */
	public function disable_real_cookie_banner() {
		if ( ! $this->is_editor() ) {
			return;
		}
		
		// Disable blocker completely using Real Cookie Banner filters
		add_filter( 'RCB/Blocker/Enabled', '__return_false', 999 );
		add_filter( 'DevOwl/RealCookieBanner/Blocker/Enabled', '__return_false', 999 );
		
		// Prevent loading banner assets
		add_filter( 'RCB/Banner/ShouldLoadAssets', '__return_false', 999 );
		
		// Remove scripts and styles
		add_action( 'wp_enqueue_scripts', [ $this, 'dequeue_scripts_styles' ], 999 );
		add_action( 'admin_enqueue_scripts', [ $this, 'dequeue_scripts_styles' ], 999 );
	}

	/**
	 * Remove Real Cookie Banner scripts and styles
	 */
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

