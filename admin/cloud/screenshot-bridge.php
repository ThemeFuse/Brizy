<?php

/**
 * Class Brizy_Admin_Cloud_BlockUploader
 */
class Brizy_Admin_Cloud_ScreenshotBridge extends Brizy_Admin_Cloud_AbstractBridge {

	use Brizy_Editor_Asset_AttachmentAware;

	/**
	 * @param Brizy_Editor_Block $block
	 *
	 * @return mixed|void
	 * @throws Exception
	 */
	public function export( $block ) {
		$meta      = json_decode( $block->getMeta() );
		$screenUid = $meta->_thumbnailSrc;


		// aca;sdca;sd

		$manager    = new Brizy_Editor_Screenshot_Manager( new  Brizy_Editor_UrlBuilder( null ) );
		$screenPath = $manager->getScreenshot( $screenUid );

		if ( $screenPath ) {
			$this->client->createScreenshot( $screenUid, $screenPath );
		}
	}

	/**
	 * @param Brizy_Editor_Block $block
	 *
	 * @return mixed|void
	 * @throws Exception
	 */
	public function import( $block ) {
		$meta            = json_decode( $block->getMeta() );
		$screenUid       = $meta->_thumbnailSrc;
		$cloudScreenPath = $this->client->getScreenshotUrl( $screenUid );

		$manager  = new Brizy_Editor_Screenshot_Manager( new  Brizy_Editor_UrlBuilder( null ) );
		$response = $manager->saveScreenshot( $screenUid, Brizy_Editor_Screenshot_Manager::BLOCK_TYPE_SAVED, file_get_contents( $cloudScreenPath ), null );

		if ( !$response ) {

		}
	}

	/**
	 * @param Brizy_Editor_Block $layout
	 *
	 * @return mixed|void
	 * @throws Exception
	 */
	public function delete( $layout ) {
		$this->client->deleteBlock( $layout->getCloudId() );
	}
}
