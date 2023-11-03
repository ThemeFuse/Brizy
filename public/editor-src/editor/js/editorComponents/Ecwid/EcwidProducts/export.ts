import { EcwidStoreId } from "visual/global/Ecwid";
import { EcwidService } from "visual/libs/Ecwid";
import { EcwidConfig } from "visual/libs/Ecwid/types/EcwidConfig";
import { ExportFunction } from "visual/types";
import { makeAttr } from "visual/utils/i18n/attribute";
import { read as parseJson } from "visual/utils/reader/json";

export const fn: ExportFunction = ($node) => {
  $node.find(".brz-ecwid-products").each((_, node) => {
    const storeId = node.getAttribute(
      makeAttr("store-id")
    ) as EcwidStoreId | null;
    const config = parseJson(
      decodeURIComponent(node.getAttribute(makeAttr("storefront")) ?? "")
    ) as EcwidConfig | undefined;
    if (storeId) {
      EcwidService.init(storeId, config ?? {}).products(node);
    }
  });
};
