<?php

use BrizyPlaceholders\ContentPlaceholder;
use BrizyPlaceholders\ContextInterface;

class Brizy_Content_Placeholders_IgnoreDc extends Brizy_Content_Placeholders_Abstract
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
    public function __construct($label, $group = null, $display = Brizy_Content_Placeholders_Abstract::DISPLAY_INLINE)
    {
        $this->setLabel($label);
        $this->setPlaceholder('brizy_dc_ignore_dc');
        $this->setDisplay($display);
        $this->setGroup($group);
    }

    /**
     * @param ContextInterface $context
     * @param ContentPlaceholder $placeholder
     *
     * @return mixed
     */
    public function getValue(ContextInterface $context, ContentPlaceholder $placeholder)
    {
       return $placeholder->getContent();
    }
}