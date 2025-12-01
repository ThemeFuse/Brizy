import loadable from "@loadable/component";
import { LoadableLoading } from "visual/component/LoadableLoading";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";

export const shopifyLazyComponents = {
  AddToCart: {
    id: ElementTypes.AddToCart,
    component: loadable(() => import("./AddToCart"), {
      fallback: LoadableLoading,
      resolveComponent: ({ AddToCart }) => AddToCart
    })
  },
  Price: {
    id: ElementTypes.Price,
    component: loadable(() => import("@brizy/widget/src/Shopify/Price"), {
      fallback: LoadableLoading,
      resolveComponent: ({ Price }) => Price
    })
  },
  Vendor: {
    id: ElementTypes.Vendor,
    component: loadable(() => import("@brizy/widget/src/Shopify/Vendor"), {
      fallback: LoadableLoading,
      resolveComponent: ({ Vendor }) => Vendor
    })
  },
  Quantity: {
    id: ElementTypes.Quantity,
    component: loadable(() => import("@brizy/widget/src/Shopify/Quantity"), {
      fallback: LoadableLoading,
      resolveComponent: ({ Quantity }) => Quantity
    })
  },
  ProductMetafield: {
    id: ElementTypes.ProductMetafield,
    component: loadable(
      () => import("@brizy/widget/src/Shopify/ProductMetafield"),
      {
        fallback: LoadableLoading,
        resolveComponent: ({ ProductMetafield }) => ProductMetafield
      }
    )
  },
  BlogPostMeta: {
    id: ElementTypes.BlogPostMeta,
    component: loadable(
      () => import("@brizy/widget/src/Shopify/BlogPostMeta"),
      {
        fallback: LoadableLoading,
        resolveComponent: ({ BlogPostMeta }) => BlogPostMeta
      }
    )
  },
  Variant: {
    id: ElementTypes.Variant,
    component: loadable(() => import("@brizy/widget/src/Shopify/Variant"), {
      fallback: LoadableLoading,
      resolveComponent: ({ Variant }) => Variant
    })
  }
};
