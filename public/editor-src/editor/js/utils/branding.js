import Config from "visual/global/Config";

// replaces branded text for white labeling purposes
export const branding = s => {
  const branding = Config.get("branding");

  if (!branding) {
    return s;
  }

  return Object.entries(branding).reduce(
    (acc, [search, replace]) => acc.replace(new RegExp(search, "ig"), replace),
    s
  );
};
