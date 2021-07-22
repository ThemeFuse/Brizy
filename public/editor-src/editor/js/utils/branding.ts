import Config from "visual/global/Config";

// replaces branded text for white labeling purposes
export const brizyToBranding = (s: string): string => {
  const config = Config.getAll();
  const branding = config.branding;

  if (!branding) {
    return s;
  }

  const brandingName = branding.name;

  return s.replace(new RegExp("brizy", "ig"), brandingName);
};
