import { EcwidStoreId } from "visual/global/Ecwid";
import { EcwidService } from "visual/libs/Ecwid";
import { ExportFunction } from "visual/types";
import { makeAttr } from "visual/utils/i18n/attribute";

export const fn: ExportFunction = ($node) => {
  $node.find(".brz-ecwid-cart").each((_, node) => {
    const storeId = node.getAttribute(
      makeAttr("store-id")
    ) as EcwidStoreId | null;

    if (storeId) {
      EcwidService.init(storeId, {
        restoreUrl: true
      }).cart(node);
    }
  });
};
