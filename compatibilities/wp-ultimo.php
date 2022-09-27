<?php

class Brizy_Compatibilities_WpUltimo {

	public function __construct() {
		add_action( 'init', [ $this, 'init' ] );
	}

	public function init() {

		if ( ! Brizy_Public_Main::is_editing() ) {
			return;
		}

		add_filter( 'brizy_editor_config', [ $this, 'remappingAssetsUrl' ] );
	}

	public function remappingAssetsUrl( $config ) {

		if ( ! class_exists( 'Mercator\Mapping' ) ) {
			return $config;
		}

		$mapping = Mercator\Mapping::get_by_domain( $_SERVER['HTTP_HOST'] );

		if ( empty( $mapping ) || ! $mapping->is_active() ) {
			return $config;
		}

		$url_mapped = $mapping->get_domain();

		$original_url = get_blog_option( $mapping->get_site_id(), 'siteurl' );
		$original_url = trim( preg_replace( '#^https?://#', '', $original_url ), '/' );

		$config['urls']['assets'] = str_replace( $original_url, $url_mapped, $config['urls']['assets'] );

		return $config;
	}
}
