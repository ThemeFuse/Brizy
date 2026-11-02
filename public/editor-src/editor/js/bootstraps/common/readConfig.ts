import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import * as Obj from "visual/utils/reader/object";
import { externalTypesFromShop } from "./utils/globalBlockRules";
import { parseGlobalBlocks } from "./utils/parseGlobalBlocks";
import { parsePageCommon } from "./utils/parsePageCommon";

export function readConfig(c: unknown): ConfigCommon {
  try {
    const config = Obj.read(c);

    if (!config) {
      throw new Error("Fail to parse config");
    }

    // Parse data from string to object
    const pageData = parsePageCommon(config.pageData);
    // Shop collection types are needed to read back rules about ecwid items.
    const externalTypes = externalTypesFromShop(Obj.read(config.modules)?.shop);
    const globalBlocks = parseGlobalBlocks(config.globalBlocks, externalTypes);

    return { ...config, pageData, globalBlocks } as ConfigCommon;
  } catch (_) {
    throw new Error("Fail to parse config");
  }
}
