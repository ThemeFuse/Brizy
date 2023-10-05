<?php

use BrizyPlaceholders\ContentPlaceholder;
use BrizyPlaceholders\ContextInterface;
use BrizyPlaceholders\Extractor;


class Brizy_Content_Placeholders_EditorPlaceholderWrapper extends Brizy_Content_Placeholders_Abstract
{
    /**
     * @return string|callable
     */
    protected $value;

    /**
     * Brizy_Content_Placeholders_Simple constructor.
     *
     * @param $label
     * @param $placeholder
     * @param $value
     * @param string $display
     */
    public function __construct($label, $placeholder, $value, $group = null, $display = Brizy_Content_Placeholders_Abstract::DISPLAY_INLINE, $attrs = [], $varyAttrs = null)
    {
        $this->setLabel($label);
        $this->setPlaceholder($placeholder);
        $this->setDisplay($display);
        $this->setGroup($group);
        $this->setAttributes($attrs);
        if (is_array($varyAttrs)) {
            $this->setVaryAttributes($varyAttrs);
        }
        $this->value = $value;
    }

    /**
     * @param ContextInterface $context
     * @param ContentPlaceholder $placeholder
     *
     * @return mixed
     */
    public function getValue(ContextInterface $context, ContentPlaceholder $placeholder)
    {
        $content = base64_decode($placeholder->getAttribute('content'));
        $attributes = $placeholder->getAttributes();

        unset($attributes['content']);

        $placeholderProvider = new Brizy_Content_PlaceholderProvider($context);
        $extractor = new Extractor($placeholderProvider);
        $context->setProvider($placeholderProvider);

        list($contentPlaceholders,  $content) = $extractor->extractIgnoringRegistry($content);

        if (isset($contentPlaceholders[0])) {
            $contentPlaceholders[0]->setAttributes(array_merge($contentPlaceholders[0]->getAttributes(), $attributes));
            $contentPlaceholders[0]->setContent($placeholder->getContent());
            $build_placeholder = $contentPlaceholders[0]->buildPlaceholder();
            return $build_placeholder;
        }

        return "";
    }
}
