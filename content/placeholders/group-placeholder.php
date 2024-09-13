<?php

use BrizyPlaceholders\ContentPlaceholder;
use BrizyPlaceholders\ContextInterface;

class Brizy_Content_Placeholders_GroupPlaceholder extends Brizy_Content_Placeholders_Abstract
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
    public function __construct()
    {
        $this->setLabel('Placeholder Group');
        $this->setPlaceholder('group');
        $this->setDisplay(Brizy_Content_Placeholders_Abstract::DISPLAY_INLINE);
    }

    /**
     * @param ContextInterface $context
     * @param ContentPlaceholder $placeholder
     *
     * @return mixed
     */
    public function getValue(ContextInterface $context, ContentPlaceholder $placeholder)
    {
        $replacer = new \BrizyPlaceholders\Replacer($context->getProvider());
        $content = $placeholder->getContent();
        $newContext = Brizy_Content_ContextFactory::createContext(
            $context->getProject(),
            $context->getEntity(),
            false,
            $context,
            $placeholder
        );
        $newContext->setProvider($context->getProvider());

        return $replacer->replacePlaceholders($content, $newContext);
    }
}
