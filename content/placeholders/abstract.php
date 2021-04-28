<?php

use \BrizyPlaceholders\ContentPlaceholder;
use BrizyPlaceholders\ContextInterface;
use \BrizyPlaceholders\PlaceholderInterface;

abstract class Brizy_Content_Placeholders_Abstract extends Brizy_Admin_Serializable implements PlaceholderInterface
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
	 * @var string
	 */
	protected $display = self::DISPLAY_INLINE;

	protected $group = '';

    /**
     * It should return an unique identifier of the placeholder
     *
     * @return mixed
     */
    public function getUid()
    {
        return md5(microtime());
    }

    public function support($placeholderName) {
        return $this->getPlaceholder()==$placeholderName;
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
	public function getLabel() {
		return $this->label;
	}

	/**
	 * @param mixed $label
	 *
	 * @return Brizy_Content_Placeholders_Abstract
	 */
	public function setLabel( $label ) {
		$this->label = $label;

		return $this;
	}

	/**
	 * @return string
	 */
	public function getDisplay() {
		return $this->display;
	}

	/**
	 * @param string $display
	 *
	 * @return Brizy_Content_Placeholders_Abstract
	 */
	public function setDisplay( $display ) {
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
	public function getPlaceholder() {
		return $this->placeholder;
	}

	/**
	 * @param mixed $placeholder
	 *
	 * @return Brizy_Content_Placeholders_Abstract
	 */
	public function setPlaceholder( $placeholder ) {
		$this->placeholder = $placeholder;

		return $this;
	}

	/**
	 * @return array
	 */
	public function convertToOptionValue() {
		return array(
			'label'       => $this->getLabel(),
			'placeholder' => $this->getPlaceholder(),
			'display'     => $this->getDisplay(),
		);
	}

	public function jsonSerialize() {
		return array(
			'label'       => $this->getLabel(),
			'placeholder' => $this->getReplacePlaceholder(),
			'display'     => $this->getDisplay(),
		);
	}

	/**
	 * @return string
	 */
	public function getReplacePlaceholder() {
		$placeholder = $this->getPlaceholder();

		if ( ! empty( $placeholder ) ) {
			return "{{" . $placeholder . "}}";
		}

		return "";
	}

}
