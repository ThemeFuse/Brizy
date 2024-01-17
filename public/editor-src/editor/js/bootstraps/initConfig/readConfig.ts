import { Cloud } from "visual/global/Config/types/configs/Cloud";
import { parseGlobalBlocks, parsePageCommon } from "./common";
import { withDefaultConfig } from "./default";

export const readConfig = (config: Record<string, unknown>): Cloud => {
  const pageData = parsePageCommon(config.pageData);
  const globalBlocks = parseGlobalBlocks(config.globalBlocks);

  return withDefaultConfig({ ...config, pageData, globalBlocks } as Cloud);
};
