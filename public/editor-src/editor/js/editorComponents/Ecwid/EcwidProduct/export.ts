import { EcwidProductId, EcwidStoreId } from "visual/global/Ecwid";
import { EcwidService } from "visual/libs/Ecwid";
import { EcwidConfig } from "visual/libs/Ecwid/types/EcwidConfig";
import { ExportFunction } from "visual/types";
import { makeAttr } from "visual/utils/i18n/attribute";
import { read as parseJson } from "visual/utils/reader/json";
import * as Num from "visual/utils/reader/number";

export const fn: ExportFunction = ($node) => {
  $node.find(".brz-ecwid-product").each((_, node) => {
    const storeId = node.getAttribute(
      makeAttr("store-id")
    ) as EcwidStoreId | null;
    const config = {
      ...(parseJson(
        decodeURIComponent(node.getAttribute(makeAttr("storefront")) ?? "")
      ) as EcwidConfig | undefined)
    };
    const productId = Num.read(node.getAttribute(makeAttr("product-id"))) as
      | EcwidProductId
      | undefined;
    const defaultProductId = Num.read(
      node.getAttribute(makeAttr("default-product-id"))
    ) as EcwidProductId | undefined;

    const _productId = productId ?? defaultProductId;

    if (_productId && storeId) {
      EcwidService.init(storeId, config ?? {}).product(_productId, node);
    }
  });
};
