<?php

/**
 * Class Brizy_Admin_Cloud_BlockUploader
 */
class Brizy_Admin_Cloud_MediaBridge extends Brizy_Admin_Cloud_AbstractBridge {

	use Brizy_Editor_Asset_AttachmentAware;

	/**
	 * @param $mediaUid
	 *
	 * @return mixed|void
	 * @throws Exception
	 */
	public function export( $mediaUid ) {

		$mediaId = (int) $this->getAttachmentByMediaName( $mediaUid );

		if ( ! $mediaId ) {
			throw new Exception( "Unable to find media {$mediaUid}" );
		}

		try {
			$filePath = get_attached_file( $mediaId );
			$this->client->uploadMedia( $mediaUid, $filePath );
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->critical( $e->getMessage(), [ 'exceptionTrace' => $e->getTraceAsString() ] );
		}
	}

	/**
	 * @param $mediaUid
	 *
	 * @return mixed|void
	 * @throws Exception
	 */
	public function import( $mediaUid ) {
		throw new Exception( 'Not implemented' );
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
}