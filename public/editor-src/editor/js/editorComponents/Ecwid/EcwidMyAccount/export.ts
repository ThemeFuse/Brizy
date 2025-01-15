import { Str } from "@brizy/readers";
import type { EcwidStoreId } from "visual/global/Ecwid";
import { EcwidService } from "visual/libs/Ecwid";
import type { EcwidConfig } from "visual/libs/Ecwid/types/EcwidConfig";
import type { ExportFunction } from "visual/types";
import { parseFromString } from "visual/utils/string";

export const fn: ExportFunction = ($node) => {
  $node.find(".brz-ecwid-my-account").each((_, node) => {
    const storeId = node.getAttribute("data-store-id") as EcwidStoreId | null;
    const config = Str.read(node.getAttribute("data-storefront"));
    const cfg = config ? parseFromString<EcwidConfig>(config) : {};

    if (storeId) {
      EcwidService.init(storeId, cfg ?? {}).myAccount(node);
    }
  });
};
