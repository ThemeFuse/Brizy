<?php

class Brizy_Content_ShortcodeToPlaceholderProcessor implements Brizy_Editor_Content_ProcessorInterface {
    /**
     * @param string $content
     * @param Brizy_Content_Context $context
     *
     * @return mixed|string
     */
    public function process( $content, Brizy_Content_Context $context ) {

		// Transform [brizy_shortcode_name attr="val"] to {{editor_shortcode_name attr='val'}}
        $regex = '@(\[)(brizy_)(.*?)(\])@';

        $content = preg_replace_callback( $regex, function ( $matches ) {
        	$shortcode = $matches[0];
        	$shortcode = str_replace( [ '[brizy', ']' ], [ '{{editor', '}}' ], $shortcode );
        	$shortcode = str_replace( '"', "'", $shortcode );

            return $shortcode;

        }, $content  );

        return $content;
    }
}