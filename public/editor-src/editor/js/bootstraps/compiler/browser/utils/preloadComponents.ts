import {
  ecwidLazyComponents,
  ministryBrandsLazyComponents,
  shopifyLazyComponents
} from "visual/editorComponents";
import { isCloud, isShopify } from "visual/global/Config/types/configs/Cloud";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";

export function preloadComponents(config: ConfigCommon) {
  // Preload lazy-loaded elements (MinistryBrands, Ecwid, Shopify)
  if (isCloud(config)) {
    const lazyComp = [
      ...Object.values(ministryBrandsLazyComponents).map((e) => e.component),
      ...Object.values(ecwidLazyComponents).map((e) => e.component)
    ];

    for (const component of lazyComp) {
      try {
        component.preload();
      } catch (error) {
        console.warn("Failed to preload component:", error);
      }
    }

    if (isShopify(config)) {
      const components = Object.values(shopifyLazyComponents).map(
        (e) => e.component
      );

      for (const component of components) {
        try {
          component.preload();
        } catch (error) {
          console.warn("Failed to preload Shopify component:", error);
        }
      }
    }
  }
}
