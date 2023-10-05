<?php

trait Brizy_Editor_Editor_ModuleGroups_ContextUtils {
	protected function hasSidebar( $context ) {
		return isset( $context['wp']['hasSidebars'] ) && $context['wp']['hasSidebars'];
	}

	protected function isStory( $context ) {
		return $this->isMode($context,'internal_story');
	}

	protected function isProduct( $context ) {
		return $this->isMode($context,'product');
	}

	protected function isPopup( $context ) {
		return $this->isMode($context,'internal_popup');
	}

	protected function isTemplate( $context ) {
		return $this->isMode($context,'template');
	}

	protected function isMode( $context, $mode ) {
		return isset( $context['mode'] ) && $context['mode'] === $mode;
	}

	protected function isPostType( $context, $type ) {
		return isset( $context['wp']['postType'] ) && $context['wp']['postType'] === $type;
	}

	protected function isWoocomerceEnabled() {
		return class_exists( WooCommerce::class );
	}

	protected function isTemplateType( $context, $type ) {
		return isset( $context['template_type'] ) && $context['template_type'] === $type;
	}
}