import { EcwidStoreId } from "visual/global/Ecwid/types";
import { EcwidService } from "visual/libs/Ecwid";
import { EcwidConfig } from "visual/libs/Ecwid/types/EcwidConfig";
import { ExportFunction } from "visual/types";
import { read as parseJson } from "visual/utils/reader/json";

export const fn: ExportFunction = ($node) => {
  $node.find(".brz-ecwid-products").each((_, node) => {
    const storeId = node.getAttribute("data-store-id") as EcwidStoreId | null;
    const config = parseJson(
      decodeURIComponent(node.getAttribute("data-storefront") ?? "")
    ) as EcwidConfig | undefined;
    if (storeId) {
      EcwidService.init(storeId, config ?? {}).products(node);
    }
  });
};
