import { ExportFunction } from "visual/types";
import { EcwidService } from "visual/libs/Ecwid";
import { EcwidStoreId } from "visual/global/Ecwid";

export const fn: ExportFunction = $node => {
  $node.find(".brz-ecwid-my-account").each((_, node) => {
    const storeId = node.getAttribute("data-store-id") as EcwidStoreId | null;
    if (storeId) {
      EcwidService.init(storeId).myAccount(node);
    }
  });
};
