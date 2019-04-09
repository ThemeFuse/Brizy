import Config from "visual/global/Config";

// replaces branded text for white labeling purposes
export const branding = s => {
  return Object.entries(Config.get("branding")).reduce(
    (acc, [search, replace]) => acc.replace(new RegExp(search, "ig"), replace),
    s
  );
};
