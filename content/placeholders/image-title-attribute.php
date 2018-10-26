<?php

class Brizy_Content_Placeholders_ImageTitleAttribute extends Brizy_Content_Placeholders_ImageAttribute {

	/**
	 * @param $attachmentId
	 *
	 * @return mixed|string
	 */
	protected function getAttributeValue( $attachmentId ) {
		$post = get_post( $attachmentId );

		return $post->post_title;
	}
}