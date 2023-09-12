<?php

use BrizyPlaceholders\ContentPlaceholder;
use BrizyPlaceholders\ContextInterface;
use BrizyPlaceholders\PlaceholderInterface;

abstract class Brizy_Content_Placeholders_Abstract extends \BrizyPlaceholders\AbstractPlaceholder implements PlaceholderInterface
{

    const DISPLAY_INLINE = 'inline';
    const DISPLAY_BLOCK = 'block';

    /**
     * @return string
     */
    protected $label;

    /**
     * @return string
     */
    protected $placeholder;

    /**
     * @var array
     */
    protected $attributes = [];

    protected $varyAttributes = ['entityType', 'entityId'];

    /**
     * @var string
     */
    protected $display = self::DISPLAY_INLINE;

    protected $group = '';

    /**
     * It should return a unique identifier of the placeholder used for replacer.
     * Do not use this where you need a constant value.
     *
     * @return mixed
     */
    public function getUid()
    {
        return md5(microtime());
    }

    public function getUniqueId()
    {
        return md5(get_class($this));
    }

    public function getConfigStructure()
    {
        return [
            'id' => $this->getUniqueId(),
            'label' => $this->getLabel(),
            'placeholder' => $this->buildPlaceholder(),
            'display' => $this->getDisplay(),
            'attr' => (object)$this->getAttributes(),
            'varyAttr' => $this->getVaryAttributes()
        ];
    }

    public function support($placeholderName)
    {
        return $this->getPlaceholder() == $placeholderName;
    }

    public function shouldFallbackValue($value, ContextInterface $context, ContentPlaceholder $placeholder)
    {
        return empty($value);
    }

    public function getFallbackValue(ContextInterface $context, ContentPlaceholder $placeholder)
    {
        $attributes = $placeholder->getAttributes();

        return isset($attributes[PlaceholderInterface::FALLBACK_KEY]) ? $attributes[PlaceholderInterface::FALLBACK_KEY] : '';
    }

    /**
     * @return mixed
     */
    public function getLabel()
    {
        return $this->label;
    }

    /**
     * @param mixed $label
     *
     * @return Brizy_Content_Placeholders_Abstract
     */
    public function setLabel($label)
    {
        $this->label = $label;

        return $this;
    }

    /**
     * @return string
     */
    public function getDisplay()
    {
        return $this->display;
    }

    /**
     * @param string $display
     *
     * @return Brizy_Content_Placeholders_Abstract
     */
    public function setDisplay($display)
    {
        $this->display = $display;

        return $this;
    }

    /**
     * @return string
     */
    public function getGroup()
    {
        return $this->group;
    }

    /**
     * @param string $group
     *
     * @return Brizy_Content_Placeholders_Abstract
     */
    public function setGroup($group)
    {
        $this->group = $group;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getPlaceholder()
    {
        return $this->placeholder;
    }

    /**
     * @param mixed $placeholder
     *
     * @return Brizy_Content_Placeholders_Abstract
     */
    public function setPlaceholder($placeholder)
    {
        $this->placeholder = $placeholder;

        return $this;
    }

    public function getAttributes()
    {
        return $this->attributes;
    }

    public function setAttributes($attributes)
    {
        return $this->attributes = (array)$attributes;
    }

    public function getVaryAttributes()
    {
        return $this->varyAttributes;
    }

    public function setVaryAttributes($attributes)
    {
        return $this->varyAttributes = (array)$attributes;
    }

    public function getEntity(ContentPlaceholder $placeholder)
    {
        if (($entityType = $placeholder->getAttribute('entityType')) && ($entityId = $placeholder->getAttribute('entityId'))) {

            if ($this->is_post_type($entityType)) {
                return get_post((int)$entityId);
            }

            if ($entityType == "WP_User") {
                return get_user_by('ID', $entityId);
            }

            if ($entityType == "WP_Term") {
                return get_term((int)$entityId);
            }
        }

        return null;
    }

    /**
     * @return array
     */
    public function convertToOptionValue()
    {
        return array(
            'label' => $this->getLabel(),
            'placeholder' => $this->getPlaceholder(),
            'display' => $this->getDisplay(),
        );
    }

    public function jsonSerialize()
    {
        return array(
            'label' => $this->getLabel(),
            'placeholder' => $this->getReplacePlaceholder(),
            'display' => $this->getDisplay(),
        );
    }

    /**
     * @return string
     */
    public function getReplacePlaceholder($attributes = [])
    {
        return $this->buildPlaceholder($attributes);
    }

    private function is_post_type($post = null)
    {
        $all_custom_post_types = get_post_types();

        // there are no custom post types
        if (empty ($all_custom_post_types)) {
            return false;
        }

        $custom_types = array_keys($all_custom_post_types);

        return in_array($post, $custom_types);
    }
}
