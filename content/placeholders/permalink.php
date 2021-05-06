<?php

use BrizyPlaceholders\ContentPlaceholder;

class Brizy_Content_Placeholders_Permalink extends Brizy_Content_Placeholders_Simple {


	/**
	 * Brizy_Content_Placeholders_Simple constructor.
	 *
	 * @param $label
	 * @param $placeholder
	 * @param $value
	 * @param string $display
	 */
	public function __construct() {
		parent::__construct( 'Permalink', 'brizy_dc_permalink', null );
	}

	/**
	 * @param ContentPlaceholder $contentPlaceholder
	 * @param Brizy_Content_Context $context
	 *
	 * @return mixed|string
	 */
    public function getValue(\BrizyPlaceholders\ContextInterface $context, ContentPlaceholder $contentPlaceholder) {
		$attributes = $contentPlaceholder->getAttributes();
		if ( isset( $attributes['post_id'] ) && (int) $attributes['post_id'] > 0 ) {
			return get_permalink( (int) $attributes['post_id'] );
		}

		return '';
	}
}