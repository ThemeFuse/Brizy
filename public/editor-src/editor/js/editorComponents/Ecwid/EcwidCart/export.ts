import { Str } from "@brizy/readers";
import { EcwidStoreId } from "visual/global/Ecwid/types";
import { EcwidService } from "visual/libs/Ecwid";
import type { EcwidConfig } from "visual/libs/Ecwid/types/EcwidConfig";
import { ExportFunction } from "visual/types";
import { parseFromString } from "visual/utils/string";

export const fn: ExportFunction = ($node) => {
  $node.find(".brz-ecwid-cart").each((_, node) => {
    const storeId = node.getAttribute("data-store-id") as EcwidStoreId | null;
    const config = Str.read(node.getAttribute("data-storefront"));
    const cfg = config ? parseFromString<EcwidConfig>(config) : {};

    if (storeId) {
      EcwidService.init(storeId, cfg ?? {}).cart(node);
    }
  });
};
