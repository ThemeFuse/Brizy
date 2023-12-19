import { EcwidProductId, EcwidStoreId } from "visual/global/Ecwid";
import { EcwidService } from "visual/libs/Ecwid";
import { EcwidConfig } from "visual/libs/Ecwid/types/EcwidConfig";
import { ExportFunction } from "visual/types";
import { read as parseJson } from "visual/utils/reader/json";
import * as Num from "visual/utils/reader/number";

export const fn: ExportFunction = ($node) => {
  $node.find(".brz-ecwid-product").each((_, node) => {
    const storeId = node.getAttribute("data-store-id") as EcwidStoreId | null;
    const config = {
      ...(parseJson(
        decodeURIComponent(node.getAttribute("data-storefront") ?? "")
      ) as EcwidConfig | undefined)
    };
    const productId = Num.read(node.getAttribute("data-product-id")) as
      | EcwidProductId
      | undefined;
    const defaultProductId = Num.read(
      node.getAttribute("data-default-product-id")
    ) as EcwidProductId | undefined;

    const _productId = productId ?? defaultProductId;

    if (_productId && storeId) {
      EcwidService.init(storeId, config ?? {}).product(_productId, node);
    }
  });
};
