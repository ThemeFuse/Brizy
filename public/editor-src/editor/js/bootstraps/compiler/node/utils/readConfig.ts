import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import * as Obj from "visual/utils/reader/object";
import { parseGlobalBlocks } from "../../common/utils/parseGlobalBlocks";
import { parsePageCommon } from "../../common/utils/parsePageCommon";

export function readConfig(c: unknown): ConfigCommon {
  try {
    const config = Obj.read(c);

    if (!config) {
      throw new Error("Fail to parse config");
    }

    // Parse data from string to object
    const pageData = parsePageCommon(config.pageData);
    const globalBlocks = parseGlobalBlocks(config.globalBlocks);

    return { ...config, pageData, globalBlocks } as ConfigCommon;
  } catch (e) {
    throw new Error("Fail to parse config");
  }
}
