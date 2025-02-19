import { Str } from "@brizy/readers";
import { EcwidProductId, EcwidStoreId } from "visual/global/Ecwid/types";
import { EcwidService } from "visual/libs/Ecwid";
import { EcwidConfig } from "visual/libs/Ecwid/types/EcwidConfig";
import { ExportFunction } from "visual/types";
import * as Num from "visual/utils/reader/number";
import { parseFromString } from "visual/utils/string";

export const fn: ExportFunction = ($node) => {
  $node.find(".brz-ecwid-product").each((_, node) => {
    const storeId = node.getAttribute("data-store-id") as EcwidStoreId | null;
    const config = Str.read(node.getAttribute("data-storefront"));
    const cfg = config ? parseFromString<EcwidConfig>(config) : {};

    const productId = Num.read(node.getAttribute("data-product-id")) as
      | EcwidProductId
      | undefined;
    const defaultProductId = Num.read(
      node.getAttribute("data-default-product-id")
    ) as EcwidProductId | undefined;

    const _productId = productId ?? defaultProductId;

    if (_productId && storeId) {
      EcwidService.init(storeId, cfg ?? {}).product(_productId, node);
    }
  });
};
