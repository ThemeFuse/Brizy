<?php

class Brizy_Editor_Editor_ModuleGroups_ArchiveProvider implements Brizy_Editor_Editor_ModuleGroups_ProviderInterface {

	use Brizy_Editor_Editor_ModuleGroups_ContextUtils;

	public function supportContext( $context ) {
		return $this->isTemplateType( $context, 'archive' );
	}

	public function collect( $context ) {
		return [
			new Brizy_Editor_Editor_ModuleGroups_ModuleGroup( 'archive', [
				"Archive",
				"PostTitle",
				"PostExcerpt",
				"Posts"
			], 150 )
		];
	}
}