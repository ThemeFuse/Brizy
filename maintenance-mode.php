<?php

class Brizy_MaintenanceMode {

	private static $instance;

	public static function init() {

		if ( self::$instance ) {
			return self::$instance;
		}

		self::$instance = new self();

		return self::$instance;
	}

	/**
	 * Brizy_Maintenance_Mode constructor.
	 */
	private function __construct() {
		$set = Brizy_Editor_Storage_Common::instance()->get( 'maintenance', false );

		if ( empty( $set['mode'] ) ) {
			return;
		}

		//add_action( 'template_redirect', [ $this, 'template_redirect' ], 11 );
	}

	private function template_redirect() {

	}
}