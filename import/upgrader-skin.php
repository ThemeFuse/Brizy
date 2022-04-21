<?php defined( 'ABSPATH' ) or die();

if ( ! class_exists( 'WP_Upgrader_Skin' ) ) {
	require ABSPATH . 'wp-admin/includes/class-wp-upgrader-skin.php';
}

class Brizy_Import_UpgraderSkin extends WP_Upgrader_Skin {

	public function header()
	{
		// just keep it quiet
	}

	public function footer()
	{
		// just keep it quiet
	}

	public function feedback( $string, ...$args )
	{
		// just keep it quiet
	}
}