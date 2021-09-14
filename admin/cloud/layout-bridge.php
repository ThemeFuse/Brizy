<?php

/**
 * Class Brizy_Admin_Cloud_BlockUploader
 */
class Brizy_Admin_Cloud_LayoutBridge extends Brizy_Admin_Cloud_AbstractBridge
{


    /**
     * @param Brizy_Editor_Block $layout
     *
     * @return mixed|void
     * @throws Exception
     */
    public function export($layout)
    {

        $media = json_decode($layout->getMedia());

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
            } catch (Exception $e) {
                Brizy_Logger::instance()->critical('Failed to export layout media: ' . $e->getMessage(), [$e]);
                continue;
            }
        }

        $bridge = new Brizy_Admin_Cloud_MediaUploadsBridge($this->client);
        foreach ($media->uploads as $uid) {
            try {
                $bridge->export($uid);
            } catch (Exception $e) {
                Brizy_Logger::instance()->critical('Failed to export layout uploads: ' . $e->getMessage(), [$e]);
            }
        }


        $bridge = new Brizy_Admin_Cloud_FontBridge($this->client);
        foreach ($media->fonts as $fontUid) {
            try {
                $bridge->export($fontUid);
            } catch (Exception $e) {
                Brizy_Logger::instance()->critical('Failed to export layout font: ' . $e->getMessage(), [$e]);
                continue;
            }
        }

        $bridge = new Brizy_Admin_Cloud_ScreenshotBridge($this->client);
        $bridge->export($layout);

        $layoutObject = $this->client->createOrUpdateLayout($layout);

        if ($layoutObject) {
            $layout->setSynchronized($this->getCurrentCloudAccountId(), $layoutObject->uid);
        }
        $layout->saveStorage();
    }

    /**
     * @param $layoutId
     *
     * @return mixed|void
     * @throws Exception
     */
    public function import($layoutId)
    {
        global $wpdb;

        $layouts = $this->client->getLayouts(['uid' => $layoutId]);

        if (!isset($layouts[0])) {
            Brizy_Logger::instance()->critical('Failed to import: Unable to obtain the layout from cloud ' . $layoutId);
            return;
        }

        try {
            $wpdb->query('START TRANSACTION ');

            $layout = (array)$layouts[0];

            $name = md5(time());
            $post = wp_insert_post(array(
                'post_title' => $name,
                'post_name' => $name,
                'post_status' => 'publish',
                'post_type' => Brizy_Admin_Layouts_Main::CP_LAYOUT
            ));

            if ($post) {
                $brizyPost = Brizy_Editor_Layout::get($post, $layout['uid']);

                if (isset($layout['media'])) {
                    $brizyPost->setMedia($layout['media']);
                }
                if (isset($layout['meta'])) {
                    $brizyPost->setMeta($layout['meta']);
                }
                $brizyPost->set_editor_data($layout['data']);
                $brizyPost->set_uses_editor(true);
                $brizyPost->set_needs_compile(true);
                $brizyPost->saveStorage();
                $brizyPost->setDataVersion(1);
                $brizyPost->setSynchronized($this->getCurrentCloudAccountId(), $layout['uid']);
                $brizyPost->save();


                // import fonts
                if (isset($layout['media'])) {
                    $blockMedia = json_decode($layout['media']);

                    $fontBridge = new Brizy_Admin_Cloud_FontBridge($this->client);
                    if (isset($blockMedia->fonts)) {
                        foreach ($blockMedia->fonts as $cloudFontUid) {
                            try {
                                $fontBridge->import($cloudFontUid);
                            } catch (Exception $e) {

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

                            }
                        }
                    }

                    $mediaUploadBridge = new Brizy_Admin_Cloud_MediaUploadsBridge($this->client);
                    $mediaUploadBridge->setBlockId($post);
                    if (isset($blockMedia->uploads)) {
                        foreach ($blockMedia->uploads as $mediaUid) {
                            try {
                                $mediaUploadBridge->import($mediaUid);
                            } catch (Exception $e) {
                                Brizy_Logger::instance()->critical('Failed to import layout uploads: ' . $e->getMessage(), [$e]);
                            }
                        }
                    }
                }
            }
            $wpdb->query('COMMIT');
        } catch (Exception $e) {
            $wpdb->query('ROLLBACK');
            Brizy_Logger::instance()->critical('Failed to import layout ' . $layoutId, [$e]);
        }
    }

    /**
     * @param Brizy_Editor_Block $layout
     *
     * @return mixed|void
     * @throws Exception
     */
    public function delete($layout)
    {

        if ($layout->getCloudId($this->getCurrentCloudAccountId())) {
            $this->client->deleteLayout($layout->getCloudId($this->getCurrentCloudAccountId()));
        }
    }
}
