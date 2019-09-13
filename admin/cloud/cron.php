<?php

class Brizy_Admin_Cloud_Cron {

	/**
	 * @var Brizy_Admin_Cloud_Client
	 */
	protected $client;

	public static function _init() {
		static $instance;

		if ( ! $instance ) {
			$instance = new self( new Brizy_Admin_Cloud_Client( Brizy_Editor_Project::get(), new WP_Http() ) );
		}

		return $instance;
	}

	/**
	 * Brizy_Admin_Cloud_Cron constructor.
	 */
	public function __construct( Brizy_Admin_Cloud_Client $client ) {

		$this->client = $client;

		add_action( 'brizy-cloud-synchronize', array( $this, 'syncBlocks' ) );
		add_action( 'brizy-cloud-synchronize', array( $this, 'syncPopups' ) );
		add_action( 'brizy-cloud-synchronize', array( $this, 'syncLayouts' ) );
		add_filter( 'cron_schedules', array( $this, 'addBrizyCloudCronSchedules' ) );

		$interval = is_user_logged_in() ? '5minute' : 'hourly';

		if ( ! wp_next_scheduled( 'brizy-cloud-synchronize' ) ) {
			wp_schedule_event( time(), $interval, 'brizy-cloud-synchronize' );
		}
	}

	public function syncLayouts() {
		$layoutIds = $this->getLayoutsForSync();

		foreach ( $layoutIds as $lId ) {
			$this->syncLayout( $lId->ID );
		}
	}

	public function syncPopups() {
		$postIds = $this->getPopupsForSync();

		foreach ( $postIds as $popupId ) {
			$this->syncPopup( $popupId->ID );
		}
	}

	public function syncBlocks() {
		$postIds = $this->getBlocksForSync();

		foreach ( $postIds as $blockId ) {
			$this->syncBlock( $blockId->ID );
		}
	}

	public function addBrizyCloudCronSchedules( $schedules ) {
		// Adds once weekly to the existing schedules.
		$schedules['5minute'] = array(
			'interval' => 300,
			'display'  => __( 'Once in 5 minutes' )
		);

		return $schedules;
	}

	private function getLayoutsForSync() {
		global $wpdb;

		$meta_key       = Brizy_Editor_Layout::BRIZY_CLOUD_UPDATE_META;
		$savedBlockType = Brizy_Admin_Layouts_Main::CP_LAYOUT;

		$postIds = $wpdb->get_results(
			"SELECT ID FROM {$wpdb->posts} p 
					JOIN {$wpdb->postmeta} pm ON pm.post_id=p.ID and pm.meta_key='{$meta_key}' and pm.meta_value=1
					WHERE p.post_type='{$savedBlockType}'
					LIMIT 1" );

		return $postIds;
	}

	private function getPopupsForSync() {
		global $wpdb;

		$meta_key       = Brizy_Editor_Popup::BRIZY_CLOUD_UPDATE_META;
		$savedBlockType = Brizy_Admin_Popups_Main::CP_SAVED_POPUP;

		$postIds = $wpdb->get_results(
			"SELECT ID FROM {$wpdb->posts} p 
					JOIN {$wpdb->postmeta} pm ON pm.post_id=p.ID and pm.meta_key='{$meta_key}' and pm.meta_value=1
					WHERE p.post_type='{$savedBlockType}'
					LIMIT 1" );

		return $postIds;
	}

	private function getBlocksForSync() {
		global $wpdb;

		$meta_key       = Brizy_Editor_Block::BRIZY_CLOUD_UPDATE_REQUIRED;
		$savedBlockType = Brizy_Admin_Blocks_Main::CP_SAVED;

		$postIds = $wpdb->get_results(
			"SELECT ID FROM {$wpdb->posts} p 
					JOIN {$wpdb->postmeta} pm ON pm.post_id=p.ID and pm.meta_key='{$meta_key}' and pm.meta_value=1
					WHERE p.post_type='{$savedBlockType}'
					LIMIT 1
					"
		);

		return $postIds;
	}

	private function syncBlock( $blockId ) {

		try {
			$brizyBlock = Brizy_Editor_Block::get( $blockId );

			if ( $brizyBlock && $brizyBlock->isSavedBlock() ) {
				$updater = new Brizy_Admin_Cloud_BlockBridge( $this->client );
				$updater->export( $brizyBlock );

				$brizyBlock->setCloudUpdateRequired( false );
			}
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->critical( 'Failed to sync block',
				[
					'blockId' => $blockId
				] );
		}
	}

	private function syncPopup( $popupId ) {

		try {
			$brizyPopup = Brizy_Editor_Popup::get( $popupId );

			if ( $brizyPopup && $brizyPopup->isSavedPopup() ) {
				$updater = new Brizy_Admin_Cloud_PopupBridge( $this->client );
				$updater->export( $brizyPopup );

				$brizyPopup->setCloudUpdateRequired( false );
			}
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->critical( 'Failed to sync popup',
				[
					'popupId' => $popupId
				] );
		}
	}

	private function syncLayout( $layoutId ) {

		try {
			$brizyLayout = Brizy_Editor_Layout::get( $layoutId );

			if ( $brizyLayout ) {
				$updater = new Brizy_Admin_Cloud_LayoutBridge( $this->client );
				$updater->export( $brizyLayout );

				$brizyLayout->setCloudUpdateRequired( false );
			}
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->critical( 'Failed to sync layout',
				[
					'layoutId' => $layoutId
				] );
		}
	}
}