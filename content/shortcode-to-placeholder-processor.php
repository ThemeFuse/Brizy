<?php

class Brizy_Content_ShortcodeToPlaceholderProcessor implements Brizy_Editor_Content_ProcessorInterface {
    /**
     * @param string $content
     * @param Brizy_Content_Context $context
     *
     * @return mixed|string
     */
    public function process( $content, Brizy_Content_Context $context ) {

        $regex = '@((\[)|(\{\{))(brizy_)(.*?)((\])|(\}\}))@';
        $content = preg_replace_callback( $regex, function ( $matches ) {
            // use replacer [brizy, {{brizy because there can be some attributes with the word brizy in the value
            return str_replace( [ '[brizy', '{{brizy', ']', 'editor_dc' ], [ '{{editor', '{{editor', '}}', 'editor' ], $matches[0] );
        }, $content  );

        return $content;
    }
}