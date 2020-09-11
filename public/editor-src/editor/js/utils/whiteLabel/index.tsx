import Config from "visual/global/Config";

export const getWhiteLabel = (): boolean => {
  const pro = Config.get("pro");

  return pro?.whiteLabel ?? false;
};
