import type { EcwidStoreId } from "visual/global/Ecwid/types";
import { EcwidService } from "visual/libs/Ecwid";
import type { ExportFunction } from "visual/types";

export const fn: ExportFunction = (root) => {
  root
    .querySelectorAll<HTMLElement>(".brz-ecwid-shopping-bag")
    .forEach((node) => {
      const storeId = node.getAttribute("data-store-id") as EcwidStoreId | null;

      if (storeId) {
        EcwidService.init(storeId, {}).shoppingCart(node);
      }
    });
};
