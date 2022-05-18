import { ExportFunction } from "visual/types";
import { EcwidService } from "visual/libs/Ecwid";
import { EcwidProductId, EcwidStoreId } from "visual/global/Ecwid";

export const fn: ExportFunction = $node => {
  $node.find(".brz-ecwid-product").each((_, node) => {
    const storeId = node.getAttribute("data-store-id") as EcwidStoreId | null;
    const productId = node.getAttribute(
      "data-product-id"
    ) as EcwidProductId | null;

    if (productId && storeId) {
      EcwidService.init(storeId).product(productId, node);
    }
  });
};
