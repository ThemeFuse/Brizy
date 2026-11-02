<?php

class Brizy_Admin_Cloud_Cron {

	use Brizy_Admin_Cloud_SyncAware;

	const BRIZY_CLOUD_CRON_KEY = 'brizy-cloud-synchronize';
	const BRIZY_CLOUD_CRON_SCHEDULE = '5minute';


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

		// The event is only scheduled while a user is active on the site. WP-Cron itself runs
		// without a user, so the schedule and the handlers above must not depend on this branch.
		if ( is_user_logged_in() && ! wp_next_scheduled( self::BRIZY_CLOUD_CRON_KEY ) ) {
			wp_schedule_event( time(), self::BRIZY_CLOUD_CRON_SCHEDULE, self::BRIZY_CLOUD_CRON_KEY );
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

	/**
	 * @param array $schedules
	 *
	 * @return array
	 */
	public static function addBrizyCloudCronSchedules( $schedules ) {
		$schedules[ self::BRIZY_CLOUD_CRON_SCHEDULE ] = array(
			'interval' => 300,
			'display'  => __( 'Once in 5 minutes', 'brizy' )
		);

		return $schedules;
	}
}
