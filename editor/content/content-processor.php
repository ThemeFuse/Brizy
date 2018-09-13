<?php

class Brizy_Editor_Content_ContentProcessor implements Brizy_Editor_Content_ProcessorInterface {

	public function process( $content ) {

		if ( empty( $content ) ) {
			return '';
		}

		return $content . '<!-- ___brizy-content___ -->';
	}
}