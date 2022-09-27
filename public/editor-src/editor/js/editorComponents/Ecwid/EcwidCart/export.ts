import { EcwidStoreId } from "visual/global/Ecwid";
import { EcwidService } from "visual/libs/Ecwid";
import { ExportFunction } from "visual/types";

export const fn: ExportFunction = ($node) => {
  $node.find(".brz-ecwid-cart").each((_, node) => {
    const storeId = node.getAttribute("data-store-id") as EcwidStoreId | null;

    if (storeId) {
      EcwidService.init(storeId, {}).cart(node);
    }
  });
};
