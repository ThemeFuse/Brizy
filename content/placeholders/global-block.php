<?php

use BrizyPlaceholders\ContentPlaceholder;
use BrizyPlaceholders\ContextInterface;

class Brizy_Content_Placeholders_GlobalBlock extends Brizy_Content_Placeholders_Abstract
{

    public function __construct(
        $label,
        $placeholder,
        $group = null,
        $display = Brizy_Content_Placeholders_Abstract::DISPLAY_INLINE,
        $attrs = []
    ) {
        $this->setLabel($label);
        $this->setPlaceholder($placeholder);
        $this->setDisplay($display);
        $this->setGroup($group);
        $this->setAttributes($attrs);
    }

    /**
     * @param ContextInterface $context
     * @param ContentPlaceholder $placeholder
     *
     * @return string
     * @throws Exception
     */
    public function getValue(ContextInterface $context, ContentPlaceholder $placeholder)
    {

        $uid = $placeholder->getAttribute('uid');

        if (!$uid) {
            return '';
        }

        $blockManager = new Brizy_Admin_Blocks_Manager(Brizy_Admin_Blocks_Main::CP_GLOBAL);
        $block = $blockManager->getEntity($uid);

        if (!$block) {
            return '';
        }

        $return_block_content = $this->returnBlockContent($block);
        $content = apply_filters(
            'brizy_content',
            $return_block_content,
            Brizy_Editor_Project::get(),
            $context->getWpPost()
        );

        return $content;
    }


    /**
     * @param $block
     *
     * @return string
     */
    private function returnBlockContent($block)
    {
        /**
         * @var
         */
        $html = base64_decode($block->get_encoded_compiled_html());
        $content = <<<HTML
\n<!-- GLOBAL BLOCK [{$block->getWpPostId()}]-->
{$html}
<!-- END GLOBAL BLOCK [{$block->getWpPostId()}]-->
\n
HTML;

        return $content;
    }
}