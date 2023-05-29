<?php

class Brizy_Editor_Editor_ModuleGroups_WordpressProvider implements Brizy_Editor_Editor_ModuleGroups_ProviderInterface {

	use Brizy_Editor_Editor_ModuleGroups_ContextUtils;

	public function supportContext( $context ) {
		return !$this->isStory( $context );
	}

	public function collect( $context ) {
		return [
			new Brizy_Editor_Editor_ModuleGroups_ModuleGroup( 'wordpress', [
				$this->hasSidebar( $context ) ? "WPSidebar" : null,
				"WPCustomShortcode"
			], $this->isTemplateType($context, 'single' ) ? 150 : 500 ),
		];
	}
}
