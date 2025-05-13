import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";

export const getWhiteLabel = (config: ConfigCommon): boolean => {
  const pro = config.pro;
  return pro?.whiteLabel ?? false;
};
