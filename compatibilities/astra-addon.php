<?php
/*
 * https://wpastra.com/changelog/astra-pro-addon/
 * */

class Brizy_Compatibilities_AstraAddon
{

    public function __construct()
    {
        add_filter('brizy_asset_enqueue_post', [$this, 'brizy_asset_enqueue_post']);
    }

    public function brizy_asset_enqueue_post(Brizy_Editor_Post $editorPost)
    {
        global $template;
        if (is_singular('astra-advanced-hook') || !strpos($template, Brizy_Config::BRIZY_BLANK_TEMPLATE_FILE_NAME)) {
            return $editorPost;
        }
        $postId = $editorPost->getWpPost()->ID;
        if (!in_array(get_post_meta($postId, 'ast-advanced-hook-layout', true), ['header', 'footer'])) {
            return $editorPost;
        }

        return false;
    }

}
