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

		$manager    = new Brizy_Editor_Screenshot_Manager( new  Brizy_Editor_UrlBuilder( $this->client->getBrizyProject() ) );
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
		throw new Exception('Import screenshots not implemented yet');
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
