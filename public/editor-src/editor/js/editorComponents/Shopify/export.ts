import { ComponentExport } from "visual/types";

export const shopifyComponentsManifest: Record<string, ComponentExport> = {
  shopifyAddToCart: {
    selector: ".brz-shopify-add-to-cart",
    export: () => import("./AddToCart/export")
  },

  shopifyQuantity: {
    selector: ".brz-shopify-quantity-container",
    export: () =>
      import("@brizy/widget/src/index.export").then((m) => ({
        default: m.Quantity
      }))
  },

  shopifyVariant: {
    selector: ".brz-shopify-variant-container",
    export: () =>
      import("@brizy/widget/src/index.export").then((m) => ({
        default: m.Variant
      }))
  }
};
