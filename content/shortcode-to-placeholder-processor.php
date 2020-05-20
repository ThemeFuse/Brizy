<?php

class Brizy_Content_ShortcodeToPlaceholder implements Brizy_Editor_Content_ProcessorInterface {
    /**
     * @param string $content
     * @param Brizy_Content_Context $context
     *
     * @return mixed|string
     */
    public function process( $content, Brizy_Content_Context $context ) {

        $placeholders = [
            'brizy_navigation',
            'brizy_post_field',
            'brizy_post_info',
            'brizy_posts',
            'brizy_sidebars',
            'brizy_product_page',
            'brizy_dc_permalink',
            'brizy_dc_current_page_unique_url',
            'brizy_dc_image_title',
            'brizy_dc_image_alt',
            'brizy_dc_current_page_unique_url',
            'brizy_dc_page_language',
            'brizy_dc_ajax_url',
            'brizy_breadcrumbs',
            'brizy_comments',
            'brizy_post_navigation',
        ];

        $regex = '@((\[)|(\{\{))(' . implode( '|', $placeholders ) . ')(.*?)((\])|(\}\}))@';
        $content = preg_replace_callback( $regex, function ( $matches ) {
            // use replacer [brizy, {{brizy because there can be some attributes with the word brizy in the value
            return str_replace( [ '[brizy', '{{brizy', ']', 'editor_dc' ], [ '{{editor', '{{editor', '}}', 'editor' ], $matches[0] );
        }, $content  );

        return $content;
    }
}