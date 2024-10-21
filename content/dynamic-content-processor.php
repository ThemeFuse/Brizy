<?php

use BrizyPlaceholders\Extractor;
use BrizyPlaceholders\Replacer;

class Brizy_Content_DynamicContentProcessor implements Brizy_Editor_Content_ProcessorInterface
{

    /**
     * @param string $content
     * @param Brizy_Content_Context $context
     *
     * @return mixed
     */
    public function process($content, Brizy_Content_Context $context)
    {
        if(is_null($content)) return null;

        $placeholderProvider = new Brizy_Content_PlaceholderProvider($context);
        $extractor = new Extractor($placeholderProvider);

        $context->setProvider($placeholderProvider);

        list($contentPlaceholders, $placeholderInstances, $content) = $extractor->extract($content);

        $context->afterExtract($contentPlaceholders, $placeholderInstances, null);

        $replacer = new Replacer($placeholderProvider);

        $content = $replacer->replaceWithExtractedData($contentPlaceholders, $placeholderInstances, $content, $context);

        return $content;
    }
}
