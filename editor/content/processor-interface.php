<?php

interface Brizy_Editor_Content_ProcessorInterface {
	/**
	 * @param string $content
	 * @param Brizy_Content_Context $context
	 *
	 * @return mixed
	 */
	public function process( $content, Brizy_Content_Context $context );
}