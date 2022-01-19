<?php

use BrizyPlaceholders\ContentPlaceholder;
use BrizyPlaceholders\ContextInterface;

class Brizy_Content_Placeholders_SimplePostAware extends Brizy_Content_Placeholders_Simple
{

    /**
     * @param ContextInterface $context
     * @param ContentPlaceholder $contentPlaceholder
     *
     * @return false|mixed|string
     */
    public function getValue(ContextInterface $context, ContentPlaceholder $contentPlaceholder)
    {
        $postId = $contentPlaceholder->getAttribute('post_id');

        if ($postId) {
            $newContext = Brizy_Content_ContextFactory::createContext(
                $context->getProject(),
                null,
                get_post($postId),
                null,
                false
            );

            return parent::getValue($newContext, $contentPlaceholder);
        }

        if ( ! $context->getWpPost()) {
            return;
        }

        return parent::getValue($context, $contentPlaceholder);
    }

    /**
     * @return mixed|string
     */
    protected function getOptionValue()
    {
        return $this->getReplacePlaceholder();
    }
}