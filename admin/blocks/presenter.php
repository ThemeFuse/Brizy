<?php

class Brizy_Admin_Blocks_Presenter {

	public function __construct() {
		add_action( 'brizy_asset_manager_before_aggregate_styles', [ $this, 'getGlobalBlockStyles' ] );
		add_action( 'brizy_asset_manager_before_aggregate_scripts', [ $this, 'getGlobalBlockScripts' ] );
	}

	public function getGlobalBlockStyles( $styles ) {
		return $styles;
	}

	public function getGlobalBlockScripts( $scripts ) {
		return $scripts;
	}
}