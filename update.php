<?php

class Brizy_Update {

	const KEY = 'brizy-postpone-update';

	private static $instance;

	public static function init() {

		if ( self::$instance ) {
			return self::$instance;
		}

		return self::$instance = new self();
	}

	public function __construct() {
		add_filter( 'site_transient_update_plugins', [ $this, 'unset_update' ] );
		add_filter( 'pre_set_site_transient_update_plugins', [ $this, 'unset_update' ] );
		add_action( 'init', [ $this, 'add_transient' ] );
	}

	public function unset_update( $data ) {

		if ( $this->canUpdate() ) {
			return $data;
		}

		if ( isset( $data->response[ BRIZY_PLUGIN_BASE ] ) ) {
			unset( $data->response[ BRIZY_PLUGIN_BASE ] );
		}

		if ( defined( 'BRIZY_PRO_PLUGIN_BASE' ) && isset( $data->response[ BRIZY_PRO_PLUGIN_BASE ] ) ) {
			unset( $data->response[ BRIZY_PRO_PLUGIN_BASE ] );
		}

		return $data;
	}

	public function add_transient() {

		//update_option( self::KEY, time() + 30 );

		$time = get_option( self::KEY );

		if ( $time ) {

			if ( ( $time > 1 && $time < time() ) || ( isset( $_GET['disable-postpone-update'] ) && is_admin() ) ) {
				delete_transient('update_plugins');
				delete_site_transient('update_plugins');
				update_option( self::KEY, 1 );
			}

			return;
		}

		update_option( self::KEY, time() + ( rand( 10, 45 ) * DAY_IN_SECONDS ) );
	}

	private function canUpdate() {

		$time = get_option( self::KEY );

		return ( ! $time || $time < time() );
	}
}