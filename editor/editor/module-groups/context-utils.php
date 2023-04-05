<?php

trait Brizy_Editor_Editor_ModuleGroups_ContextUtils {
	protected function hasSidebar( $context ) {
		return isset( $context['hasSidebars'] ) && $context['hasSidebars'];
	}

	protected function isStory( $context ) {
		return isset( $context['mode'] ) && $context['mode'] === 'internal_story';
	}

	protected function isProduct( $context ) {
		return isset( $context['mode'] ) && $context['mode'] === 'product';
	}

	protected function isPopup( $context ) {
		return isset( $context['mode'] ) && $context['mode'] === 'internal_popup';
	}

	protected function isTemplate( $context ) {
		return isset( $context['mode'] ) && $context['mode'] === 'template';
	}

	protected function isPostType( $context, $type ) {
		return isset( $context['wp']['postType'] ) && $context['wp']['postType'] === $type;
	}

	protected function isWoocomerceEnabled(  ) {
		return class_exists( WooCommerce::class );
	}

	protected function isTemplateType( $context, $type ) {
		return isset( $context['template_type'] ) && $context['template_type'] === $type;
	}
}