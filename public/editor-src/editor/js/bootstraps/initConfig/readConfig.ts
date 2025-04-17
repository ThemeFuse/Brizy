import { Cloud } from "visual/global/Config/types/configs/Cloud";
import { parseGlobalBlocks, parsePageCommon } from "./common";

export const readConfig = (config: Record<string, unknown>): Cloud => {
  const pageData = parsePageCommon(config.pageData);
  const globalBlocks = parseGlobalBlocks(config.globalBlocks);

  return {
    ...config,
    pageData,
    globalBlocks
  } as Cloud;
};
