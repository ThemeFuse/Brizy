import { Config as ConfigType } from "visual/global/Config/types";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { isWp } from "visual/global/Config/types/configs/WP";
import * as Str from "visual/utils/reader/string";

export const isPro = (config: ConfigCommon): boolean => !!config.pro;

//#region Page

export const getCurrentPageId = (config: ConfigCommon): string => {
  const _config = config as ConfigType;

  if (isWp(_config)) {
    return Str.read(_config.wp.page) ?? "";
  }

  const { id } = _config.page;

  return Str.read(id) ?? "";
};

//#endregion
