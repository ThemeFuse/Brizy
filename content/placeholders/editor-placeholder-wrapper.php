<?php

use BrizyPlaceholders\ContentPlaceholder;
use BrizyPlaceholders\ContextInterface;
use BrizyPlaceholders\Extractor;
use BrizyPlaceholders\Replacer;


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

        list($contentPlaceholders, $placeholderInstances, $content) = $extractor->extract($content);
        /**
         * @var ContentPlaceholder $placeholder ;
         */
        foreach ($contentPlaceholders as $placeholder) {
            $placeholder->setAttributes(array_merge($placeholder->getAttributes(), $attributes));
        }

        $replacer = new Replacer($placeholderProvider);

        $content = $replacer->replaceWithExtractedData($contentPlaceholders, $placeholderInstances, $content, $context);

        return $content;
    }
}
