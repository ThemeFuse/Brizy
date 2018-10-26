<?php

class Brizy_Content_Placeholders_ImageAltAttribute extends Brizy_Content_Placeholders_ImageAttribute {

	/**
	 * @param $attachmentId
	 *
	 * @return string
	 */
	protected function getAttributeValue( $attachmentId ) {
		return get_post_meta( $attachmentId, '_wp_attachment_image_alt', true );
	}
}