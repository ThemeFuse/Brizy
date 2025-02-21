<?php

class Brizy_Editor_Screenshot_Manager
{

    const BLOCK_TYPE_NORMAL = 'normal';
    const BLOCK_TYPE_GLOBAL = 'global';
    const BLOCK_TYPE_SAVED = 'saved';
    const BLOCK_TYPE_LAYOUT = 'layout';

    /**
     * @var Brizy_Editor_UrlBuilder
     */
    private $urlBuilder;

    /**
     * Brizy_Editor_Screenshot_Manager constructor.
     *
     * @param Brizy_Editor_UrlBuilder $urlBuilder
     */
    public function __construct(Brizy_Editor_UrlBuilder $urlBuilder)
    {
        $this->urlBuilder = $urlBuilder;
    }


    /**
     * @param $screenUid
     * @param $blockType
     * @param $imageContent
     * @param $postId
     *
     * @return bool
     */
    public function saveScreenshot($screenUid, $blockType, $imageContent, $postId)
    {
        $path = $this->getScreenshotPath($screenUid, $blockType, $postId);

        if (!$this->validateImageContent($imageContent)) {
            throw new Exception(__('Invalid image content', 'brizy'));
        }
        if (!$this->validateUID($screenUid)) {
            throw new Exception(__('Invalid uid string', 'brizy'));
        }

        $extension = 'jpeg';
        $screenFileName = $screenUid.'.'.$extension;
        $screenFullPath = $path.DIRECTORY_SEPARATOR.$screenFileName;

        $wp_filetype = wp_check_filetype($screenFileName);
        if (!$wp_filetype['ext'] && !current_user_can('unfiltered_upload')) {
            return false;
        }

        try {
            return $this->storeThumbnail($imageContent, $screenFullPath);
        } catch (Exception $e) {
            return false;
        }
    }

    public function getScreenshot($screenUid, $postId = null)
    {
        if (!$this->validateUID($screenUid)) {
            throw new Exception(__('Invalid uid string', 'brizy'));
        }

        $types = array(
            self::BLOCK_TYPE_NORMAL,
            self::BLOCK_TYPE_GLOBAL,
            self::BLOCK_TYPE_SAVED,
            self::BLOCK_TYPE_LAYOUT,
        );

        foreach ($types as $type) {
            $filePath = $this->getScreenshotPath($screenUid, $type, $postId);

            $filePath = $filePath.DIRECTORY_SEPARATOR."{$screenUid}.jpeg";

            if (file_exists($filePath)) {
                return $filePath;
            }
        }

        return null;
    }


    private function getScreenshotPath($screenUID, $blockType, $postID)
    {
        $folderPath = null;

        switch ($blockType) {
            case self::BLOCK_TYPE_NORMAL:
                $this->urlBuilder->set_post_id($postID);
                $folderPath = $this->urlBuilder->page_upload_path('blockThumbnails');
                break;
            case self::BLOCK_TYPE_GLOBAL:
                $folderPath = $this->urlBuilder->brizy_upload_path('blockThumbnails'.DIRECTORY_SEPARATOR.'global');
                break;
            case self::BLOCK_TYPE_SAVED:
                $folderPath = $this->urlBuilder->brizy_upload_path('blockThumbnails'.DIRECTORY_SEPARATOR.'saved');
                break;
            case self::BLOCK_TYPE_LAYOUT:
                $folderPath = $this->urlBuilder->brizy_upload_path('blockThumbnails'.DIRECTORY_SEPARATOR.'layout');
                break;
            default:
                return null;
        }

        return $folderPath;
    }


    /**
     * @param $content
     * @param $filePath
     *
     * @return bool
     */
    private function storeThumbnail($content, $filePath)
    {
         $tempFile = Brizy_Editor_Asset_StaticFileTrait::createSideLoadFile(
            basename($filePath),
            $content
        );

        $filePath = Brizy_Editor_Asset_StaticFileTrait::createSideLoadMedia( $tempFile, $filePath );

		if($filePath instanceof WP_Error) {
			throw new Exception("Unable to store the thumbnail");
		}

        if ($filePath) {
            $filePath = $this->resizeImage($filePath);
        }

        return $filePath;
    }

    /**
     * @param $thumbnailFullPath
     *
     * @return bool
     */
    private function resizeImage($thumbnailFullPath)
    {
        try {
            $imageEditor = wp_get_image_editor($thumbnailFullPath);

            if ($imageEditor instanceof WP_Error) {
                throw new Exception($imageEditor->get_error_message());
            }

            $imageEditor->resize(600, 600);
            $result = $imageEditor->save($thumbnailFullPath);

            return is_array($result);
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * @param $imageContent
     */
    protected function validateImageContent($imageContent)
    {
        file_put_contents($tmpFilePath = tempnam(get_temp_dir(), 'screen'), $imageContent);
        $mime = Brizy_Public_AssetProxy::get_mime($tmpFilePath);
	    unlink($tmpFilePath);
	    if ($mime !== 'image/jpeg') {
	        return false;
        }
        return true;
    }

    protected function validateUID($screenUid)
    {
        if (!preg_match("/^.[-a-zA-Z0-9]+$/", $screenUid)) {
            return false;
        }

        return true;
    }
}
