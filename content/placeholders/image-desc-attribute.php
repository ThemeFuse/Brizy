<?php

class Brizy_Content_Placeholders_ImageDescAttribute extends Brizy_Content_Placeholders_ImageAttribute {

	/**
	 * @param $attachmentId
	 *
	 * @return string
	 */
	protected function getAttributeValue( $attachmentId ) {
		$image_id = get_post_thumbnail_id($attachmentId);
		$image_caption = get_post_field('post_excerpt', $image_id);
		return $image_caption;
	}
}