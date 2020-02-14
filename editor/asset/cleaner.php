<?php

class Brizy_Editor_Asset_Cleaner {
	const BRIZY_CLEANER_CRON_KEY = 'brizy-asset-cleaner';


	public static function _init() {
		static $instance;

		if ( ! $instance ) {
			$instance = new self();
		}
		return $instance;
	}

	/**
	 * Brizy_Admin_Cloud_Cron constructor.
	 */
	public function __construct() {

		add_action( self::BRIZY_CLEANER_CRON_KEY, array( $this, 'assetClean' ) );

		if ( ! wp_next_scheduled( self::BRIZY_CLEANER_CRON_KEY ) ) {
			wp_schedule_event( time(), 'monthly', self::BRIZY_CLEANER_CRON_KEY );
		}
	}

	public function assetClean() {
		$urlBuilder = new Brizy_Editor_UrlBuilder( Brizy_Editor_Project::get() );
		$uploadsDir = $urlBuilder->upload_path( 'brizy/' );

		$resizeFolders = glob( $uploadsDir . '*/assets/images/iW*/' );

		foreach ( $resizeFolders as $folder ) {
			// check if there is an optimized folder
			$optimizedFolderPath = $folder . 'optimized/';

			if ( file_exists( $optimizedFolderPath ) ) {
				continue;
			}

			$fs = new WP_Filesystem_Direct(null);
			$fs->delete( $folder, true, 'd' );
		}
	}
}
