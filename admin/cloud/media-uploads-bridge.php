<?php

/**
 * Class Brizy_Admin_Cloud_MediaUploadsBridges
 */
class Brizy_Admin_Cloud_MediaUploadsBridge extends Brizy_Admin_Cloud_AbstractBridge
{

    use Brizy_Editor_Asset_AttachmentAware;
    use Brizy_Editor_Asset_StaticFileTrait;

    /**
     * This is the block id for which we are importing the media
     * If this  is not set the import will fail.
     *
     * @var int
     */
    private $blockId;

    /**
     * @param $mediaUid
     *
     * @return mixed|void
     * @throws Exception
     */
    public function export($mediaUpload)
    {

        list($uploadUid,$uploadName) = explode('|||', $mediaUpload);
        $mediaId = (int)$this->getAttachmentByMediaName($uploadUid);

        if (!$mediaId) {
            throw new Exception("Unable to find media {$uploadUid}");
        }

        if ($this->client->isCustomFileUploaded($uploadUid,$uploadName)) {
            return true;
        }

        // upload file
        $filePath = get_attached_file($mediaId);
        $this->client->uploadCustomFile($uploadUid, $filePath);
    }

    /**
     * @param $mediaUid
     *
     * @return mixed|void
     * @throws Exception
     */
    public function import($mediaUpload)
    {

        if (!$this->blockId) {
            throw new Exception('The block id is not set.');
        }

        list($fileUid, $customFileName) = explode('|||', $mediaUpload);

        // enable svg upload
        // enable svg upload
        $svnUpload        = new Brizy_Admin_Svg_Main();
        $jsonUpload        = new Brizy_Admin_Json_Main();
        $svnUploadEnabled = Brizy_Editor_Storage_Common::instance()->get( 'svg-upload', false );
        $jsonUploadEnabled = Brizy_Editor_Storage_Common::instance()->get( 'json-upload', false );

        if ( ! $svnUploadEnabled ) {
            $svnUpload->enableSvgUpload();
        }
        if ( ! $jsonUploadEnabled ) {
            $jsonUpload->enableJsonUpload();
        }

        // download file and store it in wp
        $urlBuilder = new Brizy_Editor_UrlBuilder();
        $external_asset_url = $urlBuilder->external_custom_file($fileUid, $customFileName);


        $original_asset_path = $urlBuilder->brizy_upload_path("/custom_files/" . $customFileName);
        $original_asset_path_relative = $urlBuilder->brizy_upload_relative_path("/custom_files/" . $customFileName);

        if (!file_exists($original_asset_path)) {
            // I assume that the media was already attached.

            if (!$this->store_file($external_asset_url, $original_asset_path)) {
                // unable to save the attachment
                Brizy_Logger::instance()->error('Unable to store original media file', array(
                    'source' => (string)$external_asset_url,
                    'destination' => $original_asset_path
                ));
                throw new Exception('Unable to cache custom file upload');
            }
        }

        $attachmentId = $this->create_attachment($customFileName, $original_asset_path, $original_asset_path_relative, null, $fileUid);

        if ($attachmentId === 0 || is_wp_error($attachmentId)) {
            Brizy_Logger::instance()->error('Unable to create custom file attachment', array(
                'customFile' => (string)$external_asset_url,
                'original_asset_path' => (string)$original_asset_path,
                'original_asset_path_relative' => (string)$original_asset_path_relative,

            ));
            throw new Exception('Unable to attach media');
        }

        // disabled it if was disabled before
        if ( ! $svnUploadEnabled ) {
            $svnUpload->disableSvgUpload();
        }
        if ( ! $jsonUploadEnabled ) {
            $jsonUpload->disableJsonUpload();
        }
    }


    /**
     * @param $blockId
     *
     * @return mixed|void
     * @throws Exception
     */
    public function delete($blockId)
    {
        throw new Exception('Not implemented');
    }

    /**
     * @param int $blockId
     *
     * @return Brizy_Admin_Cloud_MediaBridge
     */
    public function setBlockId($blockId)
    {
        $this->blockId = (int)$blockId;

        return $this;
    }
}
