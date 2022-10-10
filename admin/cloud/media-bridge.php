<?php

/**
 * Class Brizy_Admin_Cloud_BlockUploader
 */
class Brizy_Admin_Cloud_MediaBridge extends Brizy_Admin_Cloud_AbstractBridge {

	use Brizy_Editor_Asset_AttachmentAware;

	/**
	 * This is the block id for which we are importing the media
	 * If this  is not set the import will fail.
	 *
	 * @var int
	 */
	private $blockId;

	/**
	 * @param string|array $media
	 *
	 * @return bool|void
	 * @throws Exception
	 */
	public function export( $media ) {

		$uid     = isset( $media->uid ) ? $media->uid : $media;
		$mediaId = (int) $this->getAttachmentByMediaName( $uid );

		if ( ! $mediaId ) {
			throw new Exception( "Unable to find media {$uid}" );
		}

		if ( $this->client->isMediaUploaded( $uid ) ) {
			return true;
		}

		$filePath = get_attached_file( $mediaId );
		$this->client->uploadMedia( $uid, $filePath );
	}

	/**
	 * @param array|string $media
	 *
	 * @return mixed|void
	 * @throws Exception
	 */
	public function import( $media ) {
		$media_cacher = new Brizy_Editor_CropCacheMedia( $this->client->getBrizyProject() );
		$media_cacher->download_original_image( $media );
	}

	/**
	 * @param $layoutId
	 *
	 * @return mixed|void
	 * @throws Exception
	 */
	public function delete( $layoutId ) {
		throw new Exception( 'Not implemented' );
	}

	/**
	 * @param int $blockId
	 *
	 * @return Brizy_Admin_Cloud_MediaBridge
	 */
	public function setBlockId( $blockId ) {
		$this->blockId = (int) $blockId;

		return $this;
	}

}
