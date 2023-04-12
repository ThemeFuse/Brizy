<?php

class Brizy_Editor_Editor_ModuleGroups_ArchiveProvider implements Brizy_Editor_Editor_ModuleGroups_ProviderInterface {

	use Brizy_Editor_Editor_ModuleGroups_ContextUtils;

	public function supportContext( $context ) {
		return  $this->isTemplateType( $context, 'product_archive' ) || $this->isTemplateType( $context, 'archive' );
	}

	public function collect( $context ) {
		return [
			new Brizy_Editor_Editor_ModuleGroups_ModuleGroup( 'archives', [
				$this->isTemplateType( $context, 'product_archive' ) ? "WOOArchives": "Archive" ,
				"PostTitle",
				"PostExcerpt",
				"Posts"
			] )
		];
	}
}