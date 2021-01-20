<?php

class Brizy_Admin_Cloud_Cron {

	use Brizy_Admin_Cloud_SyncAware;

	const BRIZY_CLOUD_CRON_KEY = 'brizy-cloud-synchronize';


	public static function _init() {
		static $instance;

		if ( ! $instance ) {
			$instance = new self( Brizy_Admin_Cloud_Client::instance( Brizy_Editor_Project::get(), new WP_Http() ) );
		}

		return $instance;
	}

	/**
	 * Brizy_Admin_Cloud_Cron constructor.
	 */
	public function __construct( $client ) {

		$this->setClient( $client );

		add_action( self::BRIZY_CLOUD_CRON_KEY, array( $this, 'syncBlocksAction' ) );
		add_action( self::BRIZY_CLOUD_CRON_KEY, array( $this, 'syncLayoutsAction' ) );

		add_filter( 'cron_schedules', array( $this, 'addBrizyCloudCronSchedules' ) );


		if ( ! wp_next_scheduled( self::BRIZY_CLOUD_CRON_KEY ) ) {
			$interval = is_user_logged_in() ? '5minute' : 'hourly';

			if ( is_user_logged_in() ) {
				wp_schedule_event( time(), $interval, self::BRIZY_CLOUD_CRON_KEY );
			}
		}
	}

	public function syncLayoutsAction() {
		Brizy_Logger::instance()->debug('Sync layouts cron called');
		return $this->syncLayouts(1);
	}

	public function syncBlocksAction() {
		Brizy_Logger::instance()->debug('Sync blocks cron called');
		return $this->syncBlocks(1);
	}

	public function addBrizyCloudCronSchedules( $schedules ) {
		// Adds once weekly to the existing schedules.
		$schedules['5minute'] = array(
			'interval' => 300,
			'display'  => __( 'Once in 5 minutes' )
		);

		return $schedules;
	}
}
