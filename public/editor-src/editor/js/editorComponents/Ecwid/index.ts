import loadable from "@loadable/component";
import { LoadableLoading } from "visual/component/LoadableLoading";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";

export const ecwidLazyComponents = {
  EcwidCart: {
    id: ElementTypes.EcwidCart,
    component: loadable(() => import("./EcwidCart"), {
      fallback: LoadableLoading,
      resolveComponent: ({ EcwidCart }) => EcwidCart
    })
  },
  EcwidFavorites: {
    id: ElementTypes.EcwidFavorites,
    component: loadable(() => import("./EcwidFavorites"), {
      fallback: LoadableLoading,
      resolveComponent: ({ EcwidFavorites }) => EcwidFavorites
    })
  },
  EcwidMyAccount: {
    id: ElementTypes.EcwidMyAccount,
    component: loadable(() => import("./EcwidMyAccount"), {
      fallback: LoadableLoading,
      resolveComponent: ({ EcwidMyAccount }) => EcwidMyAccount
    })
  },
  EcwidProduct: {
    id: ElementTypes.EcwidProduct,
    component: loadable(() => import("./EcwidProduct"), {
      fallback: LoadableLoading,
      resolveComponent: ({ EcwidProduct }) => EcwidProduct
    })
  },
  EcwidProducts: {
    id: ElementTypes.EcwidProducts,
    component: loadable(() => import("./EcwidProducts"), {
      fallback: LoadableLoading,
      resolveComponent: ({ EcwidProducts }) => EcwidProducts
    })
  },
  EcwidShoppingBag: {
    id: ElementTypes.EcwidShoppingBag,
    component: loadable(() => import("./EcwidShoppingBag"), {
      fallback: LoadableLoading,
      resolveComponent: ({ EcwidShoppingBag }) => EcwidShoppingBag
    })
  },
  EcwidSearch: {
    id: ElementTypes.EcwidSearch,
    component: loadable(() => import("./EcwidSearch"), {
      fallback: LoadableLoading,
      resolveComponent: ({ EcwidSearch }) => EcwidSearch
    })
  },
  EcwidPrice: {
    id: ElementTypes.EcwidPrice,
    component: loadable(() => import("./EcwidPrice"), {
      fallback: LoadableLoading,
      resolveComponent: ({ EcwidPrice }) => EcwidPrice
    })
  },
  EcwidAddToCart: {
    id: ElementTypes.EcwidAddToCart,
    component: loadable(() => import("./EcwidAddToCart"), {
      fallback: LoadableLoading,
      resolveComponent: ({ EcwidAddToCart }) => EcwidAddToCart
    })
  }
};
