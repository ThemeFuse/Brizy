import { ComponentExport } from "visual/types";

export const ecwidComponentsManifest: Record<string, ComponentExport> = {
  ecwidProducts: {
    selector: ".brz-ecwid-products",
    export: () =>
      import("./EcwidProducts/export").then((m) => ({ default: m.fn }))
  },

  ecwidCart: {
    selector: ".brz-ecwid-cart",
    export: () => import("./EcwidCart/export").then((m) => ({ default: m.fn }))
  },

  ecwidFavorites: {
    selector: ".brz-ecwid-favorites",
    export: () =>
      import("./EcwidFavorites/export").then((m) => ({ default: m.fn }))
  },

  ecwidMyAccount: {
    selector: ".brz-ecwid-my-account",
    export: () =>
      import("./EcwidMyAccount/export").then((m) => ({ default: m.fn }))
  },

  ecwidProduct: {
    selector: ".brz-ecwid-product",
    export: () =>
      import("./EcwidProduct/export").then((m) => ({ default: m.fn }))
  },

  ecwidShoppingBag: {
    selector: ".brz-ecwid-shopping-bag",
    export: () =>
      import("./EcwidShoppingBag/export").then((m) => ({ default: m.fn }))
  },

  ecwidSearch: {
    selector: ".brz-ecwid-search",
    export: () =>
      import("./EcwidSearch/export").then((m) => ({ default: m.fn }))
  },

  ecwidAddToCart: {
    selector: ".brz-ecwid-add-to-cart",
    export: () =>
      import("./EcwidAddToCart/export").then((m) => ({ default: m.fn }))
  }
};
