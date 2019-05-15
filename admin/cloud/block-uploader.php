<?php

/**
 * Class Brizy_Admin_Cloud_BlockUploader
 */
class Brizy_Admin_Cloud_BlockUploader extends Brizy_Admin_Cloud_AbstractUploader {

	use Brizy_Editor_Asset_AttachmentAware;

	/**
	 * @param Brizy_Editor_Block $block
	 *
	 * @return mixed|void
	 * @throws Exception
	 */
	public function upload( Brizy_Editor_Block $block ) {

		// check if the assets are uploaded in cloud
		// upload them if needed
		// create the block in cloud

		$client = Brizy_Admin_Cloud_Client::instance();

		foreach ( $block->getAssets() as $uid => $path ) {
			if ( $client->isMediaUploaded( $uid ) ) {
				$client->uploadMedia( $uid );
			}
		}

		$client->createOrUpdateBlock( $block );
	}

	/**
	 * @param Brizy_Editor_Block $block
	 *
	 * @return mixed|void
	 * @throws Exception
	 */
	public function delete( Brizy_Editor_Block $block ) {
		$client = Brizy_Admin_Cloud_Client::instance();
		$client->deleteBlock( $block->getCloudId() );
	}
}