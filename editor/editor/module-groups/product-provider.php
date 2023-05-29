<?php

class Brizy_Editor_Editor_ModuleGroups_ProductProvider implements Brizy_Editor_Editor_ModuleGroups_ProviderInterface {

	use Brizy_Editor_Editor_ModuleGroups_ContextUtils;

	public function supportContext( $context ) {
		return $this->isWoocomerceEnabled() && ( $this->isProduct( $context ) || $this->isTemplateType( $context, 'product' ) );
	}

	public function collect( $context ) {
		return [
			new Brizy_Editor_Editor_ModuleGroups_ModuleGroup( 'product', [
				"WOOProductTitle",
				"WOOExcerpt",
				"WOOProductContent",
				"WOOPrice",
				"WOOGallery",
				"WOOAddToCart",
				"WOOStock",
				"WOOSku",
				"WOOProductMeta",
				"WOORating",
				"WOOAttributes",
				"WOOUpsell",
				"WOOBreadcrumbs",
				"Review"
			], 200 ),
			new Brizy_Editor_Editor_ModuleGroups_ModuleGroup( 'woocomerce', [
				"WOOCategories",
				"WOOPages",
				"Products",
				"WOOCart"
			], 250 )
		];
	}
}