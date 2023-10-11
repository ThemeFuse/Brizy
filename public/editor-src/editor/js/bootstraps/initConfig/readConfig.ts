import { Cloud } from "visual/global/Config/types/configs/Cloud";
import { parsePageCommon } from "./common";
import { withDefaultConfig } from "./default";

export const readConfig = (config: Record<string, unknown>): Cloud => {
  const pageData = parsePageCommon(config.pageData);

  return withDefaultConfig({ ...config, pageData } as Cloud);
};
