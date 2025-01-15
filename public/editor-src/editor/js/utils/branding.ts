import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";

// replaces branded text for white labeling purposes
export const brizyToBranding = (s: string, config: ConfigCommon): string => {
  const branding = config.branding;

  if (!branding) {
    return s;
  }

  const brandingName = branding.name;

  return s.replace(new RegExp("brizy", "ig"), brandingName);
};
