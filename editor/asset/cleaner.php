<?php

class Brizy_Editor_Asset_Cleaner {
	const CLEAN_FILES_CRON_KEY = 'brizy-asset-clean-files';
	const CLEAN_EMPTY_DIRS_CRON_KEY = 'brizy-asset-clean-dirs';
	const FILE_LIFE_TIME = 2592000; // 30 days

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

		add_action( self::CLEAN_FILES_CRON_KEY, array( $this, 'clean_files' ) );
		add_action( self::CLEAN_EMPTY_DIRS_CRON_KEY, array( $this, 'clean_empty_dirs' ) );
		add_filter( 'cron_schedules', [ $this, 'cron_schedules' ] );

		if ( ! wp_next_scheduled( self::CLEAN_FILES_CRON_KEY ) ) {
			wp_schedule_event( time(), 'ten_minutes', self::CLEAN_FILES_CRON_KEY );
		}

		if ( ! wp_next_scheduled( self::CLEAN_EMPTY_DIRS_CRON_KEY ) ) {
			wp_schedule_event( time(), 'daily', self::CLEAN_EMPTY_DIRS_CRON_KEY );
		}
	}

	/**
	 *  Remove images older than 30 days
	 */
	public function clean_files() {
		$wp_filesystem = new WP_Filesystem_Direct( null );
		$now           = time();

		foreach ( glob( $this->get_upload_dir() . '*/assets/images/{*/*.*,*/*/*.*}', GLOB_BRACE ) as $img ) {
			if ( $now - filemtime( $img ) >= self::FILE_LIFE_TIME ) {
				$wp_filesystem->delete( $img );
			}
		}
	}

	/**
	 *  Remove empty folders
	 */
	public function clean_empty_dirs() {

		$wp_filesystem = new WP_Filesystem_Direct( null );

		foreach ( glob( $this->get_upload_dir() . '*/assets/images/*', GLOB_ONLYDIR ) as $dir ) {
			$this->rm_empty_dir( $dir, $wp_filesystem );
		}
	}

	private function rm_empty_dir( $path, $wp_filesystem ) {

		$empty = true;

		foreach ( glob( $path . "/*" ) as $file ) {
			if ( is_dir( $file ) ) {
				if ( ! $this->rm_empty_dir( $file, $wp_filesystem ) ) {
					$empty = false;
				}
			} else {
				$empty = false;
			}
		}

		if ( $empty ) {
			$wp_filesystem->delete( $path, false, 'd' );
		}

		return $empty;
	}

	public function cron_schedules( $schedules ) {

		$schedules['ten_minutes'] = array(
			'interval' => 600,
			'display'  => esc_html__( 'Every Ten Minutes', 'brizy' ),
		);

		return $schedules;
	}

	public function get_upload_dir() {
		$urlBuilder = new Brizy_Editor_UrlBuilder( Brizy_Editor_Project::get() );
		return $urlBuilder->upload_path( 'brizy/' );
	}
}