<?php

class Brizy_Editor_Editor_ModuleGroups_ProductProvider implements Brizy_Editor_Editor_ModuleGroups_ProviderInterface {

	use Brizy_Editor_Editor_ModuleGroups_ContextUtils;

	public function supportContext( $context ) {
		return $this->isWoocomerceEnabled();
	}

	public function collect( $context ) {
		$brizy_Editor_Editor_ModuleGroups_ModuleGroup_Product = new Brizy_Editor_Editor_ModuleGroups_ModuleGroup( 'product', [
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
		], 200 );

		$brizy_Editor_Editor_ModuleGroups_ModuleGroup_Woocomerce = new Brizy_Editor_Editor_ModuleGroups_ModuleGroup( 'woocomerce', [
			"WOOCategories",
			"WOOPages",
			"Products",
			"WOOCart"
        ], $this->isTemplateType( $context, 'single' ) ? 500 : ( $this->isTemplateType( $context, 'archive' ) ? 550 : ( $this->isMode( $context, 'page' ) ? 550 : 250 ) ) );

        if ( $this->isTemplateType( $context, 'product' ) || $this->isMode( $context, 'product' ) ) {
			return [
				$brizy_Editor_Editor_ModuleGroups_ModuleGroup_Product,
				$brizy_Editor_Editor_ModuleGroups_ModuleGroup_Woocomerce
			];
		}

		return [ $brizy_Editor_Editor_ModuleGroups_ModuleGroup_Woocomerce ];
	}
}