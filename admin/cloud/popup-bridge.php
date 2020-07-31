<?php

/**
 * Class Brizy_Admin_Cloud_BlockUploader
 */
class Brizy_Admin_Cloud_PopupBridge extends Brizy_Admin_Cloud_AbstractBridge {


	/**
	 * @param Brizy_Editor_Block $layout
	 *
	 * @return mixed|void
	 * @throws Exception
	 */
	public function export( $layout ) {

		// check if the assets are uploaded in cloud
		// upload them if needed
		// create the block in cloud

		$media = json_decode( $layout->getMedia() );

		if ( ! $media || ! isset( $media->fonts ) ) {
			throw new Exception( 'No fonts property in media object' );
		}

		if ( ! $media || ! isset( $media->images ) ) {
			throw new Exception( 'No images property in media object' );
		}

		$bridge = new Brizy_Admin_Cloud_MediaBridge( $this->client );
		foreach ( $media->images as $uid ) {
			try {
				$bridge->export( $uid );
			} catch (Exception $e) {
				continue;
			}
		}

		$bridge = new Brizy_Admin_Cloud_FontBridge( $this->client );
		foreach ( $media->fonts as $fontUid ) {
			try {
				$bridge->export( $fontUid );
			} catch (Exception $e) {
				continue;
			}
		}

		$this->client->createOrUpdatePopup( $layout );
	}

	/**
	 * @param $popupId
	 *
	 * @return mixed|void
	 * @throws Exception
	 */
	public function import( $popupId ) {
		global $wpdb;

		$popups = $this->client->getPopups( [ 'uid' => $popupId ] );

		if ( ! isset( $popups[0] ) ) {
			return;
		}

		$popup = $popups[0];
		try {
			$wpdb->query( 'START TRANSACTION ' );
			$name = md5( time() );
			$post = wp_insert_post( array(
				'post_title'  => $name,
				'post_name'   => $name,
				'post_status' => 'publish',
				'post_type'   => Brizy_Admin_Popups_Main::CP_POPUP
			) );

			if ( $post ) {
				$brizyPost = Brizy_Editor_Popup::get( $post, $popup['uid'] );
				$brizyPost->setMeta( $popup['meta'] );
				$brizyPost->setCloudId( $popup['id'] );
				$brizyPost->set_editor_data( $popup['data'] );
				$brizyPost->set_uses_editor( true );
				$brizyPost->set_needs_compile( true );
				$brizyPost->setDataVersion( 1 );
				$brizyPost->save();
			}
			$wpdb->query( 'COMMIT' );
		} catch ( Exception $e ) {
			$wpdb->query( 'ROLLBACK' );
			Brizy_Logger::instance()->critical( 'Importing layout ' . $popupId . ' failed', [ $e ] );
		}
	}

	/**
	 * @param Brizy_Editor_Block $layout
	 *
	 * @return mixed|void
	 * @throws Exception
	 */
	public function delete( $layout ) {
		$this->client->deletePopup( $layout->getCloudId() );
	}
}
