<?php

/**
 * Class Brizy_Admin_Cloud_BlockUploader
 */
class Brizy_Admin_Cloud_BlockBridge extends Brizy_Admin_Cloud_AbstractBridge
{

    use Brizy_Editor_Asset_AttachmentAware;

    /**
     * @param Brizy_Editor_Block $block
     *
     * @return mixed|void
     * @throws Exception
     */
    public function export($block)
    {

        $media = json_decode($block->getMedia());

        if (!$media || !isset($media->fonts)) {
            throw new Exception('No fonts property in media object');
        }

        if (!$media || !isset($media->images)) {
            throw new Exception('No images property in media object');
        }

        $bridge = new Brizy_Admin_Cloud_MediaBridge($this->client);
        foreach ($media->images as $uid) {
            try {
                $bridge->export($uid);
            } catch (Exception $e)
            {
                Brizy_Logger::instance()->critical('Failed to export block media: ' . $e->getMessage(), [$e]);
            }
        }

        $bridge = new Brizy_Admin_Cloud_MediaUploadsBridge($this->client);
        foreach ($media->uploads as $uid) {
            try {
                $bridge->export($uid);
            } catch (Exception $e) {
                Brizy_Logger::instance()->critical('Failed to export block uploads: ' . $e->getMessage(), [$e]);
            }
        }

        $bridge = new Brizy_Admin_Cloud_FontBridge($this->client);
        foreach ($media->fonts as $fontUid) {
            try {
                $bridge->export($fontUid);
            } catch (Exception $e) {
                Brizy_Logger::instance()->critical('Failed to export block font: ' . $e->getMessage(), [$e]);
            }
        }

        $bridge = new Brizy_Admin_Cloud_ScreenshotBridge($this->client);
        $bridge->export($block);

        $cloudBlockObject = $this->client->createOrUpdateBlock($block);

        if ($cloudBlockObject) {
            $block->setSynchronized($this->getCurrentCloudAccountId(), $cloudBlockObject->uid);
        }

        $block->saveStorage();
    }

    /**
     * @param $blockId
     *
     * @return mixed|void
     * @throws Exception
     */
    public function import($blockId)
    {
        global $wpdb;

        $blocks = $this->client->getBlocks(['uid' => $blockId]);

        if (!isset($blocks[0])) {
            Brizy_Logger::instance()->critical('Failed to import: Unable to obtain the block from cloud ' . $blockId);
            return;
        }

        $block = (array)$blocks[0];

        try {

            //  create local block
            $wpdb->query('START TRANSACTION ');
            $name = md5(time());
            $post = wp_insert_post(array(
                'post_title' => $name,
                'post_name' => $name,
                'post_status' => 'publish',
                'post_type' => Brizy_Admin_Blocks_Main::CP_SAVED
            ));

            if ($post) {
                $brizyPost = Brizy_Editor_Block::get($post, $block['uid']);
                if (isset($block['media'])) {
                    $brizyPost->setMedia($block['media']);
                }
                if (isset($block['meta'])) {
                    $brizyPost->setMeta($block['meta']);
                }
                $brizyPost->set_editor_data($block['data']);
                $brizyPost->set_uses_editor(true);
                $brizyPost->set_needs_compile(true);
                $brizyPost->setDataVersion(1);
                $brizyPost->setSynchronized($this->getCurrentCloudAccountId(), $block['id']);
                $brizyPost->save();

                // import fonts
                if (isset($block['media'])) {
                    $blockMedia = json_decode($block['media']);

                    $fontBridge = new Brizy_Admin_Cloud_FontBridge($this->client);
                    if (isset($blockMedia->fonts)) {
                        foreach ($blockMedia->fonts as $cloudFontUid) {
                            try {
                                $fontBridge->import($cloudFontUid);
                            } catch (Exception $e) {
                                Brizy_Logger::instance()->critical('Failed to import block media: ' . $e->getMessage(), [$e]);
                            }
                        }
                    }

                    $mediaBridge = new Brizy_Admin_Cloud_MediaBridge($this->client);
                    $mediaBridge->setBlockId($post);
                    if (isset($blockMedia->images)) {
                        foreach ($blockMedia->images as $mediaUid) {
                            try {
                                $mediaBridge->import($mediaUid);
                            } catch (Exception $e) {
                                Brizy_Logger::instance()->critical('Failed to import block media: ' . $e->getMessage(), [$e]);
                            }
                        }
                    }

                    $mediaUploadBridge = new Brizy_Admin_Cloud_MediaUploadsBridge($this->client);
                    $mediaUploadBridge->setBlockId($post);
                    if (isset($blockMedia->uploads)) {
                        foreach ($blockMedia->uploads as $mediaUpload) {
                            try {
                                $mediaUploadBridge->import($mediaUpload);
                            } catch (Exception $e) {
                                Brizy_Logger::instance()->critical('Failed to import block uploads: ' . $e->getMessage(), [$e]);
                            }
                        }
                    }
                }
            }

            $wpdb->query('COMMIT');
        } catch (Exception $e) {
            $wpdb->query('ROLLBACK');
            Brizy_Logger::instance()->critical('Failed to import block ' . $blockId, [$e]);
        }
    }

    /**
     * @param Brizy_Editor_Block $block
     *
     * @return mixed|void
     * @throws Exception
     */
    public function delete($block)
    {
        if ($block->getCloudId($this->getCurrentCloudAccountId())) {
            $this->client->deleteBlock($block->getCloudId($this->getCurrentCloudAccountId()));
        }
    }
}
