import { Str } from "@brizy/readers";
import { EcwidStoreId } from "visual/global/Ecwid/types";
import { EcwidService } from "visual/libs/Ecwid";
import type { EcwidConfig } from "visual/libs/Ecwid/types/EcwidConfig";
import { ExportFunction } from "visual/types";
import { getEcwidShopPathFromAttribute } from "visual/utils/ecwid";
import { parseFromString } from "visual/utils/string";
import { EcwidCartCheckoutStep } from "./types/Value";
import { addListenerToContinueShopping } from "./utils";

export const fn: ExportFunction = ($node) => {
  $node.find(".brz-ecwid-cart").each((_, node) => {
    const storeId = node.getAttribute("data-store-id") as EcwidStoreId | null;
    const config = Str.read(node.getAttribute("data-storefront"));
    const cfg = config ? parseFromString<EcwidConfig>(config) : {};
    const baseUrl = getEcwidShopPathFromAttribute(node) ?? "";

    if (storeId) {
      const ecwid = EcwidService.init(storeId, {
        ...cfg,
        baseUrl,
        onPageLoaded: addListenerToContinueShopping(node)
      });

      ecwid.cart(node, EcwidCartCheckoutStep.Cart, {
        onPageLoad: () => ecwid.setAddress({ address: {} })
      });
    }
  });
};
