import Config from "visual/global/Config";
import { isWp } from "visual/global/Config/types/configs/WP";
import * as Str from "visual/utils/reader/string";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";

export const isPro = (config: ConfigCommon): boolean => !!config.pro;

//#region Page

export const getCurrentPageId = (): string => {
  const config = Config.getAll();

  if (isWp(config)) {
    return Str.read(config.wp.page) ?? "";
  }

  return Str.read(config.page?.id) ?? "";
};

//#endregion
