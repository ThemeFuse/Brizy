<?php

class Brizy_Editor_Editor_ModuleGroups_WooArchiveProvider implements Brizy_Editor_Editor_ModuleGroups_ProviderInterface {

	use Brizy_Editor_Editor_ModuleGroups_ContextUtils;

	public function supportContext( $context ) {
		return $this->isTemplateType( $context, 'product_archive' );
	}

	public function collect( $context ) {
		return [
			new Brizy_Editor_Editor_ModuleGroups_ModuleGroup( 'archive', [
				"WOOArchives",
				"PostTitle",
				"PostExcerpt",
				"Posts"
            ], $this->isTemplateType($context, 'product_archive' ) ? 100 : 550 ),
		];
	}
}