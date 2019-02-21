<?php


trait Brizy_Content_Placeholders_ImageAttributesAware {

	/**
	 * It should return a string containigng image attributes
	 * Ex: alt="image alt attribute" title="Image title"
	 *
	 * @param Brizy_Content_Context $context
	 * @param Brizy_Content_ContentPlaceholder $contentPlaceholder
	 *
	 * @return
	 */
	abstract public function getAttachmentId( Brizy_Content_Context $context, Brizy_Content_ContentPlaceholder $contentPlaceholder );
}