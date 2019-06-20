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

		foreach ( $block->getAssets() as $uid => $path ) {
			if ( ! $this->client->isMediaUploaded( $uid ) ) {

				$attachmentId = $this->getAttachmentByMediaName( $uid );

				if ( ! $attachmentId ) {
					throw new Exception( 'Invalid uid provided in upload block media' );
				}

				$file = get_attached_file( $attachmentId );

				$this->client->uploadMedia( $file );
			}
		}

		$this->client->createOrUpdateBlock( $block );
	}

	/**
	 * @param Brizy_Editor_Block $block
	 *
	 * @return mixed|void
	 * @throws Exception
	 */
	public function delete( Brizy_Editor_Block $block ) {
		$this->client->deleteBlock( $block->getCloudId() );
	}
}