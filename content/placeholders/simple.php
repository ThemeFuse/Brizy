<?php

use BrizyPlaceholders\ContentPlaceholder;
use BrizyPlaceholders\ContextInterface;

class Brizy_Content_Placeholders_Simple extends Brizy_Content_Placeholders_Abstract
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
        if(is_array($varyAttrs))
        {
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
        $method = $this->value;

        if (is_object($method) && ($method instanceof Closure)) {
	        $entity = $this->getEntity( $placeholder );

	        return call_user_func($method, $context, $placeholder, $entity );
        }

        return $this->value;
    }
}